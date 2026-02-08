import { _decorator, Component, Node, Label, Prefab, instantiate, Vec3 } from 'cc';
import { GameManager, GameEvent } from '../core/GameManager';
import { DialogManager } from '../core/DialogManager';
import { CombatSystem } from '../core/CombatSystem';
import { InputManager } from '../core/InputManager';
import { Character } from '../components/Character';
import { CharacterType } from '../data/CombatData';
import { prologueDialogData } from '../data/PrologueDialogData';
const { ccclass, property } = _decorator;

/**
 * 序章场景
 * 剧情简介：14年前，魔法派女主执行任务时杀死了科技派男主的双亲
 */
@ccclass('PrologueScene')
export class PrologueScene extends Component {
    // UI节点
    @property(Node)
    uiLayer: Node = null!;

    @property(Node)
    dialogUI: Node = null!;

    @property(Node)
    battleUI: Node = null!;

    // 角色预制体
    @property(Prefab)
    playerPrefab: Prefab = null!;

    @property(Prefab)
    enemyPrefab: Prefab = null!;

    // 战斗区域
    @property(Node)
    battleArea: Node = null!;

    // 状态
    private _currentPhase: number = 0;
    private _player: Character | null = null;
    private _enemies: Character[] = [];

    // 对话阶段标记
    private _dialogPhase: number = 0;

    onLoad() {
        console.log('[PrologueScene] 场景加载');

        // 确保管理器存在
        this.getOrAddComponent<GameManager>(GameManager.instance?.node || this.node, GameManager);
        this.getOrAddComponent<DialogManager>(DialogManager.instance?.node || this.node, DialogManager);
        this.getOrAddComponent<CombatSystem>(CombatSystem.instance?.node || this.node, CombatSystem);
        this.getOrAddComponent<InputManager>(InputManager.instance?.node || this.node, InputManager);

        // 注册事件监听
        this.registerEvents();

        // 初始化UI状态
        if (this.dialogUI) this.dialogUI.active = false;
        if (this.battleUI) this.battleUI.active = false;

        // 开始序章
        this.startPrologue();
    }

    /**
     * 获取或添加组件
     */
    private getOrAddComponent<T>(node: Node, componentClass: any): T {
        let comp = node.getComponent(componentClass);
        if (!comp) {
            comp = node.addComponent(componentClass);
        }
        return comp as T;
    }

    /**
     * 注册事件监听
     */
    private registerEvents() {
        // 对话事件
        DialogManager.instance?.on('dialog-end', this.onDialogEnd, this);

        // 战斗事件
        CombatSystem.instance?.on('battle-started', this.onBattleStarted, this);
        CombatSystem.instance?.on('battle-ended', this.onBattleEnded, this);

        // 角色事件
        this.node.on('character-died', this.onCharacterDied, this);
    }

    /**
     * 移除事件监听
     */
    private unregisterEvents() {
        DialogManager.instance?.off('dialog-end', this.onDialogEnd, this);
        CombatSystem.instance?.off('battle-started', this.onBattleStarted, this);
        CombatSystem.instance?.off('battle-ended', this.onBattleEnded, this);
        this.node.off('character-died', this.onCharacterDied, this);
    }

    /**
     * 开始序章
     */
    private startPrologue() {
        console.log('[PrologueScene] 开始序章');

        // 改变游戏状态
        GameManager.instance?.changeState(require('../core/GameManager').GameState.DIALOG);

        // 显示开场对话
        this.showPhase1Dialog();
    }

    // ==================== 第一阶段：任务接受 ====================

    /**
     * 显示第一阶段对话（任务接受）
     */
    private showPhase1Dialog() {
        this._currentPhase = 1;
        this._dialogPhase = 1;

        console.log('[PrologueScene] 第一阶段：任务接受');

        DialogManager.instance?.startDialog(
            prologueDialogData,
            'phase1_task',
            () => {
                // 对话开始
                this.showDialogUI();
            },
            () => {
                // 对话结束
                this.hideDialogUI();
                this.startPhase2();
            },
            (line) => {
                // 每句对话完成
                console.log(`[PrologueScene] 对话: ${line.speakerId} - ${line.text}`);
            }
        );
    }

    // ==================== 第二阶段：潜入与战斗 ====================

    /**
     * 开始第二阶段（潜入）
     */
    private startPhase2() {
        this._currentPhase = 2;
        console.log('[PrologueScene] 第二阶段：潜入');

        // 创建玩家角色（女主）
        this.createPlayer();

        // 创建敌人（男主双亲）
        this.createEnemies();

        // 开始战斗
        this.startBattle();
    }

    /**
     * 创建玩家角色
     */
    private createPlayer() {
        if (!this.playerPrefab) {
            console.warn('[PrologueScene] 未设置玩家预制体');
            return;
        }

        const playerNode = instantiate(this.playerPrefab);
        playerNode.setParent(this.battleArea);
        playerNode.setPosition(new Vec3(-200, 0, 0));

        this._player = playerNode.getComponent(Character);
        if (this._player) {
            this._player.init(
                'player_magic',
                '魔法女主',
                CharacterType.PLAYER,
                'player',
                {
                    maxHealth: 100,
                    maxMana: 80,
                    attack: 25,
                    defense: 10,
                    speed: 120,
                    attackSpeed: 1.2,
                    critRate: 0.15,
                    critDamage: 1.5
                }
            );
        }

        console.log('[PrologueScene] 创建玩家角色');
    }

    /**
     * 创建敌人
     */
    private createEnemies() {
        if (!this.enemyPrefab) {
            console.warn('[PrologueScene] 未设置敌人预制体');
            return;
        }

        // 创建男主父亲
        const fatherNode = instantiate(this.enemyPrefab);
        fatherNode.setParent(this.battleArea);
        fatherNode.setPosition(new Vec3(200, 50, 0));

        const father = fatherNode.getComponent(Character);
        if (father) {
            father.init(
                'enemy_father',
                '科技派居民（男主父亲）',
                CharacterType.ENEMY,
                'enemy',
                {
                    maxHealth: 60,
                    maxMana: 0,
                    attack: 8,
                    defense: 5,
                    speed: 80,
                    attackSpeed: 0.8,
                    critRate: 0.05,
                    critDamage: 1.2
                }
            );
            this._enemies.push(father);
        }

        // 创建男主母亲
        const motherNode = instantiate(this.enemyPrefab);
        motherNode.setParent(this.battleArea);
        motherNode.setPosition(new Vec3(200, -50, 0));

        const mother = motherNode.getComponent(Character);
        if (mother) {
            mother.init(
                'enemy_mother',
                '科技派居民（男主母亲）',
                CharacterType.ENEMY,
                'enemy',
                {
                    maxHealth: 50,
                    maxMana: 30,
                    attack: 6,
                    defense: 3,
                    speed: 70,
                    attackSpeed: 0.7,
                    critRate: 0.05,
                    critDamage: 1.2
                }
            );
            this._enemies.push(mother);
        }

        console.log('[PrologueScene] 创建敌人');
    }

    /**
     * 开始战斗
     */
    private startBattle() {
        GameManager.instance?.changeState(require('../core/GameManager').GameState.PLAYING);
        this.showBattleUI();

        CombatSystem.instance?.startBattle();

        // 注册战斗单位
        if (this._player) {
            CombatSystem.instance?.registerCombatUnit(this._player.id, this._player.node);
        }

        this._enemies.forEach(enemy => {
            CombatSystem.instance?.registerCombatUnit(enemy.id, enemy.node);
        });

        console.log('[PrologueScene] 战斗开始');
    }

    /**
     * 战斗开始回调
     */
    private onBattleStarted() {
        console.log('[PrologueScene] 战斗已开始');
    }

    /**
     * 战斗结束回调
     */
    private onBattleEnded(victory: boolean) {
        console.log(`[PrologueScene] 战斗结束 - ${victory ? '胜利' : '失败'}`);

        this.hideBattleUI();

        if (victory) {
            // 胜利后进入第三阶段
            this.startPhase3();
        } else {
            // 失败，重试
            this.restartBattle();
        }
    }

    /**
     * 角色死亡回调
     */
    private onCharacterDied(event: any) {
        console.log(`[PrologueScene] 角色死亡: ${event.name}`);

        // 从列表中移除
        const index = this._enemies.findIndex(e => e.id === event.id);
        if (index > -1) {
            this._enemies.splice(index, 1);
        }

        // 检查是否所有敌人都被击败
        if (this._enemies.length === 0) {
            // 稍后结束战斗
            this.scheduleOnce(() => {
                CombatSystem.instance?.endBattle(true);
            }, 2);
        }
    }

    /**
     * 重新开始战斗
     */
    private restartBattle() {
        // 清理现有角色
        if (this._player) {
            this._player.node.destroy();
            this._player = null;
        }

        this._enemies.forEach(enemy => {
            enemy.node.destroy();
        });
        this._enemies = [];

        // 重新创建
        this.createPlayer();
        this.createEnemies();

        // 重新开始战斗
        this.startBattle();
    }

    // ==================== 第三阶段：战后反思 ====================

    /**
     * 开始第三阶段（战后反思）
     */
    private startPhase3() {
        this._currentPhase = 3;
        console.log('[PrologueScene] 第三阶段：战后反思');

        // 改变游戏状态
        GameManager.instance?.changeState(require('../core/GameManager').GameState.DIALOG);

        // 显示战后对话
        this.showPhase3Dialog();
    }

    /**
     * 显示第三阶段对话（战后反思）
     */
    private showPhase3Dialog() {
        this._dialogPhase = 2;

        DialogManager.instance?.startDialog(
            prologueDialogData,
            'phase3_reflection',
            () => {
                this.showDialogUI();
            },
            () => {
                this.hideDialogUI();
                this.endPrologue();
            },
            (line) => {
                console.log(`[PrologueScene] 对话: ${line.speakerId} - ${line.text}`);
            }
        );
    }

    // ==================== 结束序章 ====================

    /**
     * 结束序章
     */
    private endPrologue() {
        console.log('[PrologueScene] 序章结束');

        // 设置对话标记（用于后续章节）
        GameManager.instance?.setDialogFlag('prologue_completed', true);
        GameManager.instance?.setDialogFlag('parents_killed', true);

        // 显示结束画面
        this.showEndingScreen();
    }

    /**
     * 显示结束画面
     */
    private showEndingScreen() {
        // TODO: 显示序章结束画面
        console.log('[PrologueScene] 显示结束画面');

        // 延迟后返回主菜单
        this.scheduleOnce(() => {
            GameManager.instance?.returnToMainMenu();
        }, 3);
    }

    // ==================== UI控制 ====================

    /**
     * 显示对话UI
     */
    private showDialogUI() {
        if (this.dialogUI) {
            this.dialogUI.active = true;
        }
    }

    /**
     * 隐藏对话UI
     */
    private hideDialogUI() {
        if (this.dialogUI) {
            this.dialogUI.active = false;
        }
    }

    /**
     * 显示战斗UI
     */
    private showBattleUI() {
        if (this.battleUI) {
            this.battleUI.active = true;
        }
    }

    /**
     * 隐藏战斗UI
     */
    private hideBattleUI() {
        if (this.battleUI) {
            this.battleUI.active = false;
        }
    }

    /**
     * 对话结束回调
     */
    private onDialogEnd() {
        console.log('[PrologueScene] 对话结束');
    }

    // ==================== 输入处理 ====================

    /**
     * 处理玩家输入
     */
    handleInput() {
        if (!GameManager.instance) return;

        const state = GameManager.instance.currentState;
        const inputManager = InputManager.instance;

        if (state === require('../core/GameManager').GameState.DIALOG) {
            // 对话模式：点击或按空格继续
            // 在UI组件中处理
        } else if (state === require('../core/GameManager').GameState.PLAYING) {
            // 战斗模式：移动和攻击
            const moveDir = inputManager?.getMovementInput();
            if (moveDir && this._player && !this._player.isDead) {
                if (moveDir.length() > 0) {
                    const targetPos = this._player.node.getPosition().add(
                        new Vec3(moveDir.x * 50, moveDir.y * 50, 0)
                    );
                    this._player.moveTo(targetPos);
                } else {
                    this._player.stopMovement();
                }
            }

            // 攻击（简单AI：自动攻击最近的敌人）
            if (this._player && !this._player.isAttacking && this._enemies.length > 0) {
                const nearestEnemy = this.findNearestEnemy();
                if (nearestEnemy) {
                    const distance = Vec3.distance(
                        this._player.node.getPosition(),
                        nearestEnemy.node.getPosition()
                    );

                    if (distance < 150) {
                        this._player.attack(nearestEnemy, 15, 'magical' as any);
                    }
                }
            }
        }
    }

    /**
     * 寻找最近的敌人
     */
    private findNearestEnemy(): Character | null {
        if (!this._player || this._enemies.length === 0) return null;

        let nearest: Character | null = null;
        let minDistance = Infinity;

        this._enemies.forEach(enemy => {
            if (enemy.isDead) return;

            const distance = Vec3.distance(
                this._player.node.getPosition(),
                enemy.node.getPosition()
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearest = enemy;
            }
        });

        return nearest;
    }

    update(deltaTime: number) {
        // 处理输入
        this.handleInput();
    }

    onDestroy() {
        // 清理事件监听
        this.unregisterEvents();

        console.log('[PrologueScene] 场景销毁');
    }
}
