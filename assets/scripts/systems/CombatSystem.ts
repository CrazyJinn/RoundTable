/**
 * 战斗系统
 * @brief 处理战斗逻辑、伤害计算、状态效果
 */

import { Vec2 } from 'cc';
import {
    DamageData,
    DamageResult,
    DamageType,
    StatusEffect,
    StatusEffectType,
    GameEventType
} from '../data/types';
import { COMBAT_CONFIG } from '../data/constants';
import { EventManager } from '../data/EventManager';
import { Unit } from '../entities/Unit';

/**
 * 战斗系统 - 单例
 * 处理伤害计算、状态效果、范围检测
 */
export class CombatSystem {
    public static readonly instance: CombatSystem = new CombatSystem();

    private constructor() {}

    /**
     * 造成伤害
     * @param attacker 攻击者
     * @param target 目标
     * @param damage 伤害数据
     */
    dealDamage(attacker: Unit | null, target: Unit, damage: DamageData): DamageResult {
        const result: DamageResult = {
            finalDamage: 0,
            isCrit: false,
            isBlocked: false,
            effectsApplied: []
        };

        // 检查目标是否有效
        if (!target || target.isDead) {
            return result;
        }

        // 计算基础伤害
        let baseDamage = damage.baseDamage;

        // 暴击判定
        const critChance = damage.critChance || attacker?.stats.critRate || 0;
        result.isCrit = Math.random() < critChance;
        if (result.isCrit) {
            baseDamage *= attacker?.stats.critDamage || COMBAT_CONFIG.DEFAULT_CRIT_MULTIPLIER;
        }

        // 计算防御减伤
        const defense = target.stats.def;
        const defenseReduction = defense / (defense + COMBAT_CONFIG.DEFENSE_COEFFICIENT);

        // 根据伤害类型计算最终伤害
        let finalDamage = baseDamage;
        if (damage.damageType !== DamageType.True) {
            finalDamage = baseDamage * (1 - defenseReduction);

            // 魔法伤害额外计算抗性（如果有）
            if (damage.damageType === DamageType.Magical) {
                // TODO: 添加魔法抗性计算
            }
        }

        result.finalDamage = Math.round(finalDamage);

        // 应用伤害
        target.takeDamage(result.finalDamage, attacker);

        // 应用状态效果
        if (damage.effects && damage.effects.length > 0) {
            for (const effect of damage.effects) {
                const applied = this.applyEffect(target, effect);
                if (applied) {
                    result.effectsApplied.push(effect);
                }
            }
        }

        // 应用击退
        if (damage.knockback && damage.knockback > 0 && attacker) {
            const knockbackDir = target.position.clone().subtract(attacker.position).normalize();
            target.applyKnockback(knockbackDir, damage.knockback);
        }

        // 发布伤害事件
        EventManager.instance.emit(GameEventType.DamageDealt, {
            attacker: attacker?.id,
            target: target.id,
            damage: result.finalDamage,
            isCrit: result.isCrit,
            damageType: damage.damageType
        });

        EventManager.instance.emit(GameEventType.DamageTaken, {
            attacker: attacker?.id,
            target: target.id,
            damage: result.finalDamage,
            isCrit: result.isCrit
        });

        return result;
    }

    /**
     * 治疗
     * @param target 目标
     * @param amount 治疗量
     */
    heal(target: Unit, amount: number): void {
        if (!target || target.isDead) return;

        target.heal(amount);
    }

    /**
     * 应用状态效果
     * @param target 目标
     * @param effect 效果
     */
    applyEffect(target: Unit, effect: StatusEffect): boolean {
        if (!target || target.isDead) return false;

        // 检查效果数量上限
        if (target.activeEffects.length >= COMBAT_CONFIG.MAX_STATUS_EFFECTS) {
            // 移除最早的效果
            target.removeEffect(target.activeEffects[0].id);
        }

        // 检查是否已有相同效果
        const existingEffect = target.activeEffects.find(e => e.type === effect.type);
        if (existingEffect) {
            // 刷新持续时间
            existingEffect.duration = effect.duration;
            existingEffect.remainingTime = effect.duration;
            existingEffect.value = Math.max(existingEffect.value, effect.value);
            return true;
        }

        // 添加新效果
        const newEffect: StatusEffect = {
            ...effect,
            remainingTime: effect.duration
        };
        target.activeEffects.push(newEffect);

        EventManager.instance.emit(GameEventType.EffectApplied, {
            target: target.id,
            effect: newEffect
        });

        return true;
    }

    /**
     * 移除状态效果
     * @param target 目标
     * @param effectId 效果ID
     */
    removeEffect(target: Unit, effectId: string): void {
        const index = target.activeEffects.findIndex(e => e.id === effectId);
        if (index >= 0) {
            const effect = target.activeEffects[index];
            target.activeEffects.splice(index, 1);

            EventManager.instance.emit(GameEventType.EffectRemoved, {
                target: target.id,
                effect: effect
            });
        }
    }

    /**
     * 更新状态效果（每帧调用）
     * @param target 目标
     * @param dt 时间增量
     */
    updateEffects(target: Unit, dt: number): void {
        const effectsToRemove: string[] = [];
        const effectsToTick: StatusEffect[] = [];

        for (const effect of target.activeEffects) {
            effect.remainingTime! -= dt;

            // 处理持续伤害效果
            if (effect.tickInterval && effect.tickInterval > 0) {
                // 简化：每tickInterval秒触发一次
                if (Math.floor(effect.remainingTime! / effect.tickInterval) !==
                    Math.floor((effect.remainingTime! + dt) / effect.tickInterval)) {
                    effectsToTick.push(effect);
                }
            }

            // 检查是否过期
            if (effect.remainingTime! <= 0) {
                effectsToRemove.push(effect.id);
            }
        }

        // 应用持续伤害
        for (const effect of effectsToTick) {
            this.applyEffectDamage(target, effect);
        }

        // 移除过期效果
        for (const id of effectsToRemove) {
            this.removeEffect(target, id);
        }
    }

    /**
     * 应用效果伤害
     */
    private applyEffectDamage(target: Unit, effect: StatusEffect): void {
        let damage = effect.value;

        switch (effect.type) {
            case StatusEffectType.Poison:
            case StatusEffectType.Burn:
            case StatusEffectType.Bleed:
            case StatusEffectType.Radiation:
                target.takeDamage(damage, null);
                break;
            case StatusEffectType.Slow:
                // 减速效果在别处处理
                break;
        }
    }

    /**
     * 获取效果修正后的速度
     * @param baseSpeed 基础速度
     * @param effects 状态效果列表
     */
    getModifiedSpeed(baseSpeed: number, effects: StatusEffect[]): number {
        let speedModifier = 1;

        for (const effect of effects) {
            if (effect.type === StatusEffectType.Slow) {
                speedModifier *= (1 - effect.value / 100);
            }
        }

        return baseSpeed * speedModifier;
    }

    /**
     * 范围伤害
     * @param center 中心点
     * @param radius 半径
     * @param damage 伤害数据
     * @param exclude 排除的单位
     */
    dealAreaDamage(
        center: Vec2,
        radius: number,
        damage: DamageData,
        exclude?: Unit[]
    ): void {
        // TODO: 需要实现单位查询系统
        // 1. 获取范围内的所有单位
        // 2. 过滤排除的单位
        // 3. 对每个单位造成伤害
    }

    /**
     * 扇形伤害
     * @param origin 原点
     * @param direction 方向
     * @param angle 角度（度）
     * @param range 范围
     * @param damage 伤害数据
     */
    dealSectorDamage(
        origin: Vec2,
        direction: Vec2,
        angle: number,
        range: number,
        damage: DamageData
    ): void {
        // TODO: 需要实现单位查询系统
        // 1. 获取范围内的所有单位
        // 2. 检查是否在扇形范围内
        // 3. 对符合条件的单位造成伤害
    }

    /**
     * 检测碰撞
     * @param attacker 攻击者
     * @param target 目标
     * @param hitbox 攻击框
     */
    checkHit(attacker: Unit, target: Unit, hitbox: { position: Vec2; size: Vec2 }): boolean {
        const targetPos = target.position;

        // 简单的AABB碰撞检测
        const halfSize = hitbox.size.clone().multiplyScalar(0.5);
        const minX = hitbox.position.x - halfSize.x;
        const maxX = hitbox.position.x + halfSize.x;
        const minY = hitbox.position.y - halfSize.y;
        const maxY = hitbox.position.y + halfSize.y;

        return targetPos.x >= minX && targetPos.x <= maxX &&
               targetPos.y >= minY && targetPos.y <= maxY;
    }

    /**
     * 计算两点间距离
     */
    getDistance(a: Vec2, b: Vec2): number {
        return a.clone().subtract(b).length();
    }

    /**
     * 检测是否在攻击范围内
     * @param attacker 攻击者位置
     * @param target 目标位置
     * @param range 攻击范围
     */
    isInRange(attacker: Vec2, target: Vec2, range: number): boolean {
        return this.getDistance(attacker, target) <= range;
    }
}
