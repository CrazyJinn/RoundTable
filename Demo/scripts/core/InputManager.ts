import { _decorator, Component, Node, input, Input, EventKeyboard, EventMouse, KeyCode, Vec2, Vec3 } from 'cc';
const { ccclass } = _decorator;

/**
 * 输入类型
 */
export enum InputType {
    KEY_DOWN = 'KEY_DOWN',
    KEY_UP = 'KEY_UP',
    MOUSE_DOWN = 'MOUSE_DOWN',
    MOUSE_UP = 'MOUSE_UP',
    MOUSE_MOVE = 'MOUSE_MOVE'
}

/**
 * 输入事件数据
 */
export interface InputEventData {
    type: InputType;
    keyCode?: KeyCode;
    mouseX?: number;
    mouseY?: number;
    worldPos?: Vec3;
}

/**
 * 输入管理器
 * 统一管理键盘和鼠标输入
 */
@ccclass('InputManager')
export class InputManager extends Component {
    private static _instance: InputManager;

    // 当前输入状态
    private _keysPressed: Set<KeyCode> = new Set();
    private _mousePosition: Vec2 = new Vec2(0, 0);
    private _mouseWorldPosition: Vec3 = new Vec3(0, 0, 0);
    private _isMouseDown: boolean = false;

    // 输入回调
    private _inputCallbacks: Map<InputType, Function[]> = new Map();

    public static get instance(): InputManager {
        return InputManager._instance;
    }

    onLoad() {
        if (InputManager._instance) {
            this.node.destroy();
            return;
        }
        InputManager._instance = this;

        // 注册输入监听
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);

        console.log('[InputManager] 初始化完成');
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    /**
     * 注册输入回调
     */
    public on(inputType: InputType, callback: (data: InputEventData) => void) {
        if (!this._inputCallbacks.has(inputType)) {
            this._inputCallbacks.set(inputType, []);
        }
        this._inputCallbacks.get(inputType)!.push(callback);
    }

    /**
     * 移除输入回调
     */
    public off(inputType: InputType, callback: (data: InputEventData) => void) {
        const callbacks = this._inputCallbacks.get(inputType);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    private onKeyDown(event: EventKeyboard) {
        this._keysPressed.add(event.keyCode);

        const data: InputEventData = {
            type: InputType.KEY_DOWN,
            keyCode: event.keyCode
        };

        this.triggerCallbacks(InputType.KEY_DOWN, data);
    }

    private onKeyUp(event: EventKeyboard) {
        this._keysPressed.delete(event.keyCode);

        const data: InputEventData = {
            type: InputType.KEY_UP,
            keyCode: event.keyCode
        };

        this.triggerCallbacks(InputType.KEY_UP, data);
    }

    private onMouseDown(event: EventMouse) {
        this._isMouseDown = true;

        const data: InputEventData = {
            type: InputType.MOUSE_DOWN,
            mouseX: event.getLocationX(),
            mouseY: event.getLocationY()
        };

        this.triggerCallbacks(InputType.MOUSE_DOWN, data);
    }

    private onMouseUp(event: EventMouse) {
        this._isMouseDown = false;

        const data: InputEventData = {
            type: InputType.MOUSE_UP,
            mouseX: event.getLocationX(),
            mouseY: event.getLocationY()
        };

        this.triggerCallbacks(InputType.MOUSE_UP, data);
    }

    private onMouseMove(event: EventMouse) {
        this._mousePosition.x = event.getLocationX();
        this._mousePosition.y = event.getLocationY();

        const data: InputEventData = {
            type: InputType.MOUSE_MOVE,
            mouseX: event.getLocationX(),
            mouseY: event.getLocationY()
        };

        this.triggerCallbacks(InputType.MOUSE_MOVE, data);
    }

    private triggerCallbacks(inputType: InputType, data: InputEventData) {
        const callbacks = this._inputCallbacks.get(inputType);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (e) {
                    console.error(`[InputManager] 输入回调错误: ${inputType}`, e);
                }
            });
        }
    }

    /**
     * 检查按键是否按下
     */
    public isKeyPressed(keyCode: KeyCode): boolean {
        return this._keysPressed.has(keyCode);
    }

    /**
     * 获取鼠标位置（屏幕坐标）
     */
    public getMousePosition(): Vec2 {
        return this._mousePosition;
    }

    /**
     * 设置鼠标世界坐标
     */
    public setMouseWorldPosition(pos: Vec3) {
        this._mouseWorldPosition.set(pos);
    }

    /**
     * 获取鼠标世界坐标
     */
    public getMouseWorldPosition(): Vec3 {
        return this._mouseWorldPosition;
    }

    /**
     * 检查鼠标是否按下
     */
    public isMouseDown(): boolean {
        return this._isMouseDown;
    }

    /**
     * 获取移动输入（WASD或方向键）
     */
    public getMovementInput(): Vec2 {
        const direction = new Vec2(0, 0);

        if (this.isKeyPressed(KeyCode.KEY_W) || this.isKeyPressed(KeyCode.ARROW_UP)) {
            direction.y += 1;
        }
        if (this.isKeyPressed(KeyCode.KEY_S) || this.isKeyPressed(KeyCode.ARROW_DOWN)) {
            direction.y -= 1;
        }
        if (this.isKeyPressed(KeyCode.KEY_A) || this.isKeyPressed(KeyCode.ARROW_LEFT)) {
            direction.x -= 1;
        }
        if (this.isKeyPressed(KeyCode.KEY_D) || this.isKeyPressed(KeyCode.ARROW_RIGHT)) {
            direction.x += 1;
        }

        // 归一化
        if (direction.length() > 0) {
            direction.normalize();
        }

        return direction;
    }

    update(deltaTime: number) {
        // 每帧更新状态
    }
}
