/**
 * 战斗系统数据结构
 */

/**
 * 角色类型
 */
export enum CharacterType {
    PLAYER = 'player',
    ENEMY = 'enemy',
    NPC = 'npc'
}

/**
 * 攻击类型
 */
export enum AttackType {
    PHYSICAL = 'physical',     // 物理攻击
    MAGICAL = 'magical',       // 魔法攻击
    RANGED = 'ranged'          // 远程攻击
}

/**
 * 技能数据
 */
export interface SkillData {
    id: string;                // 技能ID
    name: string;              // 技能名称
    description: string;       // 技能描述
    damage: number;            // 伤害值
    range: number;             // 攻击范围
    cooldown: number;          // 冷却时间（秒）
    mpCost: number;            // 魔法消耗
    attackType: AttackType;    // 攻击类型
}

/**
 * 角色属性
 */
export interface CharacterStats {
    maxHealth: number;         // 最大生命值
    health: number;            // 当前生命值
    maxMana: number;           // 最大魔法值
    mana: number;              // 当前魔法值
    attack: number;            // 攻击力
    defense: number;           // 防御力
    speed: number;             // 移动速度
    attackSpeed: number;       // 攻击速度
    critRate: number;          // 暴击率
    critDamage: number;        // 暴击伤害
}

/**
 * 伤害结果
 */
export interface DamageResult {
    damage: number;            // 造成伤害
    isCrit: boolean;           // 是否暴击
    isDodged: boolean;         // 是否闪避
    damageType: AttackType;    // 伤害类型
}

/**
 * 战斗单位数据
 */
export interface CombatUnitData {
    id: string;                // 单位ID
    name: string;              // 名称
    type: CharacterType;       // 类型
    stats: CharacterStats;     // 属性
    skills: SkillData[];       // 技能列表
}
