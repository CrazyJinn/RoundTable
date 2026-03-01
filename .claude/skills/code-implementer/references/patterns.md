# 2D游戏常用设计模式

## 核心架构模式

### 1. 单例模式 (Singleton)
用于全局管理器，确保唯一实例。

```typescript
// 推荐实现：使用静态属性而非getInstance方法
export class GameManager {
    public static readonly instance: GameManager = new GameManager();

    private constructor() {
        // 私有构造函数防止外部实例化
    }
}
```

### 2. 状态机模式 (State Machine)
用于角色状态、游戏流程控制。

```typescript
interface IState {
    enter(): void;
    update(dt: number): void;
    exit(): void;
}

class StateMachine<T extends IState> {
    private currentState: T | null = null;

    changeState(newState: T): void {
        this.currentState?.exit();
        this.currentState = newState;
        this.currentState.enter();
    }

    update(dt: number): void {
        this.currentState?.update(dt);
    }
}
```

### 3. 观察者模式 (Observer)
用于事件系统、UI更新。

```typescript
type EventCallback = (...args: any[]) => void;

export class EventEmitter {
    private events: Map<string, Set<EventCallback>> = new Map();

    on(event: string, callback: EventCallback): void {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event)!.add(callback);
    }

    off(event: string, callback: EventCallback): void {
        this.events.get(event)?.delete(callback);
    }

    emit(event: string, ...args: any[]): void {
        this.events.get(event)?.forEach(cb => cb(...args));
    }
}
```

### 4. 对象池模式 (Object Pool)
用于子弹、特效等频繁创建销毁的对象。

```typescript
export class ObjectPool<T> {
    private pool: T[] = [];
    private createFn: () => T;
    private resetFn: (obj: T) => void;

    constructor(createFn: () => T, resetFn: (obj: T) => void, initialSize: number = 10) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createFn());
        }
    }

    get(): T {
        return this.pool.length > 0 ? this.pool.pop()! : this.createFn();
    }

    release(obj: T): void {
        this.resetFn(obj);
        this.pool.push(obj);
    }
}
```

### 5. 命令模式 (Command)
用于输入处理、技能系统。

```typescript
interface ICommand {
    execute(): void;
    undo(): void;
}

export class InputHandler {
    private commands: Map<string, ICommand> = new Map();

    bindCommand(key: string, command: ICommand): void {
        this.commands.set(key, command);
    }

    handleInput(key: string): void {
        this.commands.get(key)?.execute();
    }
}
```

## 组件化设计

### ECS简化版 (Entity-Component)

```typescript
// 组件基类
export abstract class Component {
    protected entity: Entity;

    init(entity: Entity): void {
        this.entity = entity;
    }

    abstract update(dt: number): void;
}

// 实体类
export class Entity {
    private components: Map<Function, Component> = new Map();

    addComponent<T extends Component>(component: T): T {
        component.init(this);
        this.components.set(component.constructor, component);
        return component;
    }

    getComponent<T extends Component>(type: new (...args: any[]) => T): T | undefined {
        return this.components.get(type) as T;
    }

    update(dt: number): void {
        this.components.forEach(c => c.update(dt));
    }
}
```

## 常用组件模板

### 移动组件
```typescript
export class MovementComponent extends Component {
    velocity: Vec2 = Vec2.ZERO;
    speed: number = 100;

    update(dt: number): void {
        this.entity.node.position = this.entity.node.position.add(
            this.velocity.multiplyScalar(this.speed * dt)
        );
    }

    move(direction: Vec2): void {
        this.velocity = direction.normalize();
    }

    stop(): void {
        this.velocity = Vec2.ZERO;
    }
}
```

### 生命值组件
```typescript
export class HealthComponent extends Component {
    private _currentHp: number;
    maxHp: number = 100;

    get currentHp(): number { return this._currentHp; }
    get isDead(): boolean { return this._currentHp <= 0; }

    init(entity: Entity): void {
        super.init(entity);
        this._currentHp = this.maxHp;
    }

    takeDamage(amount: number): void {
        this._currentHp = Math.max(0, this._currentHp - amount);
        // 触发受伤事件
    }

    heal(amount: number): void {
        this._currentHp = Math.min(this.maxHp, this._currentHp + amount);
    }
}
```
