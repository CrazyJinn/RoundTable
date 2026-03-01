/**
 * 玩家角色
 * @brief 玩家控制的实体类
 */

import { Vec2 } from 'cc';
import { Unit } from './Unit';
import {
    PlayerStats,
    CharacterType,
    SkillInstance,
    SkillData,
    DamageType,
    GameEventType
} from '../data/types';
import { DEFAULT_PLAYER_STATS, DODGE_CONFIG, SKILL_CONFIG } from '../data/constants';
import { EventManager } from '../data/EventManager';
import { CombatSystem } from '../systems/CombatSystem';
import { InputManager, InputAction } from '../core/InputManager';
import { GameManager } from '../core/GameManager';

/**
 * 玩家状态
 */
export enum PlayerState {
    Idle,       // 待机
    Moving,     // 移动中
    Attacking,  // 攻击中
    Dodging,    // 闪避中
    Reloading,  // 换弹中
    Meditating, // 冥想中
    Hurt,       // 受伤
    Dead        // 死亡
}

/**
 * 玩家角色类
 */
export class Player extends Unit {
    /** 角色类型 */
    public readonly characterType: CharacterType;

    /** 当前状态 */
    private _currentState: PlayerState = PlayerState.Idle;
    public get currentState(): PlayerState { return this._currentState; }

    /** 面向方向 */
    private _facingDirection: Vec2 = new Vec2(1, 0);
    public get facingDirection(): Vec2 { return this._facingDirection; }

    /** 技能列表 */
    private skills: Map<string, SkillInstance> = new Map();

    /** 闪避冷却 */
    private dodgeCooldown: number = 0;

    /** 是否在闪避中 */
    private isDodging: boolean = false;

    /** 闪避方向 */
    private dodgeDirection: Vec2 = Vec2.ZERO;

    /** 是否在冥想中（魔法主角） */
    private isMeditating: boolean = false;

    /** 换弹计时器（科技主角） */
    private reloadTimer: number = 0;

    /** 当前弹药（科技主角） */
    private currentAmmo: number = 0;

    /** 最大弹药（科技主角） */
    private maxAmmo: number = 30;

    /**
     * 构造函数
     * @param type 角色类型
     */
    constructor(type: CharacterType) {
        const stats = type === CharacterType.Tech
            ? { ...DEFAULT_PLAYER_STATS.TECH, currentHp: DEFAULT_PLAYER_STATS.TECH.maxHp }
            : { ...DEFAULT_PLAYER_STATS.MAGIC, currentHp: DEFAULT_PLAYER_STATS.MAGIC.maxHp };

        super(`player_${type}`, type === CharacterType.Tech ? '科技主角' : '魔法主角', stats);

        this.characterType = type;
        this.currentAmmo = this.maxAmmo;

        // 初始化默认技能
        this.initDefaultSkills();
    }

    /**
     * 初始化默认技能
     */
    private initDefaultSkills(): void {
        // 技能1
        this.skills.set('skill_1', {
            data: {
                id: 'skill_1',
                name: this.characterType === CharacterType.Tech ? '手雷投掷' : '火球术',
                description: '造成范围伤害',
                cooldown: SKILL_CONFIG.DEFAULT_COOLDOWN,
                mpCost: this.characterType === CharacterType.Magic ? 20 : undefined,
                damage: 30,
                damageType: this.characterType === CharacterType.Tech ? DamageType.Physical : DamageType.Magical,
                range: 200
            },
            currentCooldown: 0,
            isReady: true
        });

        // 技能2
        this.skills.set('skill_2', {
            data: {
                id: 'skill_2',
                name: this.characterType === CharacterType.Tech ? '电磁脉冲' : '冰霜新星',
                description: '造成伤害并减速敌人',
                cooldown: SKILL_CONFIG.DEFAULT_COOLDOWN,
                mpCost: this.characterType === CharacterType.Magic ? 30 : undefined,
                damage: 25,
                damageType: DamageType.Magical,
                range: 150
            },
            currentCooldown: 0,
            isReady: true
        });

        // 终极技能
        this.skills.set('ultimate', {
            data: {
                id: 'ultimate',
                name: this.characterType === CharacterType.Tech ? '轨道轰炸' : '陨石术',
                description: '造成巨大伤害',
                cooldown: SKILL_CONFIG.ULTIMATE_COOLDOWN,
                mpCost: this.characterType === CharacterType.Magic ? 80 : undefined,
                damage: 100,
                damageType: DamageType.Magical,
                range: 300
            },
            currentCooldown: 0,
            isReady: true
        });
    }

    /**
     * 更新（每帧调用）
     * @param dt 时间增量
     */
    update(dt: number): void {
        if (this.isDead) return;

        super.update(dt);

        // 更新技能冷却
        this.updateSkillCooldowns(dt);

        // 更新闪避冷却
        if (this.dodgeCooldown > 0) {
            this.dodgeCooldown -= dt;
        }

        // 更新闪避移动
        if (this.isDodging) {
            this.updateDodge(dt);
        }

        // 更新换弹
        if (this.reloadTimer > 0) {
            this.updateReload(dt);
        }

        // 更新冥想
        if (this.isMeditating) {
            this.updateMeditate(dt);
        }
    }

    /**
     * 移动
     * @param direction 移动方向
     */
    move(direction: Vec2): void {
        if (!this.canAct() || this.isDodging) return;

        if (direction.length() > 0) {
            const normalizedDir = direction.normalize();
            const speed = this.currentSpeed;

            this.position = this.position.add(normalizedDir.clone().multiplyScalar(speed * 0.016)); // 假设60fps

            // 更新面向方向
            this._facingDirection = normalizedDir;

            this._currentState = PlayerState.Moving;
        } else {
            this._currentState = PlayerState.Idle;
        }
    }

    /**
     * 闪避
     */
    dodge(): void {
        if (!this.canAct() || this.dodgeCooldown > 0 || this.isDodging) return;

        // 获取闪避方向（当前移动方向或面向方向）
        const inputDir = InputManager.instance.getMovement();
        this.dodgeDirection = inputDir.length() > 0 ? inputDir : this._facingDirection;

        this.isDodging = true;
        this.dodgeCooldown = DODGE_CONFIG.COOLDOWN;
        this._currentState = PlayerState.Dodging;

        // 设置无敌
        this.setInvincible(DODGE_CONFIG.INVINCIBILITY_TIME);

        console.log(`[Player] ${this.name} dodging`);
    }

    /**
     * 更新闪避
     */
    private updateDodge(dt: number): void {
        const dodgeSpeed = DODGE_CONFIG.DISTANCE / DODGE_CONFIG.INVINCIBILITY_TIME;
        this.position = this.position.add(this.dodgeDirection.clone().multiplyScalar(dodgeSpeed * dt));

        // 闪避结束
        this.invincibilityTime = 0;
        if (!this.isInvincible) {
            this.isDodging = false;
            this._currentState = PlayerState.Idle;
        }
    }

    /**
     * 普通攻击
     */
    attack(): void {
        if (!this.canAct()) return;

        // 科技主角检查弹药
        if (this.characterType === CharacterType.Tech && this.currentAmmo <= 0) {
            console.log(`[Player] ${this.name} out of ammo, need to reload`);
            return;
        }

        // 魔法主角检查MP
        if (this.characterType === CharacterType.Magic) {
            const mp = (this.stats as PlayerStats).currentMp || 0;
            if (mp < 5) {
                console.log(`[Player] ${this.name} not enough MP`);
                return;
            }
            this.consumeMp(5);
        }

        // 消耗弹药
        if (this.characterType === CharacterType.Tech) {
            this.currentAmmo--;
        }

        this._currentState = PlayerState.Attacking;

        // 获取鼠标位置，计算攻击方向
        const mousePos = InputManager.instance.getMouseWorldPosition();
        this._facingDirection = mousePos.subtract(this.position).normalize();

        // TODO: 实际的攻击逻辑（创建攻击判定、播放动画等）

        console.log(`[Player] ${this.name} attacking, ammo: ${this.currentAmmo}/${this.maxAmmo}`);

        EventManager.instance.emit(GameEventType.SkillUsed, {
            skillId: 'basic_attack',
            playerId: this.id
        });
    }

    /**
     * 使用技能
     * @param skillId 技能ID
     */
    useSkill(skillId: string): void {
        if (!this.canAct()) return;

        const skill = this.skills.get(skillId);
        if (!skill || !skill.isReady) {
            console.log(`[Player] ${this.name} skill ${skillId} not ready`);
            return;
        }

        // 检查MP消耗
        if (skill.data.mpCost && this.characterType === CharacterType.Magic) {
            const mp = (this.stats as PlayerStats).currentMp || 0;
            if (mp < skill.data.mpCost) {
                console.log(`[Player] ${this.name} not enough MP for ${skillId}`);
                return;
            }
            this.consumeMp(skill.data.mpCost);
        }

        // 设置冷却
        skill.currentCooldown = skill.data.cooldown;
        skill.isReady = false;

        this._currentState = PlayerState.Attacking;

        // TODO: 实际的技能逻辑

        console.log(`[Player] ${this.name} using skill ${skillId}: ${skill.data.name}`);

        EventManager.instance.emit(GameEventType.SkillUsed, {
            skillId,
            playerId: this.id
        });
    }

    /**
     * 使用终极技能
     */
    useUltimate(): void {
        this.useSkill('ultimate');
    }

    /**
     * 换弹（科技主角）
     */
    reload(): void {
        if (this.characterType !== CharacterType.Tech) return;
        if (!this.canAct() || this.reloadTimer > 0) return;
        if (this.currentAmmo >= this.maxAmmo) return;

        this.reloadTimer = SKILL_CONFIG.RELOAD_TIME;
        this._currentState = PlayerState.Reloading;

        console.log(`[Player] ${this.name} reloading...`);
    }

    /**
     * 更新换弹
     */
    private updateReload(dt: number): void {
        this.reloadTimer -= dt;

        if (this.reloadTimer <= 0) {
            this.currentAmmo = this.maxAmmo;
            this.reloadTimer = 0;
            this._currentState = PlayerState.Idle;

            console.log(`[Player] ${this.name} reload complete`);
        }
    }

    /**
     * 冥想（魔法主角）
     */
    meditate(): void {
        if (this.characterType !== CharacterType.Magic) return;
        if (!this.canAct()) return;

        this.isMeditating = true;
        this._currentState = PlayerState.Meditating;

        console.log(`[Player] ${this.name} meditating...`);
    }

    /**
     * 停止冥想
     */
    stopMeditate(): void {
        this.isMeditating = false;
        if (this._currentState === PlayerState.Meditating) {
            this._currentState = PlayerState.Idle;
        }
    }

    /**
     * 更新冥想
     */
    private updateMeditate(dt: number): void {
        if (!this.isMeditating) return;

        const stats = this.stats as PlayerStats;
        if (stats.maxMp && stats.currentMp !== undefined) {
            stats.currentMp = Math.min(stats.maxMp, stats.currentMp + SKILL_CONFIG.MEDITATE_MP_RECOVERY * dt);
        }
    }

    /**
     * 消耗MP
     */
    private consumeMp(amount: number): void {
        const stats = this.stats as PlayerStats;
        if (stats.currentMp !== undefined) {
            stats.currentMp = Math.max(0, stats.currentMp - amount);
        }
    }

    /**
     * 交互
     */
    interact(): void {
        if (!this.canAct()) return;

        // TODO: 检测附近的可交互物体并执行交互

        console.log(`[Player] ${this.name} interacting`);
    }

    /**
     * 更新技能冷却
     */
    private updateSkillCooldowns(dt: number): void {
        this.skills.forEach((skill) => {
            if (skill.currentCooldown > 0) {
                skill.currentCooldown -= dt;
                if (skill.currentCooldown <= 0) {
                    skill.currentCooldown = 0;
                    skill.isReady = true;
                }
            }
        });
    }

    /**
     * 获取技能
     */
    getSkill(skillId: string): SkillInstance | undefined {
        return this.skills.get(skillId);
    }

    /**
     * 是否可以行动
     */
    private canAct(): boolean {
        return !this.isDead &&
               !this.isDodging &&
               this._currentState !== PlayerState.Reloading &&
               this._currentState !== PlayerState.Meditating &&
               GameManager.instance.canControl;
    }

    /**
     * 死亡回调
     */
    protected onDeath(): void {
        this._currentState = PlayerState.Dead;
        this.isDodging = false;
        this.isMeditating = false;

        GameManager.instance.gameOver();
    }

    /**
     * 获取MP百分比（魔法主角）
     */
    get mpPercent(): number {
        const stats = this.stats as PlayerStats;
        if (stats.maxMp && stats.currentMp !== undefined) {
            return stats.currentMp / stats.maxMp;
        }
        return 0;
    }

    /**
     * 获取弹药百分比（科技主角）
     */
    get ammoPercent(): number {
        if (this.characterType === CharacterType.Tech) {
            return this.currentAmmo / this.maxAmmo;
        }
        return 1;
    }
}
