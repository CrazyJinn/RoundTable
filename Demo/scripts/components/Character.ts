import { _decorator, Component, Node, Sprite, Vec3, UITransform, Animation } from 'cc';
import { CharacterType, CharacterStats, AttackType } from '../data/CombatData';
import { DamageResult } from '../data/CombatData';
const { ccclass, property } = _decorator;

/**
 * 角色组件
 * 处理角色的基础属性、移动、战斗等功能
 */
@ccclass('Character')
export class Character extends Component {
    @property(Sprite)
    sprite: Sprite = null!;

    @property(Animation)
    animation: Animation = null!;

    // 角色数据
    private _id: string = '';
    private _name: string = '';
    private _type: CharacterType = CharacterType.ENEMY;
    private _faction: string = ''; // 阵营：player/enemy

    // 属性
    private _stats: CharacterStats = {
        maxHealth: 100,
        health: 100,
        maxMana: 50,
        mana: 50,
        attack: 10,
        defense: 5,
        speed: 100,
        attackSpeed: 1.0,
        critRate: 0.05,
        critDamage: 1.5
    };

    // 状态
    private _isDead: boolean = false;
    private _isMoving: boolean = false;
    private _isAttacking: boolean = false;
    private _moveTarget: Vec3 = new Vec3();

    public get id(): string { return this._id; }
    public get name(): string { return this._name; }
    public get type(): CharacterType { return this._type; }
    public get faction(): string { return this._faction; }
    public get stats(): CharacterStats { return this._stats; }
    public get isDead(): boolean { return this._isDead; }
    public get isMoving(): boolean { return this._isMoving; }
    public get isAttacking(): boolean { return this._isAttacking; }

    /**
     * 初始化角色
     */
    public init(id: string, name: string, type: CharacterType, faction: string, stats?: Partial<CharacterStats>) {
        this._id = id;
        this._name = name;
        this._type = type;
        this._faction = faction;

        if (stats) {
            Object.assign(this._stats, stats);
        }

        // 初始化当前血量和魔法
        this._stats.health = this._stats.maxHealth;
        this._stats.mana = this._stats.maxMana;

        console.log(`[Character] 初始化角色: ${name} (${type}/${faction})`);

        // 注册到战斗系统
        const combatSystem = this.getComponent('CombatSystem');
        if (combatSystem) {
            // 这里应该获取全局的战斗系统实例
        }
    }

    /**
     * 移动到目标位置
     */
    public moveTo(target: Vec3) {
        if (this._isDead || this._isAttacking) return;

        this._moveTarget.set(target);
        this._isMoving = true;

        // 播放移动动画
        this.playAnimation('walk');
    }

    /**
     * 停止移动
     */
    public stopMovement() {
        this._isMoving = false;
        this.playAnimation('idle');
    }

    /**
     * 攻击目标
     */
    public attack(target: Character, damage: number, attackType: AttackType) {
        if (this._isDead || this._isAttacking) return;

        this._isAttacking = true;

        // 播放攻击动画
        this.playAnimation('attack');

        // 计算伤害
        const combatSystem = this.getComponent('CombatSystem') as any;
        if (combatSystem) {
            combatSystem.dealDamage(this._id, target.id, damage, attackType);
        }

        // 攻击冷却
        this.scheduleOnce(() => {
            this._isAttacking = false;
        }, 1 / this._stats.attackSpeed);
    }

    /**
     * 受到伤害
     */
    public takeDamage(damage: number) {
        if (this._isDead) return;

        this._stats.health -= damage;

        // 播放受伤动画
        this.playAnimation('hurt');

        // 闪红效果
        this.flashRed();

        console.log(`[Character] ${this._name} 受到 ${damage} 伤害，剩余血量: ${this._stats.health}/${this._stats.maxHealth}`);

        // 发送受伤事件
        this.node.emit('character-damaged', {
            id: this._id,
            damage: damage,
            currentHealth: this._stats.health
        });

        // 检查死亡
        if (this._stats.health <= 0) {
            this.die();
        }
    }

    /**
     * 治疗
     */
    public heal(amount: number) {
        if (this._isDead) return;

        this._stats.health = Math.min(this._stats.health + amount, this._stats.maxHealth);

        console.log(`[Character] ${this._name} 恢复 ${amount} 生命值，当前血量: ${this._stats.health}/${this._stats.maxHealth}`);

        // 发送治疗事件
        this.node.emit('character-healed', {
            id: this._id,
            amount: amount,
            currentHealth: this._stats.health
        });
    }

    /**
     * 死亡
     */
    protected die() {
        if (this._isDead) return;

        this._isDead = true;
        this._isMoving = false;
        this._isAttacking = false;

        console.log(`[Character] ${this._name} 死亡`);

        // 播放死亡动画
        this.playAnimation('death');

        // 发送死亡事件
        this.node.emit('character-died', {
            id: this._id,
            name: this._name,
            type: this._type
        });

        // 延迟销毁
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 2);
    }

    /**
     * 闪红效果
     */
    private flashRed() {
        if (!this.sprite) return;

        // 简单的颜色闪烁效果
        const originalColor = this.sprite.color.clone();
        this.sprite.setColor({ r: 255, g: 0, b: 0, a: 255 } as any);

        this.scheduleOnce(() => {
            if (this.sprite && this.sprite.isValid) {
                this.sprite.setColor(originalColor as any);
            }
        }, 0.1);
    }

    /**
     * 播放动画
     */
    public playAnimation(animationName: string) {
        if (this.animation) {
            this.animation.play(animationName);
        }
    }

    /**
     * 更新移动
     */
    updateMovement(deltaTime: number) {
        if (!this._isMoving) return;

        const currentPos = this.node.getPosition();
        const direction = new Vec3();
        Vec3.subtract(direction, this._moveTarget, currentPos);
        direction.y = 0;

        const distance = direction.length();

        if (distance < 1) {
            this.stopMovement();
            return;
        }

        direction.normalize();
        const movement = direction.multiplyScalar(this._stats.speed * deltaTime);

        // 翻转精灵
        if (movement.x > 0) {
            this.node.setScale(1, 1, 1);
        } else if (movement.x < 0) {
            this.node.setScale(-1, 1, 1);
        }

        this.node.setPosition(currentPos.add(movement));
    }

    /**
     * 恢复魔法值
     */
    public restoreMana(amount: number) {
        this._stats.mana = Math.min(this._stats.mana + amount, this._stats.maxMana);
    }

    /**
     * 消耗魔法值
     */
    public consumeMana(amount: number): boolean {
        if (this._stats.mana < amount) {
            return false;
        }

        this._stats.mana -= amount;
        return true;
    }

    update(deltaTime: number) {
        if (!this._isDead) {
            this.updateMovement(deltaTime);
        }
    }

    onDestroy() {
        // 清理
    }
}
