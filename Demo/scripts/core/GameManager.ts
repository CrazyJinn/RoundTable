import { _decorator, Component, Node, director, sys } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 游戏状态枚举
 */
export enum GameState {
    LOADING = 'loading',
    MENU = 'menu',
    DIALOG = 'dialog',
    PLAYING = 'playing',
    PAUSED = 'paused',
    GAMEOVER = 'gameover'
}

/**
 * 游戏管理器
 * 负责游戏流程控制、状态管理、场景切换
 */
@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager;

    // 当前游戏状态
    private _currentState: GameState = GameState.LOADING;

    // 游戏数据
    private _gameData: any = {
        currentChapter: 'prologue', // 当前章节
        dialogFlags: {},            // 对话标记
        defeatedEnemies: [],        // 已击败的敌人
        collectedItems: []          // 已收集的物品
    };

    public static get instance(): GameManager {
        return GameManager._instance;
    }

    public get currentState(): GameState {
        return this._currentState;
    }

    public get gameData(): any {
        return this._gameData;
    }

    onLoad() {
        if (GameManager._instance) {
            this.node.destroy();
            return;
        }
        GameManager._instance = this;
        director.addPersistRootNode(this.node);

        console.log('[GameManager] 初始化完成');
        this.changeState(GameState.MENU);
    }

    /**
     * 切换游戏状态
     */
    public changeState(newState: GameState) {
        if (this._currentState === newState) return;

        console.log(`[GameManager] 状态切换: ${this._currentState} -> ${newState}`);
        const oldState = this._currentState;
        this._currentState = newState;

        // 发送状态变化事件
        EventManager.instance.emit(GameEvent.GAME_STATE_CHANGED, oldState, newState);
    }

    /**
     * 开始序章
     */
    public startPrologue() {
        console.log('[GameManager] 开始序章');
        this._gameData.currentChapter = 'prologue';
        director.loadScene('PrologueScene');
    }

    /**
     * 暂停游戏
     */
    public pauseGame() {
        if (this._currentState === GameState.PLAYING) {
            this.changeState(GameState.PAUSED);
            director.pause();
        }
    }

    /**
     * 恢复游戏
     */
    public resumeGame() {
        if (this._currentState === GameState.PAUSED) {
            this.changeState(GameState.PLAYING);
            director.resume();
        }
    }

    /**
     * 设置对话标记
     */
    public setDialogFlag(key: string, value: boolean = true) {
        this._gameData.dialogFlags[key] = value;
        this.saveGameData();
    }

    /**
     * 获取对话标记
     */
    public getDialogFlag(key: string): boolean {
        return this._gameData.dialogFlags[key] || false;
    }

    /**
     * 保存游戏数据
     */
    public saveGameData() {
        const json = JSON.stringify(this._gameData);
        sys.localStorage.setItem('gameData', json);
        console.log('[GameManager] 游戏数据已保存');
    }

    /**
     * 加载游戏数据
     */
    public loadGameData(): boolean {
        const json = sys.localStorage.getItem('gameData');
        if (json) {
            try {
                this._gameData = JSON.parse(json);
                console.log('[GameManager] 游戏数据已加载');
                return true;
            } catch (e) {
                console.error('[GameManager] 加载游戏数据失败', e);
            }
        }
        return false;
    }

    /**
     * 清除游戏数据
     */
    public clearGameData() {
        this._gameData = {
            currentChapter: 'prologue',
            dialogFlags: {},
            defeatedEnemies: [],
            collectedItems: []
        };
        sys.localStorage.removeItem('gameData');
        console.log('[GameManager] 游戏数据已清除');
    }

    /**
     * 记录击败的敌人
     */
    public recordDefeatedEnemy(enemyId: string) {
        if (!this._gameData.defeatedEnemies.includes(enemyId)) {
            this._gameData.defeatedEnemies.push(enemyId);
            this.saveGameData();
        }
    }

    /**
     * 检查敌人是否已被击败
     */
    public isEnemyDefeated(enemyId: string): boolean {
        return this._gameData.defeatedEnemies.includes(enemyId);
    }
}

/**
 * 游戏事件
 */
export class GameEvent {
    public static readonly GAME_STATE_CHANGED = 'GAME_STATE_CHANGED';
    public static readonly DIALOG_STARTED = 'DIALOG_STARTED';
    public static readonly DIALOG_ENDED = 'DIALOG_ENDED';
    public static readonly PLAYER_DAMAGED = 'PLAYER_DAMAGED';
    public static readonly ENEMY_DEFEATED = 'ENEMY_DEFEATED';
    public static readonly BATTLE_STARTED = 'BATTLE_STARTED';
    public static readonly BATTLE_ENDED = 'BATTLE_ENDED';
}

/**
 * 事件管理器（简化版，内联在此文件中方便demo使用）
 */
export class EventManager {
    private static _instance: EventManager;
    private _eventMap: Map<string, Function[]> = new Map();

    public static get instance(): EventManager {
        if (!EventManager._instance) {
            EventManager._instance = new EventManager();
        }
        return EventManager._instance;
    }

    public on(eventName: string, callback: Function, context?: any) {
        if (!this._eventMap.has(eventName)) {
            this._eventMap.set(eventName, []);
        }
        const callbacks = this._eventMap.get(eventName)!;
        callbacks.push(callback);
    }

    public off(eventName: string, callback: Function) {
        const callbacks = this._eventMap.get(eventName);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    public emit(eventName: string, ...args: any[]) {
        const callbacks = this._eventMap.get(eventName);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(...args);
                } catch (e) {
                    console.error(`[EventManager] 事件回调错误: ${eventName}`, e);
                }
            });
        }
    }
}
