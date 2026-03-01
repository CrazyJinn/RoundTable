/**
 * 敌人实体
 * @brief 敌人基类
 */

import { Vec2 } from 'cc';
import { Unit } from './Unit';
import { EnemyStats, AIState, DamageType, GameEventType } from '../data/types';
import { AI_CONFIG } from '../data/constants';
import { EventManager } from '../data/EventManager';
import { GameManager } from '../core/GameManager';

/**
 * 敌人类型
 */
export enum EnemyCategory {
    Animal,     // 动物类
    Plant,      // 植物类
    Humanoid,   // 人形类
    Boss        // Boss
}

/**
 * 敌人配置
 */
export interface EnemyConfig {
    id: string;
    name: string;
    category: EnemyCategory;
    stats: EnemyStats;
    isElite?: boolean;
    drops?: EnemyDrop[];
}

/**
 * 掉落物品
 */
export interface EnemyDrop {
    itemId: string;
    chance: number;     // 掉落概率 0-1
    minQuantity: number;
    maxQuantity: number;
}

/**
 * 敌人实体类
 */
export class Enemy extends Unit {
    /** 敌人类型 */
    public readonly category: EnemyCategory;

    /** 是否为精英 */
    public readonly isElite: boolean;

    /** AI状态 */
    private _aiState: AIState = AIState.Idle;
    public get aiState(): AIState { return this._aiState; }

    /** 掉落配置 */
    public readonly drops: EnemyDrop[];

    /** 攻击冷却 */
    private attackCooldown: number = 0;

    /** 巡逻目标点 */
    private patrolTarget: Vec2 | null = null;

    /** 巡逻等待时间 */
    private patrolWaitTime: number = 0;

    /** 初始位置 */
    private spawnPosition: Vec2 = Vec2.ZERO;

    /** AI配置 */
    public readonly aiStats: EnemyStats;

    /** 是否在狂暴状态 */
    private isEnraged: boolean = false;

    /**
     * 构造函数
     * @param config 敌人配置
     */
    constructor(config: EnemyConfig) {
        super(config.id, config.name, config.stats);

        this.category = config.category;
        this.isElite = config.isElite || false;
        this.drops = config.drops || [];
        this.aiStats = config.stats;

        // 精英怪属性加成
        if (this.isElite) {
            this.stats.maxHp *= 2;
            this.stats.currentHp = this.stats.maxHp;
            this.stats.atk *= 1.5;
        }
    }

    /**
     * 初始化位置
     */
    setSpawnPosition(pos: Vec2): void {
        this.spawnPosition = pos.clone();
        this.position = pos.clone();
    }

    /**
     * 更新
     */
    update(dt: number): void {
        if (this.isDead) return;

        super.update(dt);

        // 更新攻击冷却
        if (this.attackCooldown > 0) {
            this.attackCooldown -= dt;
        }

        // 更新巡逻等待
        if (this.patrolWaitTime > 0) {
            this.patrolWaitTime -= dt;
        }
    }

    /**
     * 设置AI状态
     */
    setAIState(state: AIState): void {
        if (this._aiState === state) return;

        const oldState = this._aiState;
        this._aiState = state;

        // 状态切换时的处理
        switch (state) {
            case AIState.Idle:
                this.patrolTarget = null;
                break;
            case AIState.Patrol:
                this.generatePatrolTarget();
                break;
            case AIState.Enrage:
                this.enterEnrage();
                break;
        }
    }

    /**
     * 检测玩家
     */
    detectPlayer(): boolean {
        const player = GameManager.instance.getCurrentPlayer();
        if (!player || player.isDead) return false;

        const distance = this.position.clone().subtract(player.position).length();
        return distance <= this.aiStats.detectRange;
    }

    /**
     * 检测玩家是否在攻击范围内
     */
    isPlayerInAttackRange(): boolean {
        const player = GameManager.instance.getCurrentPlayer();
        if (!player || player.isDead) return false;

        const distance = this.position.clone().subtract(player.position).length();
        return distance <= this.aiStats.attackRange;
    }

    /**
     * 获取到玩家的方向
     */
    getDirectionToPlayer(): Vec2 {
        const player = GameManager.instance.getCurrentPlayer();
        if (!player) return Vec2.ZERO;

        return player.position.clone().subtract(this.position).normalize();
    }

    /**
     * 获取到玩家的距离
     */
    getDistanceToPlayer(): number {
        const player = GameManager.instance.getCurrentPlayer();
        if (!player) return Infinity;

        return this.position.clone().subtract(player.position).length();
    }

    /**
     * 移动向目标
     */
    moveToward(target: Vec2, dt: number): void {
        const direction = target.clone().subtract(this.position).normalize();
        const speed = this.currentSpeed;

        this.position = this.position.add(direction.multiplyScalar(speed * dt));
    }

    /**
     * 远离目标
     */
    moveAwayFrom(target: Vec2, dt: number): void {
        const direction = this.position.clone().subtract(target).normalize();
        const speed = this.currentSpeed;

        this.position = this.position.add(direction.multiplyScalar(speed * dt));
    }

    /**
     * 生成巡逻目标点
     */
    private generatePatrolTarget(): void {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * this.aiStats.patrolRange;

        this.patrolTarget = new Vec2(
            this.spawnPosition.x + Math.cos(angle) * distance,
            this.spawnPosition.y + Math.sin(angle) * distance
        );
    }

    /**
     * 获取巡逻目标
     */
    getPatrolTarget(): Vec2 | null {
        return this.patrolTarget;
    }

    /**
     * 设置巡逻等待
     */
    setPatrolWait(): void {
        this.patrolWaitTime = AI_CONFIG.PATROL_WAIT_TIME;
        this.patrolTarget = null;
    }

    /**
     * 是否在巡逻等待中
     */
    isPatrolWaiting(): boolean {
        return this.patrolWaitTime > 0;
    }

    /**
     * 检查是否到达巡逻目标
     */
    hasReachedPatrolTarget(): boolean {
        if (!this.patrolTarget) return true;

        const distance = this.position.clone().subtract(this.patrolTarget).length();
        return distance < 10;
    }

    /**
     * 检查是否可以攻击
     */
    canAttack(): boolean {
        return this.attackCooldown <= 0 && this.isPlayerInAttackRange();
    }

    /**
     * 执行攻击
     */
    attack(): void {
        if (!this.canAttack()) return;

        const player = GameManager.instance.getCurrentPlayer();
        if (!player) return;

        // 设置攻击冷却
        this.attackCooldown = AI_CONFIG.ATTACK_INTERVAL;

        // 造成伤害
        // CombatSystem.instance.dealDamage(this, player, {
        //     baseDamage: this.stats.atk,
        //     damageType: DamageType.Physical
        // });

        console.log(`[Enemy] ${this.name} attacking player`);
    }

    /**
     * 进入狂暴状态
     */
    private enterEnrage(): void {
        if (this.isEnraged) return;

        this.isEnraged = true;
        this.stats.atk *= 1.5;
        this.stats.spd *= 1.2;

        console.log(`[Enemy] ${this.name} entered enrage state!`);
    }

    /**
     * 检查是否应该逃跑
     */
    shouldFlee(): boolean {
        return this.healthPercent <= this.aiStats.fleeHealthPercent;
    }

    /**
     * 检查是否应该狂暴（精英怪）
     */
    shouldEnrage(): boolean {
        if (!this.isElite || this.isEnraged) return false;
        return this.aiStats.enrageHealthPercent !== undefined &&
               this.healthPercent <= this.aiStats.enrageHealthPercent;
    }

    /**
     * 获取掉落物品
     */
    getDrops(): EnemyDrop[] {
        return this.drops.filter(drop => Math.random() < drop.chance);
    }

    /**
     * 死亡回调
     */
    protected onDeath(): void {
        // 处理掉落
        const drops = this.getDrops();
        for (const drop of drops) {
            const quantity = Math.floor(
                Math.random() * (drop.maxQuantity - drop.minQuantity + 1) + drop.minQuantity
            );
            // TODO: 生成掉落物品

            console.log(`[Enemy] ${this.name} dropped ${drop.itemId} x${quantity}`);
        }

        // 掉落货币（如果是人形敌人）
        if (this.category === EnemyCategory.Humanoid) {
            const currency = Math.floor(Math.random() * 20 + 10);
            GameManager.instance.modifyCurrency(currency, 'enemy_drop');
        }

        // 掉落怪物精粹
        const essence = Math.floor(Math.random() * 5 + 1);
        // TODO: 添加怪物精粹到背包

        EventManager.instance.emit(GameEventType.UnitDeath, {
            unitId: this.id,
            unitName: this.name,
            isElite: this.isElite,
            category: this.category
        });
    }
}
