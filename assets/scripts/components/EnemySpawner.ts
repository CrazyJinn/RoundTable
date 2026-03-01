/**
 * 敌人生成器
 * @brief 管理敌人的生成
 */

import { _decorator, Component, Node, Vec2, Prefab, instantiate, resources } from 'cc';
import { Enemy, EnemyCategory, EnemyConfig } from '../entities/Enemy';
import { EnemyAI } from './EnemyAI';
import { EnemySpawn, RoomType } from '../data/types';

const { ccclass, property } = _decorator;

/**
 * 敌人预设配置
 */
export const ENEMY_PRESETS: Record<string, EnemyConfig> = {
    // 动物类怪物
    mutant_wolf: {
        id: 'mutant_wolf',
        name: '变异狼',
        category: EnemyCategory.Animal,
        stats: {
            maxHp: 50,
            currentHp: 50,
            atk: 10,
            def: 5,
            spd: 180,
            critRate: 0.05,
            critDamage: 1.3,
            detectRange: 250,
            attackRange: 40,
            patrolRange: 150,
            fleeHealthPercent: 0.2
        },
        drops: [
            { itemId: 'essence_common', chance: 0.8, minQuantity: 1, maxQuantity: 3 }
        ]
    },
    mutant_bear: {
        id: 'mutant_bear',
        name: '变异熊',
        category: EnemyCategory.Animal,
        stats: {
            maxHp: 120,
            currentHp: 120,
            atk: 20,
            def: 15,
            spd: 100,
            critRate: 0.1,
            critDamage: 1.5,
            detectRange: 200,
            attackRange: 50,
            patrolRange: 100,
            fleeHealthPercent: 0.15
        },
        drops: [
            { itemId: 'essence_common', chance: 1, minQuantity: 2, maxQuantity: 5 }
        ]
    },

    // 植物类怪物
    mutant_flower: {
        id: 'mutant_flower',
        name: '食人花',
        category: EnemyCategory.Plant,
        stats: {
            maxHp: 40,
            currentHp: 40,
            atk: 8,
            def: 3,
            spd: 0,
            critRate: 0,
            critDamage: 1,
            detectRange: 150,
            attackRange: 60,
            patrolRange: 0,
            fleeHealthPercent: 0
        },
        drops: [
            { itemId: 'essence_plant', chance: 0.9, minQuantity: 1, maxQuantity: 3 }
        ]
    },

    // 人形类敌人
    bandit: {
        id: 'bandit',
        name: '劫掠者',
        category: EnemyCategory.Humanoid,
        stats: {
            maxHp: 60,
            currentHp: 60,
            atk: 12,
            def: 8,
            spd: 140,
            critRate: 0.08,
            critDamage: 1.4,
            detectRange: 300,
            attackRange: 45,
            patrolRange: 120,
            fleeHealthPercent: 0.2
        },
        drops: [
            { itemId: 'currency', chance: 1, minQuantity: 10, maxQuantity: 25 },
            { itemId: 'essence_human', chance: 0.5, minQuantity: 1, maxQuantity: 2 }
        ]
    },

    // 精英怪
    elite_bandit_leader: {
        id: 'elite_bandit_leader',
        name: '劫掠者首领',
        category: EnemyCategory.Humanoid,
        isElite: true,
        stats: {
            maxHp: 150,
            currentHp: 150,
            atk: 25,
            def: 20,
            spd: 160,
            critRate: 0.15,
            critDamage: 1.8,
            detectRange: 350,
            attackRange: 55,
            patrolRange: 80,
            fleeHealthPercent: 0,
            enrageHealthPercent: 0.3
        },
        drops: [
            { itemId: 'currency', chance: 1, minQuantity: 50, maxQuantity: 100 },
            { itemId: 'essence_rare', chance: 1, minQuantity: 3, maxQuantity: 5 },
            { itemId: 'weapon_common', chance: 0.3, minQuantity: 1, maxQuantity: 1 }
        ]
    },

    // Boss
    boss_mutant_titan: {
        id: 'boss_mutant_titan',
        name: '变异泰坦',
        category: EnemyCategory.Boss,
        stats: {
            maxHp: 500,
            currentHp: 500,
            atk: 35,
            def: 30,
            spd: 80,
            critRate: 0.2,
            critDamage: 2,
            detectRange: 400,
            attackRange: 80,
            patrolRange: 0,
            fleeHealthPercent: 0,
            enrageHealthPercent: 0.5
        },
        drops: [
            { itemId: 'currency', chance: 1, minQuantity: 200, maxQuantity: 300 },
            { itemId: 'essence_boss', chance: 1, minQuantity: 10, maxQuantity: 15 },
            { itemId: 'weapon_rare', chance: 1, minQuantity: 1, maxQuantity: 1 }
        ]
    }
};

/**
 * 敌人生成器组件
 */
@ccclass('EnemySpawner')
export class EnemySpawner extends Component {
    /** 敌人预制体 */
    @property(Prefab)
    enemyPrefab: Prefab | null = null;

    /** 活跃的敌人列表 */
    private activeEnemies: Map<string, { enemy: Enemy; node: Node; ai: EnemyAI }> = new Map();

    /** 生成计数器 */
    private spawnCounter: number = 0;

    /**
     * 生成敌人
     * @param enemyId 敌人配置ID
     * @param position 生成位置
     */
    spawnEnemy(enemyId: string, position: Vec2): Enemy | null {
        const config = ENEMY_PRESETS[enemyId];
        if (!config) {
            console.error(`[EnemySpawner] Unknown enemy ID: ${enemyId}`);
            return null;
        }

        return this.spawnEnemyWithConfig(config, position);
    }

    /**
     * 使用配置生成敌人
     */
    spawnEnemyWithConfig(config: EnemyConfig, position: Vec2): Enemy | null {
        // 创建敌人实例
        const enemy = new Enemy(config);
        enemy.setSpawnPosition(position);

        // 创建节点
        const node = this.createEnemyNode(enemy);

        // 生成唯一ID
        const instanceId = `${config.id}_${this.spawnCounter++}`;
        this.activeEnemies.set(instanceId, { enemy, node, ai: node.getComponent(EnemyAI)! });

        console.log(`[EnemySpawner] Spawned ${config.name} at (${position.x}, ${position.y})`);

        return enemy;
    }

    /**
     * 批量生成敌人
     */
    spawnEnemies(spawns: EnemySpawn[]): Enemy[] {
        const enemies: Enemy[] = [];

        for (const spawn of spawns) {
            const enemy = this.spawnEnemy(spawn.enemyId, spawn.position);
            if (enemy) {
                enemies.push(enemy);
            }
        }

        return enemies;
    }

    /**
     * 创建敌人节点
     */
    private createEnemyNode(enemy: Enemy): Node {
        let node: Node;

        if (this.enemyPrefab) {
            node = instantiate(this.enemyPrefab);
        } else {
            node = new Node(enemy.name);
        }

        // 添加AI组件
        let ai = node.getComponent(EnemyAI);
        if (!ai) {
            ai = node.addComponent(EnemyAI);
        }
        ai.init(enemy);

        // 设置位置
        node.setPosition(enemy.position.x, enemy.position.y, 0);

        // 添加到场景
        this.node.addChild(node);

        return node;
    }

    /**
     * 移除敌人
     */
    removeEnemy(enemyId: string): void {
        const data = this.activeEnemies.get(enemyId);
        if (data) {
            data.node.destroy();
            this.activeEnemies.delete(enemyId);
        }
    }

    /**
     * 移除所有敌人
     */
    removeAllEnemies(): void {
        this.activeEnemies.forEach((data) => {
            data.node.destroy();
        });
        this.activeEnemies.clear();
    }

    /**
     * 获取所有活跃敌人
     */
    getActiveEnemies(): Enemy[] {
        return Array.from(this.activeEnemies.values()).map(data => data.enemy);
    }

    /**
     * 获取存活的敌人数量
     */
    getAliveEnemyCount(): number {
        return this.getActiveEnemies().filter(e => !e.isDead).length;
    }

    /**
     * 获取指定范围内的敌人
     */
    getEnemiesInRange(center: Vec2, radius: number): Enemy[] {
        return this.getActiveEnemies().filter(enemy => {
            if (enemy.isDead) return false;
            const distance = enemy.position.clone().subtract(center).length();
            return distance <= radius;
        });
    }

    /**
     * 根据房间类型获取随机敌人配置
     */
    static getRandomEnemyForRoom(roomType: RoomType): string[] {
        switch (roomType) {
            case RoomType.Normal:
                return ['mutant_wolf', 'mutant_flower'];
            case RoomType.Elite:
                return ['elite_bandit_leader'];
            case RoomType.Boss:
                return ['boss_mutant_titan'];
            default:
                return [];
        }
    }
}
