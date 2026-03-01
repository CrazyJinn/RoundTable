/**
 * 房间生成器
 * @brief 生成副本房间
 */

import { Vec2 } from 'cc';
import {
    DungeonRoom,
    RoomType,
    EnemySpawn,
    Door,
    Reward
} from '../data/types';
import { DungeonConfig } from './DungeonSystem';
import { DUNGEON_CONFIG } from '../data/constants';

/**
 * 房间生成器
 * 负责生成副本的房间布局
 */
export class RoomGenerator {
    /** 房间计数器 */
    private roomCounter: number = 0;

    /** 房间间距 */
    private readonly ROOM_SPACING = 500;

    /**
     * 生成房间
     * @param config 副本配置
     */
    generate(config: DungeonConfig): DungeonRoom[] {
        this.roomCounter = 0;
        const rooms: DungeonRoom[] = [];

        // 根据配置生成房间
        for (let i = 0; i < config.roomConfigs.length; i++) {
            const roomConfig = config.roomConfigs[i];
            const room = this.createRoom(roomConfig.type, i, config);

            // 生成敌人配置
            if (roomConfig.enemyCount > 0) {
                room.enemies = this.generateEnemySpawns(
                    roomConfig.enemyIds,
                    roomConfig.enemyCount,
                    room
                );
            }

            // 添加奖励
            if (roomConfig.rewards) {
                room.rewards = roomConfig.rewards;
            } else if (roomConfig.type === RoomType.Normal) {
                // 普通房间默认奖励
                room.rewards = [
                    { type: 'currency', quantity: DUNGEON_CONFIG.ROOM_CLEAR_REWARD }
                ];
            }

            rooms.push(room);
        }

        // 连接房间
        this.connectRooms(rooms);

        // 可能添加隐藏房
        if (Math.random() < DUNGEON_CONFIG.HIDDEN_ROOM_CHANCE) {
            const hiddenRoom = this.createHiddenRoom(rooms.length);
            rooms.push(hiddenRoom);

            // 连接到随机一个普通房间
            const randomIndex = Math.floor(Math.random() * (rooms.length - 2)) + 1;
            this.connectTwoRooms(rooms[randomIndex], hiddenRoom);
        }

        return rooms;
    }

    /**
     * 创建房间
     */
    private createRoom(type: RoomType, index: number, config: DungeonConfig): DungeonRoom {
        const id = `room_${this.roomCounter++}`;

        // 计算位置（线性布局）
        const position = new Vec2(index * this.ROOM_SPACING, 0);

        return {
            id,
            type,
            enemies: [],
            completed: type === RoomType.Entrance, // 入口默认完成
            doors: [],
            rewards: []
        };
    }

    /**
     * 创建隐藏房
     */
    private createHiddenRoom(index: number): DungeonRoom {
        const id = `room_${this.roomCounter++}`;

        const room: DungeonRoom = {
            id,
            type: RoomType.Hidden,
            enemies: [],
            completed: false,
            doors: [],
            rewards: [
                { type: 'item', id: 'rare_item', quantity: 1 },
                { type: 'currency', quantity: 100 }
            ]
        };

        // 生成隐藏房敌人
        room.enemies = this.generateEnemySpawns(
            ['mutant_bear', 'bandit'],
            3,
            room
        );

        return room;
    }

    /**
     * 生成敌人生成配置
     */
    private generateEnemySpawns(
        availableIds: string[],
        count: number,
        room: DungeonRoom
    ): EnemySpawn[] {
        const spawns: EnemySpawn[] = [];
        const roomSize = 300; // 房间大小

        for (let i = 0; i < count; i++) {
            const enemyId = availableIds[Math.floor(Math.random() * availableIds.length)];

            // 随机位置（在房间范围内）
            const position = new Vec2(
                (Math.random() - 0.5) * roomSize,
                (Math.random() - 0.5) * roomSize
            );

            spawns.push({
                enemyId,
                position,
                spawnDelay: i * 0.2 // 错开生成时间
            });
        }

        return spawns;
    }

    /**
     * 连接房间
     */
    private connectRooms(rooms: DungeonRoom[]): void {
        for (let i = 0; i < rooms.length - 1; i++) {
            this.connectTwoRooms(rooms[i], rooms[i + 1]);
        }
    }

    /**
     * 连接两个房间
     */
    private connectTwoRooms(roomA: DungeonRoom, roomB: DungeonRoom): void {
        // 从A到B的门
        const doorAToB: Door = {
            id: `door_${roomA.id}_${roomB.id}`,
            targetRoomId: roomB.id,
            position: new Vec2(200, 0), // 房间右侧
            locked: roomB.type === RoomType.Boss || roomB.type === RoomType.Hidden
        };

        // 从B到A的门（如果需要返回）
        const doorBToA: Door = {
            id: `door_${roomB.id}_${roomA.id}`,
            targetRoomId: roomA.id,
            position: new Vec2(-200, 0), // 房间左侧
            locked: false
        };

        roomA.doors.push(doorAToB);
        roomB.doors.push(doorBToA);
    }

    /**
     * 生成复杂布局（分支结构）
     */
    generateBranching(config: DungeonConfig): DungeonRoom[] {
        this.roomCounter = 0;
        const rooms: DungeonRoom[] = [];

        // 入口
        const entrance = this.createRoom(RoomType.Entrance, 0, config);
        rooms.push(entrance);

        // 主线路径
        let currentMainRoom = entrance;
        const mainPathLength = Math.floor(config.totalRooms * 0.6);

        for (let i = 1; i <= mainPathLength; i++) {
            const type = i === mainPathLength ? RoomType.Elite : RoomType.Normal;
            const room = this.createRoom(type, i, config);
            rooms.push(room);
            this.connectTwoRooms(currentMainRoom, room);
            currentMainRoom = room;
        }

        // 分支路径
        const branchCount = Math.floor((config.totalRooms - mainPathLength - 1) / 2);
        for (let b = 0; b < branchCount; b++) {
            const branchStart = rooms[1 + Math.floor(Math.random() * (mainPathLength - 1))];
            let currentBranchRoom = branchStart;

            for (let i = 0; i < 2; i++) {
                const room = this.createRoom(RoomType.Normal, rooms.length, config);
                rooms.push(room);
                this.connectTwoRooms(currentBranchRoom, room);
                currentBranchRoom = room;
            }
        }

        // Boss房
        const bossRoom = this.createRoom(RoomType.Boss, rooms.length, config);
        rooms.push(bossRoom);
        this.connectTwoRooms(currentMainRoom, bossRoom);

        // 生成敌人和奖励
        rooms.forEach(room => {
            if (room.type !== RoomType.Entrance) {
                const roomConfig = config.roomConfigs.find(c => c.type === room.type);
                if (roomConfig) {
                    room.enemies = this.generateEnemySpawns(
                        roomConfig.enemyIds,
                        roomConfig.enemyCount,
                        room
                    );
                }
            }
        });

        return rooms;
    }
}
