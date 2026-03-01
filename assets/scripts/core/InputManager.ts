/**
 * 输入管理器
 * @brief 统一处理键盘、鼠标输入，支持按键重映射
 */

import { EventKeyboard, EventMouse, KeyCode, Vec2, input, Input } from 'cc';

/** 输入动作枚举 */
export enum InputAction {
    MoveUp,       // 向上移动
    MoveDown,     // 向下移动
    MoveLeft,     // 向左移动
    MoveRight,    // 向右移动
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
 * 输入管理器 - 单例
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
    private _mouseWorldPosition: Vec2 = new Vec2();
    private _leftMouseDown: boolean = false;
    private _rightMouseDown: boolean = false;
    private _leftMouseDownThisFrame: boolean = false;
    private _rightMouseDownThisFrame: boolean = false;
    private _leftMouseUpThisFrame: boolean = false;
    private _rightMouseUpThisFrame: boolean = false;

    // 按键映射
    private keyMappings: Map<InputAction, KeyCode[]> = new Map();

    // 动作回调
    private actionCallbacks: Map<InputAction, Set<() => void>> = new Map();

    // 世界坐标转换器
    private worldPositionConverter: ((screenPos: Vec2) => Vec2) | null = null;

    private initialized: boolean = false;

    private constructor() {
        // 初始化默认按键映射
        this.keyMappings.set(InputAction.MoveUp, [KeyCode.KEY_W, KeyCode.ARROW_UP]);
        this.keyMappings.set(InputAction.MoveDown, [KeyCode.KEY_S, KeyCode.ARROW_DOWN]);
        this.keyMappings.set(InputAction.MoveLeft, [KeyCode.KEY_A, KeyCode.ARROW_LEFT]);
        this.keyMappings.set(InputAction.MoveRight, [KeyCode.KEY_D, KeyCode.ARROW_RIGHT]);
        this.keyMappings.set(InputAction.Dodge, [KeyCode.SPACE]);
        this.keyMappings.set(InputAction.Skill1, [KeyCode.KEY_Q]);
        this.keyMappings.set(InputAction.Skill2, [KeyCode.KEY_E]);
        this.keyMappings.set(InputAction.Reload, [KeyCode.KEY_R]);
        this.keyMappings.set(InputAction.Interact, [KeyCode.KEY_F]);
        this.keyMappings.set(InputAction.Pause, [KeyCode.ESCAPE]);
        this.keyMappings.set(InputAction.Inventory, [KeyCode.KEY_I, KeyCode.TAB]);
    }

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
        console.log('[InputManager] Initialized');
    }

    /**
     * 设置世界坐标转换器
     * @param converter 转换函数
     */
    setWorldPositionConverter(converter: (screenPos: Vec2) => Vec2): void {
        this.worldPositionConverter = converter;
    }

    /**
     * 每帧结束时调用，清除单帧状态
     */
    lateUpdate(): void {
        this.keyDownThisFrame.clear();
        this.keyUpThisFrame.clear();
        this._leftMouseDownThisFrame = false;
        this._rightMouseDownThisFrame = false;
        this._leftMouseUpThisFrame = false;
        this._rightMouseUpThisFrame = false;
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

        // 转换世界坐标
        if (this.worldPositionConverter) {
            this._mouseWorldPosition = this.worldPositionConverter(this._mousePosition);
        }
    }

    private onMouseDown(event: EventMouse): void {
        const button = event.getButton();

        if (button === 0) {
            // 左键
            if (!this._leftMouseDown) {
                this._leftMouseDownThisFrame = true;
            }
            this._leftMouseDown = true;
            this.triggerActionCallback(InputAction.Attack);
        } else if (button === 2) {
            // 右键
            if (!this._rightMouseDown) {
                this._rightMouseDownThisFrame = true;
            }
            this._rightMouseDown = true;
            this.triggerActionCallback(InputAction.Ultimate);
        }
    }

    private onMouseUp(event: EventMouse): void {
        const button = event.getButton();

        if (button === 0) {
            this._leftMouseDown = false;
            this._leftMouseUpThisFrame = true;
        } else if (button === 2) {
            this._rightMouseDown = false;
            this._rightMouseUpThisFrame = true;
        }
    }

    // === 公共查询接口 ===

    /**
     * 获取移动方向向量（归一化）
     */
    getMovement(): Vec2 {
        let x = 0, y = 0;
        if (this.isActionPressed(InputAction.MoveRight)) x += 1;
        if (this.isActionPressed(InputAction.MoveLeft)) x -= 1;
        if (this.isActionPressed(InputAction.MoveUp)) y += 1;
        if (this.isActionPressed(InputAction.MoveDown)) y -= 1;

        const dir = new Vec2(x, y);
        return dir.length() > 0 ? dir.normalize() : Vec2.ZERO;
    }

    /**
     * 获取鼠标屏幕坐标
     */
    getMouseScreenPosition(): Vec2 {
        return this._mousePosition.clone();
    }

    /**
     * 获取鼠标世界坐标
     */
    getMouseWorldPosition(): Vec2 {
        return this._mouseWorldPosition.clone();
    }

    /**
     * 检测动作是否被按住
     */
    isActionPressed(action: InputAction): boolean {
        const keys = this.keyMappings.get(action) || [];
        for (const key of keys) {
            if (this.keyStates.get(key)) return true;
        }
        return false;
    }

    /**
     * 检测动作是否刚按下
     */
    isActionDown(action: InputAction): boolean {
        const keys = this.keyMappings.get(action) || [];
        for (const key of keys) {
            if (this.keyDownThisFrame.has(key)) return true;
        }
        return false;
    }

    /**
     * 检测动作是否刚释放
     */
    isActionUp(action: InputAction): boolean {
        const keys = this.keyMappings.get(action) || [];
        for (const key of keys) {
            if (this.keyUpThisFrame.has(key)) return true;
        }
        return false;
    }

    /**
     * 检测左键是否按住
     */
    isLeftMousePressed(): boolean {
        return this._leftMouseDown;
    }

    /**
     * 检测左键是否刚按下
     */
    isLeftMouseDown(): boolean {
        return this._leftMouseDownThisFrame;
    }

    /**
     * 检测右键是否按住
     */
    isRightMousePressed(): boolean {
        return this._rightMouseDown;
    }

    /**
     * 检测右键是否刚按下
     */
    isRightMouseDown(): boolean {
        return this._rightMouseDownThisFrame;
    }

    /**
     * 注册动作回调
     */
    onAction(action: InputAction, callback: () => void): void {
        if (!this.actionCallbacks.has(action)) {
            this.actionCallbacks.set(action, new Set());
        }
        this.actionCallbacks.get(action)!.add(callback);
    }

    /**
     * 移除动作回调
     */
    offAction(action: InputAction, callback: () => void): void {
        this.actionCallbacks.get(action)?.delete(callback);
    }

    /**
     * 按键重映射
     * @param action 动作
     * @param newKey 新按键
     */
    remapKey(action: InputAction, newKey: KeyCode): void {
        this.keyMappings.set(action, [newKey]);
        console.log(`[InputManager] Remapped ${InputAction[action]} to key ${newKey}`);
    }

    /**
     * 重置按键映射
     */
    resetKeyMappings(): void {
        this.keyMappings.clear();
        this.keyMappings.set(InputAction.MoveUp, [KeyCode.KEY_W, KeyCode.ARROW_UP]);
        this.keyMappings.set(InputAction.MoveDown, [KeyCode.KEY_S, KeyCode.ARROW_DOWN]);
        this.keyMappings.set(InputAction.MoveLeft, [KeyCode.KEY_A, KeyCode.ARROW_LEFT]);
        this.keyMappings.set(InputAction.MoveRight, [KeyCode.KEY_D, KeyCode.ARROW_RIGHT]);
        this.keyMappings.set(InputAction.Dodge, [KeyCode.SPACE]);
        this.keyMappings.set(InputAction.Skill1, [KeyCode.KEY_Q]);
        this.keyMappings.set(InputAction.Skill2, [KeyCode.KEY_E]);
        this.keyMappings.set(InputAction.Reload, [KeyCode.KEY_R]);
        this.keyMappings.set(InputAction.Interact, [KeyCode.KEY_F]);
        this.keyMappings.set(InputAction.Pause, [KeyCode.ESCAPE]);
        this.keyMappings.set(InputAction.Inventory, [KeyCode.KEY_I, KeyCode.TAB]);
    }

    private triggerActionCallbacks(key: KeyCode): void {
        this.keyMappings.forEach((keys, action) => {
            if (keys.includes(key)) {
                this.triggerActionCallback(action);
            }
        });
    }

    private triggerActionCallback(action: InputAction): void {
        this.actionCallbacks.get(action)?.forEach(cb => {
            try {
                cb();
            } catch (e) {
                console.error(`[InputManager] Error in action callback for ${InputAction[action]}:`, e);
            }
        });
    }
}
