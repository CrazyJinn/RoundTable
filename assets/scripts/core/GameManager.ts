/**
 * 游戏管理器
 * @brief 游戏流程控制核心，状态管理
 */

import { _decorator, Component, Node, director } from 'cc';
import { GameState, CharacterType, GameEventType } from '../data/types';
import { GAME_CONFIG } from '../data/constants';
import { EventManager } from '../data/EventManager';
import { InputManager } from './InputManager';
import { AudioManager } from './AudioManager';
import { Player } from '../entities/Player';

/**
 * 游戏管理器 - 单例
 * 负责游戏状态管理、场景切换、全局事件
 */
export class GameManager {
    // 单例
    public static readonly instance: GameManager = new GameManager();

    // 当前游戏状态
    private _currentState: GameState = GameState.Loading;
    public get currentState(): GameState { return this._currentState; }

    // 之前的状态（用于暂停恢复）
    private _previousState: GameState = GameState.Loading;

    // 当前玩家
    private _currentPlayer: Player | null = null;
    public get currentPlayer(): Player | null { return this._currentPlayer; }

    // 货币
    private _currency: number = 0;
    public get currency(): number { return this._currency; }

    // 状态变更回调
    private stateCallbacks: Map<GameState, Set<() => void>> = new Map();

    // 时间缩放
    private _timeScale: number = 1.0;
    public get timeScale(): number { return this._timeScale; }

    private constructor() {}

    /**
     * 初始化游戏
     */
    init(): void {
        // 初始化其他管理器
        InputManager.instance.init();
        AudioManager.instance.init();

        // 初始化货币
        this._currency = 0;

        console.log(`[GameManager] ${GAME_CONFIG.GAME_NAME} initialized`);
    }

    /**
     * 切换游戏状态
     */
    changeState(newState: GameState): void {
        if (this._currentState === newState) return;

        const oldState = this._currentState;
        this._previousState = oldState;
        this._currentState = newState;

        console.log(`[GameManager] State changed: ${GameState[oldState]} -> ${GameState[newState]}`);

        // 触发状态回调
        const callbacks = this.stateCallbacks.get(newState);
        if (callbacks) {
            callbacks.forEach(cb => {
                try {
                    cb();
                } catch (e) {
                    console.error('[GameManager] Error in state callback:', e);
                }
            });
        }

        // 发布状态变更事件
        EventManager.instance.emit(GameEventType.MenuClose, { oldState, newState });
    }

    /**
     * 开始新游戏
     * @param characterType 选择的角色类型
     */
    startNewGame(characterType: CharacterType): void {
        this._currency = 0;
        this._currentPlayer = null; // 将由场景创建

        this.changeState(GameState.CharacterSelect);
    }

    /**
     * 加载场景
     * @param sceneName 场景名称
     */
    async loadScene(sceneName: string): Promise<void> {
        this.changeState(GameState.Loading);

        return new Promise((resolve, reject) => {
            director.loadScene(sceneName, (err) => {
                if (err) {
                    console.error(`[GameManager] Failed to load scene: ${sceneName}`, err);
                    reject(err);
                    return;
                }
                console.log(`[GameManager] Scene loaded: ${sceneName}`);
                resolve();
            });
        });
    }

    /**
     * 设置当前玩家
     */
    setCurrentPlayer(player: Player): void {
        this._currentPlayer = player;
    }

    /**
     * 获取当前玩家
     */
    getCurrentPlayer(): Player | null {
        return this._currentPlayer;
    }

    /**
     * 暂停游戏
     */
    pause(): void {
        if (this._currentState === GameState.Playing) {
            this._timeScale = 0;
            this.changeState(GameState.Paused);
        }
    }

    /**
     * 恢复游戏
     */
    resume(): void {
        if (this._currentState === GameState.Paused) {
            this._timeScale = 1;
            this.changeState(this._previousState);
        }
    }

    /**
     * 切换暂停状态
     */
    togglePause(): void {
        if (this._currentState === GameState.Paused) {
            this.resume();
        } else if (this._currentState === GameState.Playing) {
            this.pause();
        }
    }

    /**
     * 游戏结束
     */
    gameOver(): void {
        this.changeState(GameState.GameOver);
        this._timeScale = 0;
    }

    /**
     * 返回主菜单
     */
    returnToMenu(): void {
        this._currentPlayer = null;
        this._currency = 0;
        this.loadScene('MainMenu');
    }

    /**
     * 获取货币数量
     */
    getCurrency(): number {
        return this._currency;
    }

    /**
     * 修改货币
     * @param amount 变化量（正数为增加，负数为减少）
     * @param source 来源描述
     */
    modifyCurrency(amount: number, source?: string): void {
        this._currency = Math.max(0, this._currency + amount);

        if (source) {
            console.log(`[GameManager] Currency ${amount > 0 ? '+' : ''}${amount} from: ${source}`);
        }

        EventManager.instance.emit(GameEventType.CurrencyChanged, {
            amount,
            total: this._currency
        });
    }

    /**
     * 检查是否可以控制
     */
    get canControl(): boolean {
        return this._currentState === GameState.Playing;
    }

    /**
     * 检查是否处于游戏中
     */
    get isInGame(): boolean {
        return this._currentState === GameState.Playing ||
               this._currentState === GameState.Dialog ||
               this._currentState === GameState.Inventory;
    }

    /**
     * 注册状态变更回调
     */
    onStateChange(state: GameState, callback: () => void): void {
        if (!this.stateCallbacks.has(state)) {
            this.stateCallbacks.set(state, new Set());
        }
        this.stateCallbacks.get(state)!.add(callback);
    }

    /**
     * 移除状态变更回调
     */
    offStateChange(state: GameState, callback: () => void): void {
        this.stateCallbacks.get(state)?.delete(callback);
    }
}
