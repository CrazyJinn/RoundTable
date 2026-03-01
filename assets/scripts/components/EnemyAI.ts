/**
 * 敌人AI组件
 * @brief 控制敌人行为的AI系统
 */

import { _decorator, Component, Node } from 'cc';
import { Enemy, EnemyCategory } from '../entities/Enemy';
import { AIState } from '../data/types';
import { AI_CONFIG } from '../data/constants';
import { GameManager } from '../core/GameManager';

const { ccclass, property } = _decorator;

/**
 * 敌人AI控制器
 * 实现状态机驱动的敌人行为
 */
@ccclass('EnemyAI')
export class EnemyAI extends Component {
    /** 控制的敌人 */
    private enemy: Enemy | null = null;

    /** 当前状态 */
    private currentState: AIState = AIState.Idle;

    /** 状态更新函数映射 */
    private stateUpdaters: Map<AIState, (dt: number) => void> = new Map();

    /**
     * 初始化AI
     */
    init(enemy: Enemy): void {
        this.enemy = enemy;

        // 注册状态更新函数
        this.stateUpdaters.set(AIState.Idle, this.updateIdle.bind(this));
        this.stateUpdaters.set(AIState.Patrol, this.updatePatrol.bind(this));
        this.stateUpdaters.set(AIState.Chase, this.updateChase.bind(this));
        this.stateUpdaters.set(AIState.Attack, this.updateAttack.bind(this));
        this.stateUpdaters.set(AIState.Flee, this.updateFlee.bind(this));
        this.stateUpdaters.set(AIState.Enrage, this.updateEnrage.bind(this));
    }

    /**
     * 获取敌人
     */
    getEnemy(): Enemy | null {
        return this.enemy;
    }

    /**
     * 每帧更新
     */
    update(dt: number): void {
        if (!this.enemy || this.enemy.isDead) return;

        // 更新敌人基础逻辑
        this.enemy.update(dt);

        // 状态机更新
        this.updateStateMachine(dt);

        // 同步节点位置
        this.node.setPosition(this.enemy.position.x, this.enemy.position.y, 0);
    }

    /**
     * 更新状态机
     */
    private updateStateMachine(dt: number): void {
        if (!this.enemy) return;

        // 检查状态转换
        this.checkStateTransitions();

        // 执行当前状态的更新
        const updater = this.stateUpdaters.get(this.currentState);
        if (updater) {
            updater(dt);
        }
    }

    /**
     * 检查状态转换
     */
    private checkStateTransitions(): void {
        if (!this.enemy) return;

        // 检查死亡
        if (this.enemy.isDead) return;

        // 优先级：狂暴 > 逃跑 > 攻击 > 追击 > 巡逻 > 待机

        // 检查狂暴（精英怪）
        if (this.enemy.shouldEnrage()) {
            this.changeState(AIState.Enrage);
            return;
        }

        // 检查逃跑
        if (this.enemy.shouldFlee() && !this.enemy.isElite) {
            this.changeState(AIState.Flee);
            return;
        }

        // 检查攻击范围
        if (this.enemy.isPlayerInAttackRange()) {
            this.changeState(AIState.Attack);
            return;
        }

        // 检查检测范围
        if (this.enemy.detectPlayer()) {
            this.changeState(AIState.Chase);
            return;
        }

        // 默认状态
        if (this.currentState !== AIState.Patrol && this.currentState !== AIState.Idle) {
            this.changeState(AIState.Patrol);
        }
    }

    /**
     * 切换状态
     */
    private changeState(newState: AIState): void {
        if (this.currentState === newState) return;

        // 退出旧状态
        this.onStateExit(this.currentState);

        // 进入新状态
        this.currentState = newState;
        this.enemy?.setAIState(newState);
        this.onStateEnter(newState);
    }

    /**
     * 进入状态
     */
    private onStateEnter(state: AIState): void {
        switch (state) {
            case AIState.Patrol:
                this.enemy?.setPatrolWait();
                break;
        }
    }

    /**
     * 退出状态
     */
    private onStateExit(state: AIState): void {
        // 状态退出时的清理工作
    }

    // === 状态更新函数 ===

    /**
     * 待机状态
     */
    private updateIdle(dt: number): void {
        // 待机时检查是否开始巡逻
        if (Math.random() < 0.01) {
            this.changeState(AIState.Patrol);
        }
    }

    /**
     * 巡逻状态
     */
    private updatePatrol(dt: number): void {
        if (!this.enemy) return;

        // 等待中
        if (this.enemy.isPatrolWaiting()) {
            return;
        }

        // 获取巡逻目标
        const target = this.enemy.getPatrolTarget();
        if (!target) {
            this.enemy.setPatrolWait();
            return;
        }

        // 移动向目标
        this.enemy.moveToward(target, dt);

        // 检查是否到达目标
        if (this.enemy.hasReachedPatrolTarget()) {
            this.enemy.setPatrolWait();
        }
    }

    /**
     * 追击状态
     */
    private updateChase(dt: number): void {
        if (!this.enemy) return;

        const player = GameManager.instance.getCurrentPlayer();
        if (!player) return;

        // 移动向玩家
        this.enemy.moveToward(player.position, dt);
    }

    /**
     * 攻击状态
     */
    private updateAttack(dt: number): void {
        if (!this.enemy) return;

        // 尝试攻击
        if (this.enemy.canAttack()) {
            this.enemy.attack();
        }

        // 面向玩家
        // 可以在这里添加面向逻辑
    }

    /**
     * 逃跑状态
     */
    private updateFlee(dt: number): void {
        if (!this.enemy) return;

        const player = GameManager.instance.getCurrentPlayer();
        if (!player) return;

        // 远离玩家
        this.enemy.moveAwayFrom(player.position, dt);

        // 如果距离够远，恢复巡逻
        if (this.enemy.getDistanceToPlayer() > this.enemy.aiStats.detectRange * 2) {
            this.changeState(AIState.Patrol);
        }
    }

    /**
     * 狂暴状态
     */
    private updateEnrage(dt: number): void {
        if (!this.enemy) return;

        const player = GameManager.instance.getCurrentPlayer();
        if (!player) return;

        // 狂暴状态下追击更激进
        if (!this.enemy.isPlayerInAttackRange()) {
            this.enemy.moveToward(player.position, dt);
        } else {
            // 攻击更频繁
            if (this.enemy.canAttack()) {
                this.enemy.attack();
            }
        }
    }
}
