import { _decorator, Component, Node, Vec3 } from 'cc';
import { CharacterType, AttackType, CharacterStats, DamageResult } from '../data/CombatData';
const { ccclass } = _decorator;

/**
 * 战斗系统
 * 处理伤害计算、战斗判定等核心逻辑
 */
@ccclass('CombatSystem')
export class CombatSystem extends Component {
    private static _instance: CombatSystem;

    // 战斗状态
    private _isInBattle: boolean = false;
    private _battleUnits: Map<string, Node> = new Map();

    public static get instance(): CombatSystem {
        return CombatSystem._instance;
    }

    public get isInBattle(): boolean {
        return this._isInBattle;
    }

    onLoad() {
        if (CombatSystem._instance) {
            this.node.destroy();
            return;
        }
        CombatSystem._instance = this;
        console.log('[CombatSystem] 初始化完成');
    }

    /**
     * 开始战斗
     */
    public startBattle() {
        if (this._isInBattle) {
            console.warn('[CombatSystem] 战斗已在进行中');
            return;
        }

        this._isInBattle = true;
        console.log('[CombatSystem] 战斗开始');

        this.node.emit('battle-started');
    }

    /**
     * 结束战斗
     */
    public endBattle(victory: boolean) {
        if (!this._isInBattle) return;

        this._isInBattle = false;
        console.log(`[CombatSystem] 战斗结束 - ${victory ? '胜利' : '失败'}`);

        this.node.emit('battle-ended', victory);

        // 清空战斗单位
        this._battleUnits.clear();
    }

    /**
     * 注册战斗单位
     */
    public registerCombatUnit(id: string, unit: Node) {
        this._battleUnits.set(id, unit);
    }

    /**
     * 移除战斗单位
     */
    public unregisterCombatUnit(id: string) {
        this._battleUnits.delete(id);
    }

    /**
     * 计算伤害
     */
    public calculateDamage(
        attackerStats: CharacterStats,
        defenderStats: CharacterStats,
        attackType: AttackType,
        baseDamage: number
    ): DamageResult {
        // 基础伤害 = 攻击者攻击力 + 技能基础伤害
        let damage = attackerStats.attack + baseDamage;

        // 防御减伤
        const defense = defenderStats.defense;
        const reduction = defense / (defense + 100);
        damage = damage * (1 - reduction);

        // 暴击判定
        const isCrit = Math.random() < attackerStats.critRate;
        if (isCrit) {
            damage *= attackerStats.critDamage;
        }

        // 闪避判定
        const isDodged = Math.random() < 0.05; // 5%基础闪避率

        // 向下取整
        damage = Math.floor(damage);
        // 至少造成1点伤害
        damage = Math.max(1, damage);

        return {
            damage: damage,
            isCrit: isCrit,
            isDodged: isDodged,
            damageType: attackType
        };
    }

    /**
     * 造成伤害
     */
    public dealDamage(
        attackerId: string,
        targetId: string,
        baseDamage: number,
        attackType: AttackType
    ): DamageResult | null {
        const attacker = this._battleUnits.get(attackerId);
        const target = this._battleUnits.get(targetId);

        if (!attacker || !target) {
            console.error(`[CombatSystem] 找不到战斗单位: ${!attacker ? attackerId : targetId}`);
            return null;
        }

        const attackerStats = attacker.getComponent('Character')?.stats;
        const targetStats = target.getComponent('Character')?.stats;

        if (!attackerStats || !targetStats) {
            console.error('[CombatSystem] 角色没有属性数据');
            return null;
        }

        const result = this.calculateDamage(attackerStats, targetStats, attackType, baseDamage);

        // 应用伤害
        if (!result.isDodged) {
            target.getComponent('Character')?.takeDamage(result.damage);
        }

        console.log(`[CombatSystem] ${attackerId} -> ${targetId}: ${result.damage} 伤害${result.isCrit ? ' (暴击!)' : ''}${result.isDodged ? ' (闪避!)' : ''}`);

        // 发送伤害事件
        this.node.emit('damage-dealt', {
            attacker: attackerId,
            target: targetId,
            result: result
        });

        return result;
    }

    /**
     * 检查距离
     */
    public getDistance(pos1: Vec3, pos2: Vec3): number {
        return Vec3.distance(pos1, pos2);
    }

    /**
     * 检查是否在攻击范围内
     */
    public isInRange(attackerPos: Vec3, targetPos: Vec3, range: number): boolean {
        return this.getDistance(attackerPos, targetPos) <= range;
    }

    /**
     * 获取范围内的敌人
     */
    public getEnemiesInRange(centerPos: Vec3, range: number, faction: string): Node[] {
        const enemies: Node[] = [];

        this._battleUnits.forEach((unit, id) => {
            const unitPos = unit.getPosition();
            const unitFaction = unit.getComponent('Character')?.faction;

            if (unitFaction !== faction && this.isInRange(centerPos, unitPos, range)) {
                enemies.push(unit);
            }
        });

        return enemies;
    }

    /**
     * 范围伤害
     */
    public dealAreaDamage(
        attackerId: string,
        centerPos: Vec3,
        range: number,
        baseDamage: number,
        attackType: AttackType,
        excludeFaction: string
    ): DamageResult[] {
        const results: DamageResult[] = [];

        this._battleUnits.forEach((unit, id) => {
            const unitFaction = unit.getComponent('Character')?.faction;

            // 不攻击同阵营
            if (unitFaction === excludeFaction) return;

            const unitPos = unit.getPosition();

            // 检查是否在范围内
            if (this.isInRange(centerPos, unitPos, range)) {
                const result = this.dealDamage(attackerId, id, baseDamage, attackType);
                if (result) {
                    results.push(result);
                }
            }
        });

        return results;
    }

    /**
     * 注册事件监听
     */
    public on(event: string, callback: Function) {
        this.node.on(event, callback);
    }

    /**
     * 移除事件监听
     */
    public off(event: string, callback: Function) {
        this.node.off(event, callback);
    }
}
