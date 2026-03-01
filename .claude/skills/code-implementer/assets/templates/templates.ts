// ============================================
// 游戏管理器 - 游戏流程控制核心
// ============================================

import { _decorator, Component, Node } from 'cc';

/** 游戏状态枚举 */
export enum GameState {
    Loading,     // 加载中
    Menu,        // 主菜单
    Playing,     // 游戏中
    Dialog,      // 对话中
    Paused,      // 暂停
    GameOver,    // 游戏结束
    Cutscene     // 过场动画
}

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

    // 状态变更回调
    private stateCallbacks: Map<GameState, Set<() => void>> = new Map();

    private constructor() {}

    /**
     * 初始化游戏
     */
    init(): void {
        // 初始化其他管理器
        console.log('[GameManager] Game initialized');
    }

    /**
     * 切换游戏状态
     */
    changeState(newState: GameState): void {
        if (this._currentState === newState) return;

        this._previousState = this._currentState;
        this._currentState = newState;

        console.log(`[GameManager] State changed: ${GameState[this._previousState]} -> ${GameState[newState]}`);

        // 触发状态回调
        this.stateCallbacks.get(newState)?.forEach(cb => cb());
    }

    /**
     * 暂停游戏
     */
    pause(): void {
        if (this._currentState === GameState.Playing) {
            this.changeState(GameState.Paused);
        }
    }

    /**
     * 恢复游戏
     */
    resume(): void {
        if (this._currentState === GameState.Paused) {
            this.changeState(this._previousState);
        }
    }

    /**
     * 开始游戏
     */
    startGame(): void {
        this.changeState(GameState.Playing);
    }

    /**
     * 结束游戏
     */
    gameOver(): void {
        this.changeState(GameState.GameOver);
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

    /**
     * 检查是否可以移动/操作
     */
    get canControl(): boolean {
        return this._currentState === GameState.Playing;
    }
}

// ============================================
// 输入管理器 - 统一输入处理
// ============================================

import { EventKeyboard, EventMouse, KeyCode, Vec2, input, Input } from 'cc';

/** 输入动作枚举 */
export enum InputAction {
    MoveUp,
    MoveDown,
    MoveLeft,
    MoveRight,
    Dodge,        // 闪避
    Attack,       // 攻击
    Skill1,       // 技能1
    Skill2,       // 技能2
    Ultimate,     // 终极技能
    Reload,       // 换弹/冥想
    Interact,     // 交互
    Pause,        // 暂停
    Inventory     // 背包
}

/**
 * 输入管理器
 * 处理键盘和鼠标输入，提供统一的输入查询接口
 */
export class InputManager {
    public static readonly instance: InputManager = new InputManager();

    // 按键状态
    private keyStates: Map<KeyCode, boolean> = new Map();
    private keyDownThisFrame: Set<KeyCode> = new Set();
    private keyUpThisFrame: Set<KeyCode> = new Set();

    // 鼠标状态
    private _mousePosition: Vec2 = new Vec2();
    private _mouseDown: boolean = false;
    private _mouseDownThisFrame: boolean = false;
    private _mouseUpThisFrame: boolean = false;

    // 按键映射
    private keyMappings: Map<InputAction, KeyCode[]> = new Map([
        [InputAction.MoveUp, [KeyCode.KEY_W, KeyCode.ARROW_UP]],
        [InputAction.MoveDown, [KeyCode.KEY_S, KeyCode.ARROW_DOWN]],
        [InputAction.MoveLeft, [KeyCode.KEY_A, KeyCode.ARROW_LEFT]],
        [InputAction.MoveRight, [KeyCode.KEY_D, KeyCode.ARROW_RIGHT]],
        [InputAction.Dodge, [KeyCode.SPACE]],
        [InputAction.Attack, []], // 鼠标左键
        [InputAction.Skill1, [KeyCode.KEY_Q]],
        [InputAction.Skill2, [KeyCode.KEY_E]],
        [InputAction.Ultimate, []], // 鼠标右键
        [InputAction.Reload, [KeyCode.KEY_R]],
        [InputAction.Interact, [KeyCode.KEY_F]],
        [InputAction.Pause, [KeyCode.ESCAPE]],
        [InputAction.Inventory, [KeyCode.KEY_I, KeyCode.TAB]]
    ]);

    // 动作回调
    private actionCallbacks: Map<InputAction, Set<() => void>> = new Map();

    private initialized: boolean = false;

    private constructor() {}

    /**
     * 初始化输入监听
     */
    init(): void {
        if (this.initialized) return;

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);

        this.initialized = true;
    }

    /**
     * 每帧结束时调用，清除单帧状态
     */
    lateUpdate(): void {
        this.keyDownThisFrame.clear();
        this.keyUpThisFrame.clear();
        this._mouseDownThisFrame = false;
        this._mouseUpThisFrame = false;
    }

    // === 按键事件处理 ===
    private onKeyDown(event: EventKeyboard): void {
        const key = event.keyCode;
        if (!this.keyStates.get(key)) {
            this.keyDownThisFrame.add(key);
        }
        this.keyStates.set(key, true);
        this.triggerActionCallbacks(key);
    }

    private onKeyUp(event: EventKeyboard): void {
        const key = event.keyCode;
        this.keyStates.set(key, false);
        this.keyUpThisFrame.add(key);
    }

    // === 鼠标事件处理 ===
    private onMouseMove(event: EventMouse): void {
        this._mousePosition = event.getUILocation();
    }

    private onMouseDown(event: EventMouse): void {
        this._mouseDown = true;
        this._mouseDownThisFrame = true;

        if (event.getButton() === 0) {
            this.triggerActionCallback(InputAction.Attack);
        } else if (event.getButton() === 2) {
            this.triggerActionCallback(InputAction.Ultimate);
        }
    }

    private onMouseUp(event: EventMouse): void {
        this._mouseDown = false;
        this._mouseUpThisFrame = true;
    }

    // === 公共查询接口 ===

    /** 获取移动方向向量 */
    getMovement(): Vec2 {
        let x = 0, y = 0;
        if (this.isActionPressed(InputAction.MoveRight)) x += 1;
        if (this.isActionPressed(InputAction.MoveLeft)) x -= 1;
        if (this.isActionPressed(InputAction.MoveUp)) y += 1;
        if (this.isActionPressed(InputAction.MoveDown)) y -= 1;

        const dir = new Vec2(x, y);
        return dir.length() > 0 ? dir.normalize() : Vec2.ZERO;
    }

    /** 获取鼠标位置 */
    get mousePosition(): Vec2 {
        return this._mousePosition.clone();
    }

    /** 检测动作是否被按住 */
    isActionPressed(action: InputAction): boolean {
        const keys = this.keyMappings.get(action) || [];
        for (const key of keys) {
            if (this.keyStates.get(key)) return true;
        }
        return false;
    }

    /** 检测动作是否刚按下 */
    isActionDown(action: InputAction): boolean {
        const keys = this.keyMappings.get(action) || [];
        for (const key of keys) {
            if (this.keyDownThisFrame.has(key)) return true;
        }
        return false;
    }

    /** 检测动作是否刚释放 */
    isActionUp(action: InputAction): boolean {
        const keys = this.keyMappings.get(action) || [];
        for (const key of keys) {
            if (this.keyUpThisFrame.has(key)) return true;
        }
        return false;
    }

    /** 注册动作回调 */
    onAction(action: InputAction, callback: () => void): void {
        if (!this.actionCallbacks.has(action)) {
            this.actionCallbacks.set(action, new Set());
        }
        this.actionCallbacks.get(action)!.add(callback);
    }

    /** 移除动作回调 */
    offAction(action: InputAction, callback: () => void): void {
        this.actionCallbacks.get(action)?.delete(callback);
    }

    private triggerActionCallbacks(key: KeyCode): void {
        this.keyMappings.forEach((keys, action) => {
            if (keys.includes(key)) {
                this.triggerActionCallback(action);
            }
        });
    }

    private triggerActionCallback(action: InputAction): void {
        this.actionCallbacks.get(action)?.forEach(cb => cb());
    }
}

// ============================================
// 音频管理器 - 音频播放控制
// ============================================

import { AudioSource, AudioClip, resources, Node, instantiate, Prefab } from 'cc';

/**
 * 音频管理器
 * 管理BGM、SFX播放
 */
export class AudioManager {
    public static readonly instance: AudioManager = new AudioManager();

    // 音量设置
    private _bgmVolume: number = 1.0;
    private _sfxVolume: number = 1.0;

    public get bgmVolume(): number { return this._bgmVolume; }
    public get sfxVolume(): number { return this._sfxVolume; }

    public set bgmVolume(value: number) {
        this._bgmVolume = Math.max(0, Math.min(1, value));
        this.updateBGMVolume();
    }

    public set sfxVolume(value: number) {
        this._sfxVolume = Math.max(0, Math.min(1, value));
    }

    // 当前BGM
    private currentBGM: AudioSource | null = null;
    private currentBGMName: string = '';

    // 音效池
    private sfxPool: Node[] = [];
    private readonly MAX_SFX_CHANNELS = 10;

    private constructor() {}

    /**
     * 播放BGM
     */
    playBGM(name: string, loop: boolean = true, fadeTime: number = 1.0): void {
        if (this.currentBGMName === name) return;

        // 加载并播放新BGM
        resources.load(`audio/bgm/${name}`, AudioClip, (err, clip) => {
            if (err) {
                console.error(`[AudioManager] Failed to load BGM: ${name}`, err);
                return;
            }

            // 淡出当前BGM
            if (this.currentBGM) {
                this.fadeOut(this.currentBGM, fadeTime);
            }

            // 创建新BGM源
            const node = new Node('BGM_' + name);
            const source = node.addComponent(AudioSource);
            source.clip = clip;
            source.loop = loop;
            source.volume = 0;
            source.play();

            this.currentBGM = source;
            this.currentBGMName = name;

            // 淡入
            this.fadeIn(source, fadeTime);
        });
    }

    /**
     * 停止BGM
     */
    stopBGM(fadeTime: number = 1.0): void {
        if (this.currentBGM) {
            this.fadeOut(this.currentBGM, fadeTime, () => {
                this.currentBGM?.stop();
                this.currentBGM = null;
                this.currentBGMName = '';
            });
        }
    }

    /**
     * 播放音效
     */
    playSFX(name: string, volume: number = 1.0): void {
        resources.load(`audio/sfx/${name}`, AudioClip, (err, clip) => {
            if (err) {
                console.error(`[AudioManager] Failed to load SFX: ${name}`, err);
                return;
            }

            const source = this.getSFXSource();
            source.clip = clip;
            source.volume = volume * this._sfxVolume;
            source.playOneShot(clip);
        });
    }

    /**
     * 获取可用的音效源
     */
    private getSFXSource(): AudioSource {
        // 尝试从池中获取空闲的
        for (const node of this.sfxPool) {
            const source = node.getComponent(AudioSource);
            if (!source?.playing) {
                return source;
            }
        }

        // 创建新的
        if (this.sfxPool.length < this.MAX_SFX_CHANNELS) {
            const node = new Node('SFX');
            const source = node.addComponent(AudioSource);
            this.sfxPool.push(node);
            return source;
        }

        // 强制使用第一个
        return this.sfxPool[0].getComponent(AudioSource)!;
    }

    private fadeIn(source: AudioSource, duration: number): void {
        // 简化实现，实际可用tween
        source.volume = this._bgmVolume;
    }

    private fadeOut(source: AudioSource, duration: number, callback?: () => void): void {
        source.volume = 0;
        callback?.();
    }

    private updateBGMVolume(): void {
        if (this.currentBGM) {
            this.currentBGM.volume = this._bgmVolume;
        }
    }
}
