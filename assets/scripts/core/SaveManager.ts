/**
 * 存档管理器
 * @brief 数据持久化
 */

import { sys } from 'cc';
import { GameSaveData, PlayerSaveData, CharacterType, DungeonProgress } from '../data/types';
import { GAME_CONFIG } from '../data/constants';
import { Player } from '../entities/Player';
import { EconomySystem } from '../systems/EconomySystem';

/**
 * 存档槽位
 */
export interface SaveSlot {
    index: number;
    data: GameSaveData | null;
    exists: boolean;
    lastModified: number;
}

/**
 * 存档管理器 - 单例
 * 负责游戏存档的读取、保存、删除
 */
export class SaveManager {
    public static readonly instance: SaveManager = new SaveManager();

    /** 存档Key前缀 */
    private readonly SAVE_KEY_PREFIX = 'wasteland_save_';

    /** 最大存档数量 */
    private readonly MAX_SAVE_SLOTS = 3;

    /** 自动存档Key */
    private readonly AUTO_SAVE_KEY = 'wasteland_autosave';

    private constructor() {}

    /**
     * 保存游戏
     * @param slotIndex 存档槽位
     * @param player 玩家实例
     */
    saveGame(slotIndex: number, player: Player): boolean {
        try {
            const saveData: GameSaveData = {
                version: GAME_CONFIG.SAVE_VERSION,
                timestamp: Date.now(),
                player: this.createPlayerSaveData(player),
                completedQuests: [],
                flags: {}
            };

            const key = this.getSaveKey(slotIndex);
            const jsonStr = JSON.stringify(saveData);

            sys.localStorage.setItem(key, jsonStr);

            console.log(`[SaveManager] Game saved to slot ${slotIndex}`);
            return true;
        } catch (error) {
            console.error('[SaveManager] Failed to save game:', error);
            return false;
        }
    }

    /**
     * 自动存档
     */
    autoSave(player: Player): boolean {
        try {
            const saveData: GameSaveData = {
                version: GAME_CONFIG.SAVE_VERSION,
                timestamp: Date.now(),
                player: this.createPlayerSaveData(player),
                completedQuests: [],
                flags: {}
            };

            const jsonStr = JSON.stringify(saveData);
            sys.localStorage.setItem(this.AUTO_SAVE_KEY, jsonStr);

            console.log('[SaveManager] Auto saved');
            return true;
        } catch (error) {
            console.error('[SaveManager] Failed to auto save:', error);
            return false;
        }
    }

    /**
     * 加载游戏
     * @param slotIndex 存档槽位
     */
    loadGame(slotIndex: number): GameSaveData | null {
        try {
            const key = this.getSaveKey(slotIndex);
            const jsonStr = sys.localStorage.getItem(key);

            if (!jsonStr) {
                console.log(`[SaveManager] No save found in slot ${slotIndex}`);
                return null;
            }

            const saveData = JSON.parse(jsonStr) as GameSaveData;

            // 版本检查
            if (saveData.version !== GAME_CONFIG.SAVE_VERSION) {
                console.warn(`[SaveManager] Save version mismatch: ${saveData.version} vs ${GAME_CONFIG.SAVE_VERSION}`);
                // 可以在这里添加版本迁移逻辑
            }

            console.log(`[SaveManager] Game loaded from slot ${slotIndex}`);
            return saveData;
        } catch (error) {
            console.error('[SaveManager] Failed to load game:', error);
            return null;
        }
    }

    /**
     * 加载自动存档
     */
    loadAutoSave(): GameSaveData | null {
        try {
            const jsonStr = sys.localStorage.getItem(this.AUTO_SAVE_KEY);

            if (!jsonStr) {
                return null;
            }

            return JSON.parse(jsonStr) as GameSaveData;
        } catch (error) {
            console.error('[SaveManager] Failed to load auto save:', error);
            return null;
        }
    }

    /**
     * 删除存档
     * @param slotIndex 存档槽位
     */
    deleteSave(slotIndex: number): boolean {
        try {
            const key = this.getSaveKey(slotIndex);
            sys.localStorage.removeItem(key);

            console.log(`[SaveManager] Save deleted from slot ${slotIndex}`);
            return true;
        } catch (error) {
            console.error('[SaveManager] Failed to delete save:', error);
            return false;
        }
    }

    /**
     * 检查存档是否存在
     * @param slotIndex 存档槽位
     */
    hasSave(slotIndex: number): boolean {
        const key = this.getSaveKey(slotIndex);
        return sys.localStorage.getItem(key) !== null;
    }

    /**
     * 检查是否有自动存档
     */
    hasAutoSave(): boolean {
        return sys.localStorage.getItem(this.AUTO_SAVE_KEY) !== null;
    }

    /**
     * 获取所有存档槽位信息
     */
    getAllSaveSlots(): SaveSlot[] {
        const slots: SaveSlot[] = [];

        for (let i = 0; i < this.MAX_SAVE_SLOTS; i++) {
            const data = this.loadGame(i);
            const exists = this.hasSave(i);

            slots.push({
                index: i,
                data,
                exists,
                lastModified: data?.timestamp || 0
            });
        }

        return slots;
    }

    /**
     * 创建玩家存档数据
     */
    private createPlayerSaveData(player: Player): PlayerSaveData {
        return {
            characterType: player.characterType,
            stats: {
                maxHp: player.stats.maxHp,
                currentHp: player.stats.currentHp,
                maxMp: (player.stats as any).maxMp,
                currentMp: (player.stats as any).currentMp,
                atk: player.stats.atk,
                def: player.stats.def,
                spd: player.stats.spd,
                critRate: player.stats.critRate,
                critDamage: player.stats.critDamage
            },
            currency: EconomySystem.instance.currency,
            inventory: [],
            skills: ['skill_1', 'skill_2', 'ultimate'],
            position: { x: player.position.x, y: player.position.y } as any,
            sceneName: 'Game'
        };
    }

    /**
     * 获取存档Key
     */
    private getSaveKey(slotIndex: number): string {
        return `${this.SAVE_KEY_PREFIX}${slotIndex}`;
    }

    /**
     * 应用存档数据到玩家
     */
    applySaveData(saveData: GameSaveData, player: Player): void {
        // 恢复属性
        player.stats.currentHp = saveData.player.stats.currentHp;
        player.stats.maxHp = saveData.player.stats.maxHp;
        player.stats.atk = saveData.player.stats.atk;
        player.stats.def = saveData.player.stats.def;
        player.stats.spd = saveData.player.stats.spd;
        player.stats.critRate = saveData.player.stats.critRate;
        player.stats.critDamage = saveData.player.stats.critDamage;

        // 恢复位置
        const pos = saveData.player.position;
        if (pos) {
            player.position.x = pos.x;
            player.position.y = pos.y;
        }

        // 恢复货币
        EconomySystem.instance['addCurrency'](saveData.player.currency);

        console.log('[SaveManager] Save data applied to player');
    }

    /**
     * 清除所有存档
     */
    clearAllSaves(): void {
        for (let i = 0; i < this.MAX_SAVE_SLOTS; i++) {
            this.deleteSave(i);
        }
        sys.localStorage.removeItem(this.AUTO_SAVE_KEY);

        console.log('[SaveManager] All saves cleared');
    }
}
