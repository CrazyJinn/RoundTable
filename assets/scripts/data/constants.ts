/**
 * 游戏常量定义
 * @brief 定义游戏中使用的常量值
 */

import { KeyCode } from 'cc';
import { InputAction } from '../core/InputManager';

// ============================================
// 游戏配置常量
// ============================================

/** 游戏配置 */
export const GAME_CONFIG = {
    /** 游戏名称 */
    GAME_NAME: '废土之战',
    /** 版本号 */
    VERSION: '0.1.0',
    /** 目标帧率 */
    TARGET_FPS: 60,
    /** 分辨率 */
    RESOLUTION: { width: 1920, height: 1080 },
    /** 存档版本 */
    SAVE_VERSION: '1.0'
} as const;

// ============================================
// 战斗常量
// ============================================

/** 战斗配置 */
export const COMBAT_CONFIG = {
    /** 默认暴击倍率 */
    DEFAULT_CRIT_MULTIPLIER: 1.5,
    /** 防御系数（防御减伤公式中的常数） */
    DEFENSE_COEFFICIENT: 100,
    /** 伤害免疫时间 */
    INVINCIBILITY_TIME: 0.5,
    /** 击退力度 */
    DEFAULT_KNOCKBACK_FORCE: 200,
    /** 最大状态效果数量 */
    MAX_STATUS_EFFECTS: 5
} as const;

// ============================================
// 角色常量
// ============================================

/** 默认玩家属性 */
export const DEFAULT_PLAYER_STATS = {
    TECH: {
        maxHp: 100,
        atk: 15,
        def: 10,
        spd: 150,
        critRate: 0.1,
        critDamage: 1.5
    },
    MAGIC: {
        maxHp: 80,
        maxMp: 100,
        atk: 20,
        def: 5,
        spd: 130,
        critRate: 0.15,
        critDamage: 1.8
    }
} as const;

/** 闪避配置 */
export const DODGE_CONFIG = {
    /** 闪避冷却时间 */
    COOLDOWN: 1.5,
    /** 闪避距离 */
    DISTANCE: 150,
    /** 闪避无敌时间 */
    INVINCIBILITY_TIME: 0.3
} as const;

// ============================================
// 技能常量
// ============================================

/** 技能配置 */
export const SKILL_CONFIG = {
    /** 默认技能冷却 */
    DEFAULT_COOLDOWN: 5,
    /** 终极技能冷却 */
    ULTIMATE_COOLDOWN: 30,
    /** 冥想恢复速度 */
    MEDITATE_MP_RECOVERY: 10, // 每秒
    /** 换弹时间 */
    RELOAD_TIME: 1.5
} as const;

// ============================================
// AI常量
// ============================================

/** AI配置 */
export const AI_CONFIG = {
    /** 默认检测范围 */
    DEFAULT_DETECT_RANGE: 300,
    /** 默认攻击范围 */
    DEFAULT_ATTACK_RANGE: 50,
    /** 默认巡逻范围 */
    DEFAULT_PATROL_RANGE: 100,
    /** 逃跑血量阈值 */
    FLEE_HEALTH_PERCENT: 0.2,
    /** 精英狂暴血量阈值 */
    ENRAGE_HEALTH_PERCENT: 0.3,
    /** 巡逻等待时间 */
    PATROL_WAIT_TIME: 2,
    /** 攻击间隔 */
    ATTACK_INTERVAL: 1.5
} as const;

// ============================================
// 副本常量
// ============================================

/** 副本配置 */
export const DUNGEON_CONFIG = {
    /** 默认房间数量 */
    DEFAULT_ROOM_COUNT: 7,
    /** 隐藏房出现概率 */
    HIDDEN_ROOM_CHANCE: 0.2,
    /** 精英房间数量 */
    ELITE_ROOM_COUNT: 1,
    /** 房间完成奖励 */
    ROOM_CLEAR_REWARD: 50
} as const;

// ============================================
// 经济常量
// ============================================

/** 经济配置 */
export const ECONOMY_CONFIG = {
    /** 初始货币 */
    INITIAL_CURRENCY: 100,
    /** 最大货币数量 */
    MAX_CURRENCY: 99999,
    /** 怪物精粹兑换比例 */
    ESSENCE_TO_CURRENCY_RATIO: 0.1
} as const;

// ============================================
// 输入常量
// ============================================

/** 默认按键映射 */
export const DEFAULT_KEY_MAPPINGS: Map<InputAction, KeyCode[]> = new Map([
    [InputAction.MoveUp, [KeyCode.KEY_W, KeyCode.ARROW_UP]],
    [InputAction.MoveDown, [KeyCode.KEY_S, KeyCode.ARROW_DOWN]],
    [InputAction.MoveLeft, [KeyCode.KEY_A, KeyCode.ARROW_LEFT]],
    [InputAction.MoveRight, [KeyCode.KEY_D, KeyCode.ARROW_RIGHT]],
    [InputAction.Dodge, [KeyCode.SPACE]],
    [InputAction.Skill1, [KeyCode.KEY_Q]],
    [InputAction.Skill2, [KeyCode.KEY_E]],
    [InputAction.Reload, [KeyCode.KEY_R]],
    [InputAction.Interact, [KeyCode.KEY_F]],
    [InputAction.Pause, [KeyCode.ESCAPE]],
    [InputAction.Inventory, [KeyCode.KEY_I, KeyCode.TAB]]
]);

// ============================================
// UI常量
// ============================================

/** UI配置 */
export const UI_CONFIG = {
    /** 交互提示显示距离 */
    INTERACT_PROMPT_DISTANCE: 80,
    /** 伤害数字显示时间 */
    DAMAGE_NUMBER_DURATION: 1.5,
    /** 对话打字速度 */
    DIALOG_TYPE_SPEED: 0.03,
    /** HUD更新频率 */
    HUD_UPDATE_INTERVAL: 0.1
} as const;

// ============================================
// 音频常量
// ============================================

/** 音频配置 */
export const AUDIO_CONFIG = {
    /** 默认BGM音量 */
    DEFAULT_BGM_VOLUME: 0.8,
    /** 默认SFX音量 */
    DEFAULT_SFX_VOLUME: 1.0,
    /** 音效池大小 */
    SFX_POOL_SIZE: 10,
    /** BGM淡入时间 */
    BGM_FADE_IN_TIME: 1.0,
    /** BGM淡出时间 */
    BGM_FADE_OUT_TIME: 1.0
} as const;

// ============================================
// 资源路径常量
// ============================================

/** 资源路径 */
export const RESOURCE_PATHS = {
    /** 配置文件目录 */
    DATA_DIR: 'data/',
    /** 预制体目录 */
    PREFAB_DIR: 'prefabs/',
    /** 音频目录 */
    AUDIO_DIR: 'audio/',

    // 配置文件
    PLAYERS_CONFIG: 'data/players',
    ENEMIES_CONFIG: 'data/enemies',
    SKILLS_CONFIG: 'data/skills',
    ITEMS_CONFIG: 'data/items',
    DUNGEONS_CONFIG: 'data/dungeons',

    // 预制体
    PLAYER_PREFAB: 'prefabs/characters/Player',
    ENEMY_PREFAB: 'prefabs/enemies/Enemy',
    ITEM_PREFAB: 'prefabs/items/Item'
} as const;
