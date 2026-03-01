/**
 * 游戏数据类型定义
 * @brief 定义游戏中使用的所有数据结构和枚举
 */

import { Vec2 } from 'cc';

// ============================================
// 游戏状态枚举
// ============================================

/** 游戏状态 */
export enum GameState {
    Loading,            // 加载中
    Menu,               // 主菜单
    CharacterSelect,    // 角色选择
    Playing,            // 游戏中
    Dialog,             // 对话中
    Inventory,          // 背包界面
    Paused,             // 暂停
    GameOver,           // 游戏结束
    Cutscene            // 过场动画
}

/** 角色类型 */
export enum CharacterType {
    Tech,   // 科技主角
    Magic   // 魔法主角
}

/** 伤害类型 */
export enum DamageType {
    Physical,  // 物理伤害
    Magical,   // 魔法伤害
    True       // 真实伤害
}

/** 状态效果类型 */
export enum StatusEffectType {
    Poison,     // 中毒
    Burn,       // 灼烧
    Slow,       // 减速
    Bleed,      // 流血
    Radiation   // 辐射
}

/** AI状态 */
export enum AIState {
    Idle,       // 待机
    Patrol,     // 巡逻
    Chase,      // 追击
    Attack,     // 攻击
    Flee,       // 逃跑
    Enrage      // 狂暴
}

/** 房间类型 */
export enum RoomType {
    Entrance,   // 入口
    Normal,     // 普通房
    Elite,      // 精英房
    Boss,       // Boss房
    Hidden      // 隐藏房
}

// ============================================
// 属性接口
// ============================================

/** 基础属性 */
export interface BaseStats {
    maxHp: number;
    currentHp: number;
    atk: number;
    def: number;
    spd: number;
    critRate: number;
    critDamage: number;
}

/** 玩家属性（含MP） */
export interface PlayerStats extends BaseStats {
    maxMp?: number;
    currentMp?: number;
}

/** 敌人属性 */
export interface EnemyStats extends BaseStats {
    detectRange: number;
    attackRange: number;
    patrolRange: number;
    fleeHealthPercent: number;
    enrageHealthPercent?: number;
}

// ============================================
// 伤害接口
// ============================================

/** 伤害数据 */
export interface DamageData {
    baseDamage: number;
    damageType: DamageType;
    critChance?: number;
    effects?: StatusEffect[];
    knockback?: number;
    sourceId?: string;
}

/** 伤害结果 */
export interface DamageResult {
    finalDamage: number;
    isCrit: boolean;
    isBlocked: boolean;
    effectsApplied: StatusEffect[];
}

// ============================================
// 状态效果接口
// ============================================

/** 状态效果 */
export interface StatusEffect {
    id: string;
    type: StatusEffectType;
    duration: number;
    value: number;
    tickInterval?: number;
    remainingTime?: number;
}

// ============================================
// 技能接口
// ============================================

/** 技能数据 */
export interface SkillData {
    id: string;
    name: string;
    description: string;
    cooldown: number;
    mpCost?: number;
    damage: number;
    damageType: DamageType;
    range: number;
    effects?: StatusEffect[];
    icon?: string;
}

/** 技能实例 */
export interface SkillInstance {
    data: SkillData;
    currentCooldown: number;
    isReady: boolean;
}

// ============================================
// 物品接口
// ============================================

/** 物品类型 */
export enum ItemType {
    Consumable, // 消耗品
    Equipment,  // 装备
    Material,   // 材料
    Key         // 关键道具
}

/** 物品数据 */
export interface ItemData {
    id: string;
    name: string;
    description: string;
    type: ItemType;
    icon: string;
    maxStack: number;
    price: number;
    effects?: ItemEffect[];
}

/** 物品效果 */
export interface ItemEffect {
    type: 'heal' | 'buff' | 'restore';
    value: number;
    duration?: number;
}

/** 物品实例 */
export interface ItemInstance {
    data: ItemData;
    quantity: number;
}

// ============================================
// 副本接口
// ============================================

/** 敌人生成配置 */
export interface EnemySpawn {
    enemyId: string;
    position: Vec2;
    spawnDelay?: number;
}

/** 副本房间 */
export interface DungeonRoom {
    id: string;
    type: RoomType;
    enemies: EnemySpawn[];
    completed: boolean;
    doors: Door[];
    rewards?: Reward[];
}

/** 门 */
export interface Door {
    id: string;
    targetRoomId: string;
    position: Vec2;
    locked: boolean;
    unlockCondition?: string;
}

/** 奖励 */
export interface Reward {
    type: 'currency' | 'item' | 'experience';
    id?: string;
    quantity: number;
}

/** 副本进度 */
export interface DungeonProgress {
    dungeonId: string;
    currentRoomId: string;
    completedRooms: string[];
    totalRooms: number;
    startTime: number;
}

// ============================================
// 存档接口
// ============================================

/** 玩家存档数据 */
export interface PlayerSaveData {
    characterType: CharacterType;
    stats: PlayerStats;
    currency: number;
    inventory: ItemInstance[];
    skills: string[];
    position: Vec2;
    sceneName: string;
}

/** 游戏存档数据 */
export interface GameSaveData {
    version: string;
    timestamp: number;
    player: PlayerSaveData;
    dungeonProgress?: DungeonProgress;
    completedQuests: string[];
    flags: Record<string, boolean>;
}

// ============================================
// 事件接口
// ============================================

/** 游戏事件类型 */
export enum GameEventType {
    // 战斗事件
    DamageDealt,
    DamageTaken,
    UnitDeath,
    EffectApplied,
    EffectRemoved,

    // 玩家事件
    LevelUp,
    SkillUsed,
    ItemUsed,
    CurrencyChanged,

    // 副本事件
    RoomEntered,
    RoomCleared,
    DungeonComplete,

    // UI事件
    DialogStart,
    DialogEnd,
    MenuOpen,
    MenuClose
}

/** 游戏事件 */
export interface GameEvent {
    type: GameEventType;
    data?: any;
    timestamp: number;
}
