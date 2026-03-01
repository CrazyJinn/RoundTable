/**
 * 单位基类
 * @brief 所有可战斗实体的基类
 */

import { Vec2 } from 'cc';
import { BaseStats, StatusEffect, GameEventType } from '../data/types';
import { EventManager } from '../data/EventManager';
import { CombatSystem } from '../systems/CombatSystem';

/**
 * 单位基类
 * 所有可战斗实体（玩家、敌人、NPC）的基类
 */
export abstract class Unit {
    /** 唯一ID */
    public readonly id: string;

    /** 单位名称 */
    public name: string;

    /** 位置 */
    public position: Vec2;

    /** 属性 */
    public stats: BaseStats;

    /** 活跃的状态效果 */
    public activeEffects: StatusEffect[] = [];

    /** 是否死亡 */
    public isDead: boolean = false;

    /** 无敌时间 */
    protected invincibilityTime: number = 0;

    /** 击退速度 */
    protected knockbackVelocity: Vec2 = Vec2.ZERO;

    /** 击退减速度 */
    protected knockbackDeceleration: number = 500;

    /**
     * 构造函数
     * @param id 唯一ID
     * @param name 名称
     * @param stats 属性
     */
    constructor(id: string, name: string, stats: BaseStats) {
        this.id = id;
        this.name = name;
        this.stats = { ...stats };
        this.position = new Vec2(0, 0);
    }

    /**
     * 更新（每帧调用）
     * @param dt 时间增量
     */
    update(dt: number): void {
        if (this.isDead) return;

        // 更新无敌时间
        if (this.invincibilityTime > 0) {
            this.invincibilityTime -= dt;
        }

        // 更新击退
        this.updateKnockback(dt);

        // 更新状态效果
        CombatSystem.instance.updateEffects(this, dt);
    }

    /**
     * 受到伤害
     * @param damage 伤害值
     * @param source 伤害来源
     */
    takeDamage(damage: number, source: Unit | null): void {
        if (this.isDead || this.invincibilityTime > 0) return;

        this.stats.currentHp = Math.max(0, this.stats.currentHp - damage);

        console.log(`[Unit] ${this.name} took ${damage} damage, HP: ${this.stats.currentHp}/${this.stats.maxHp}`);

        // 检查死亡
        if (this.stats.currentHp <= 0) {
            this.die();
        }
    }

    /**
     * 治疗
     * @param amount 治疗量
     */
    heal(amount: number): void {
        if (this.isDead) return;

        const oldHp = this.stats.currentHp;
        this.stats.currentHp = Math.min(this.stats.maxHp, this.stats.currentHp + amount);

        console.log(`[Unit] ${this.name} healed ${this.stats.currentHp - oldHp}, HP: ${this.stats.currentHp}/${this.stats.maxHp}`);
    }

    /**
     * 死亡
     */
    die(): void {
        if (this.isDead) return;

        this.isDead = true;
        console.log(`[Unit] ${this.name} died`);

        EventManager.instance.emit(GameEventType.UnitDeath, {
            unitId: this.id,
            unitName: this.name
        });

        this.onDeath();
    }

    /**
     * 死亡回调（子类实现）
     */
    protected abstract onDeath(): void;

    /**
     * 应用击退
     * @param direction 方向
     * @param force 力度
     */
    applyKnockback(direction: Vec2, force: number): void {
        this.knockbackVelocity = direction.clone().multiplyScalar(force);
    }

    /**
     * 更新击退
     * @param dt 时间增量
     */
    protected updateKnockback(dt: number): void {
        if (this.knockbackVelocity.length() > 0) {
            // 应用击退移动
            this.position = this.position.add(this.knockbackVelocity.clone().multiplyScalar(dt));

            // 减速
            const speed = this.knockbackVelocity.length();
            const newSpeed = Math.max(0, speed - this.knockbackDeceleration * dt);

            if (newSpeed > 0) {
                this.knockbackVelocity = this.knockbackVelocity.normalize().multiplyScalar(newSpeed);
            } else {
                this.knockbackVelocity = Vec2.ZERO;
            }
        }
    }

    /**
     * 移除状态效果
     * @param effectId 效果ID
     */
    removeEffect(effectId: string): void {
        CombatSystem.instance.removeEffect(this, effectId);
    }

    /**
     * 清除所有状态效果
     */
    clearAllEffects(): void {
        for (const effect of [...this.activeEffects]) {
            this.removeEffect(effect.id);
        }
    }

    /**
     * 获取当前速度（考虑状态效果）
     */
    get currentSpeed(): number {
        return CombatSystem.instance.getModifiedSpeed(this.stats.spd, this.activeEffects);
    }

    /**
     * 获取血量百分比
     */
    get healthPercent(): number {
        return this.stats.currentHp / this.stats.maxHp;
    }

    /**
     * 是否处于无敌状态
     */
    get isInvincible(): boolean {
        return this.invincibilityTime > 0;
    }

    /**
     * 设置无敌时间
     * @param time 时间（秒）
     */
    setInvincible(time: number): void {
        this.invincibilityTime = time;
    }
}
