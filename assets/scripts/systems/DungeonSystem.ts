/**
 * 副本管理器
 * @brief 副本流程管理
 */

import { Vec2 } from 'cc';
import {
    DungeonRoom,
    DungeonProgress,
    RoomType,
    EnemySpawn,
    Door,
    Reward,
    GameEventType
} from '../data/types';
import { DUNGEON_CONFIG } from '../data/constants';
import { EventManager } from '../data/EventManager';
import { GameManager } from '../core/GameManager';
import { RoomGenerator } from './RoomGenerator';

/**
 * 副本配置
 */
export interface DungeonConfig {
    id: string;
    name: string;
    description: string;
    difficulty: number;     // 1-5
    totalRooms: number;
    roomConfigs: RoomConfig[];
}

/**
 * 房间配置
 */
export interface RoomConfig {
    type: RoomType;
    enemyCount: number;
    enemyIds: string[];
    rewards?: Reward[];
}

/**
 * 副本管理器
 */
export class DungeonManager {
    public static readonly instance: DungeonManager = new DungeonManager();

    /** 当前副本配置 */
    private currentDungeon: DungeonConfig | null = null;

    /** 所有房间 */
    private rooms: Map<string, DungeonRoom> = new Map();

    /** 当前房间ID */
    private _currentRoomId: string = '';
    public get currentRoomId(): string { return this._currentRoomId; }

    /** 副本进度 */
    private progress: DungeonProgress | null = null;

    /** 房间生成器 */
    private roomGenerator: RoomGenerator;

    private constructor() {
        this.roomGenerator = new RoomGenerator();
    }

    /**
     * 初始化副本
     * @param dungeonId 副本ID
     */
    initDungeon(dungeonId: string): void {
        // 获取副本配置（这里使用预设配置）
        const config = this.getDungeonConfig(dungeonId);
        if (!config) {
            console.error(`[DungeonManager] Unknown dungeon: ${dungeonId}`);
            return;
        }

        this.currentDungeon = config;
        this.rooms.clear();

        // 生成房间
        this.generateRooms(config);

        // 初始化进度
        this.progress = {
            dungeonId: config.id,
            currentRoomId: '',
            completedRooms: [],
            totalRooms: config.totalRooms,
            startTime: Date.now()
        };

        console.log(`[DungeonManager] Dungeon initialized: ${config.name}`);
    }

    /**
     * 获取副本配置
     */
    private getDungeonConfig(id: string): DungeonConfig | null {
        const configs: Record<string, DungeonConfig> = {
            cave: {
                id: 'cave',
                name: '废土洞穴',
                description: '一个充满变异生物的地下洞穴',
                difficulty: 1,
                totalRooms: DUNGEON_CONFIG.DEFAULT_ROOM_COUNT,
                roomConfigs: [
                    { type: RoomType.Entrance, enemyCount: 0, enemyIds: [] },
                    { type: RoomType.Normal, enemyCount: 3, enemyIds: ['mutant_wolf', 'mutant_flower'] },
                    { type: RoomType.Normal, enemyCount: 4, enemyIds: ['mutant_wolf', 'bandit'] },
                    { type: RoomType.Elite, enemyCount: 1, enemyIds: ['elite_bandit_leader'] },
                    { type: RoomType.Normal, enemyCount: 5, enemyIds: ['mutant_wolf', 'mutant_bear', 'bandit'] },
                    { type: RoomType.Boss, enemyCount: 1, enemyIds: ['boss_mutant_titan'] }
                ]
            }
        };

        return configs[id] || null;
    }

    /**
     * 生成房间
     */
    private generateRooms(config: DungeonConfig): void {
        const rooms = this.roomGenerator.generate(config);
        rooms.forEach(room => {
            this.rooms.set(room.id, room);
        });
    }

    /**
     * 进入房间
     * @param roomId 房间ID
     */
    enterRoom(roomId: string): void {
        const room = this.rooms.get(roomId);
        if (!room) {
            console.error(`[DungeonManager] Room not found: ${roomId}`);
            return;
        }

        // 检查门是否锁定
        if (room.type !== RoomType.Entrance) {
            const previousRoom = this.rooms.get(this._currentRoomId);
            if (previousRoom && !previousRoom.completed) {
                console.log(`[DungeonManager] Previous room not completed`);
                return;
            }
        }

        this._currentRoomId = roomId;
        if (this.progress) {
            this.progress.currentRoomId = roomId;
        }

        // 触发事件
        EventManager.instance.emit(GameEventType.RoomEntered, {
            roomId,
            roomType: room.type
        });

        console.log(`[DungeonManager] Entered room: ${roomId} (${RoomType[room.type]})`);

        // 生成敌人
        this.spawnRoomEnemies(room);
    }

    /**
     * 生成房间敌人
     */
    private spawnRoomEnemies(room: DungeonRoom): void {
        // TODO: 调用 EnemySpawner 生成敌人
        // EnemySpawner.instance.spawnEnemies(room.enemies);
    }

    /**
     * 房间完成
     */
    completeRoom(): void {
        const room = this.getCurrentRoom();
        if (!room || room.completed) return;

        room.completed = true;

        if (this.progress) {
            this.progress.completedRooms.push(room.id);
        }

        // 解锁门
        room.doors.forEach(door => {
            door.locked = false;
        });

        // 发放奖励
        if (room.rewards) {
            this.grantRewards(room.rewards);
        }

        // 触发事件
        EventManager.instance.emit(GameEventType.RoomCleared, {
            roomId: room.id,
            roomType: room.type
        });

        console.log(`[DungeonManager] Room completed: ${room.id}`);

        // 检查是否通关
        if (room.type === RoomType.Boss) {
            this.completeDungeon();
        }
    }

    /**
     * 检查房间是否完成
     */
    isRoomComplete(): boolean {
        const room = this.getCurrentRoom();
        return room?.completed || false;
    }

    /**
     * 获取当前房间
     */
    getCurrentRoom(): DungeonRoom | null {
        return this.rooms.get(this._currentRoomId) || null;
    }

    /**
     * 获取副本进度
     */
    getProgress(): DungeonProgress | null {
        return this.progress;
    }

    /**
     * 获取进度百分比
     */
    getProgressPercent(): number {
        if (!this.progress) return 0;
        return this.progress.completedRooms.length / this.progress.totalRooms;
    }

    /**
     * 检查隐藏房条件
     */
    checkHiddenRoomCondition(): boolean {
        // 检查是否满足隐藏房开启条件
        // 例如：在特定时间内通关前面的房间、不受伤等
        return Math.random() < DUNGEON_CONFIG.HIDDEN_ROOM_CHANCE;
    }

    /**
     * 副本通关
     */
    completeDungeon(): void {
        if (!this.currentDungeon || !this.progress) return;

        const clearTime = Date.now() - this.progress.startTime;

        // 触发事件
        EventManager.instance.emit(GameEventType.DungeonComplete, {
            dungeonId: this.currentDungeon.id,
            dungeonName: this.currentDungeon.name,
            clearTime,
            completedRooms: this.progress.completedRooms.length
        });

        console.log(`[DungeonManager] Dungeon completed: ${this.currentDungeon.name}`);
        console.log(`[DungeonManager] Clear time: ${Math.floor(clearTime / 1000)}s`);

        // 清理
        this.currentDungeon = null;
        this.rooms.clear();
        this._currentRoomId = '';
    }

    /**
     * 退出副本
     */
    exitDungeon(): void {
        this.currentDungeon = null;
        this.rooms.clear();
        this._currentRoomId = '';
        this.progress = null;

        console.log(`[DungeonManager] Exited dungeon`);
    }

    /**
     * 发放奖励
     */
    private grantRewards(rewards: Reward[]): void {
        for (const reward of rewards) {
            switch (reward.type) {
                case 'currency':
                    GameManager.instance.modifyCurrency(reward.quantity, 'dungeon_reward');
                    break;
                case 'item':
                    // TODO: 添加物品到背包
                    console.log(`[DungeonManager] Reward: ${reward.id} x${reward.quantity}`);
                    break;
                case 'experience':
                    // TODO: 添加经验
                    break;
            }
        }
    }

    /**
     * 获取下一个房间
     */
    getNextRoom(): DungeonRoom | null {
        const currentRoom = this.getCurrentRoom();
        if (!currentRoom) return null;

        // 找到第一个未锁定的门指向的房间
        for (const door of currentRoom.doors) {
            if (!door.locked) {
                return this.rooms.get(door.targetRoomId) || null;
            }
        }

        return null;
    }

    /**
     * 获取所有房间
     */
    getAllRooms(): DungeonRoom[] {
        return Array.from(this.rooms.values());
    }
}
