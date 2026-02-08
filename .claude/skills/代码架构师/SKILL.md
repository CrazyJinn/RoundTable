---
name: 代码架构师
description: 游戏开发流程中的代码架构和实现角色，负责根据剧本拆解师输出的需求，设计并生成Cocos Creator 2D游戏所需的TypeScript代码，包括场景脚本、组件类、游戏逻辑、数据管理等。当剧本拆解完成并确认需求后，需要设计代码架构和生成代码时触发此技能。
---

# 代码架构师

## 概述

根据游戏需求设计Cocos Creator 2D游戏的代码架构，并生成可运行的TypeScript代码，包括场景脚本、组件、管理器、数据结构等。

## 输入

| 输入项 | 来源 | 说明 |
|--------|------|------|
| 需求确认报告 | 剧本拆解师 | 确认后的需求 |
| 场景清单 | 剧本拆解师 | 场景逻辑和交互需求 |
| 角色清单 | 剧本拆解师 | 角色行为和动画需求 |
| UI清单 | 剧本拆解师 | UI交互需求 |
| 游戏基本信息 | 剧本拆解师 | 游戏类型、核心玩法 |

## 工作流程

```
分析需求 → 设计架构 → 生成代码 → 生成配置 → 输出交付
```

### 第一步：分析需求

**确认关键信息：**

| 信息项 | 说明 |
|--------|------|
| 游戏类型 | 决定核心架构模式 |
| 场景数量 | 决定场景管理策略 |
| 角色系统 | 决定角色组件设计 |
| UI复杂度 | 决定UI框架选择 |
| 数据需求 | 决定数据存储方案 |

### 第二步：设计架构

**标准Cocos项目架构：**

```
assets/
├── scripts/
│   ├── core/              # 核心系统
│   │   ├── GameManager.ts      # 游戏管理器
│   │   ├── EventManager.ts     # 事件管理器
│   │   ├── AudioManager.ts     # 音频管理器
│   │   └── DataManager.ts      # 数据管理器
│   ├── scenes/            # 场景脚本
│   │   ├── SceneBase.ts        # 场景基类
│   │   ├── MainMenuScene.ts    # 主菜单场景
│   │   └── GameScene.ts        # 游戏场景
│   ├── components/       # 组件
│   │   ├── Character.ts        # 角色组件
│   │   ├── PlayerController.ts # 玩家控制
│   │   ├── EnemyAI.ts          # 敌人AI
│   │   └── AnimationController.ts # 动画控制
│   ├── ui/               # UI组件
│   │   ├── UIBase.ts           # UI基类
│   │   ├── ButtonBase.ts       # 按钮基类
│   │   └── PanelBase.ts        # 面板基类
│   ├── data/             # 数据结构
│   │   ├── PlayerData.ts       # 玩家数据
│   │   ├── LevelData.ts        # 关卡数据
│   │   └── GameConfig.ts       # 游戏配置
│   └── utils/            # 工具函数
│       ├── Logger.ts           # 日志工具
│       ├── ObjectPool.ts       # 对象池
│       └── Timer.ts            # 计时器
```

### 第三步：生成核心管理器

**GameManager.ts 游戏管理器模板：**

```typescript
import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 游戏管理器
 * 负责游戏流程控制、状态管理
 */
@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager;

    public static get instance(): GameManager {
        return GameManager._instance;
    }

    // 游戏状态
    private _gameState: GameState = GameState.READY;

    public get gameState(): GameState {
        return this._gameState;
    }

    onLoad() {
        if (GameManager._instance) {
            this.node.destroy();
            return;
        }
        GameManager._instance = this;
        director.addPersistRootNode(this.node);
    }

    /**
     * 开始游戏
     */
    public startGame() {
        this._gameState = GameState.PLAYING;
        director.loadScene('GameScene');
    }

    /**
     * 暂停游戏
     */
    public pauseGame() {
        this._gameState = GameState.PAUSED;
        director.pause();
    }

    /**
     * 恢复游戏
     */
    public resumeGame() {
        this._gameState = GameState.PLAYING;
        director.resume();
    }

    /**
     * 游戏结束
     */
    public gameOver() {
        this._gameState = GameState.GAMEOVER;
        // 处理游戏结束逻辑
    }

    /**
     * 返回主菜单
     */
    public returnToMainMenu() {
        this._gameState = GameState.READY;
        director.loadScene('MainMenu');
    }
}

/**
 * 游戏状态枚举
 */
export enum GameState {
    READY = 'ready',           // 准备状态
    PLAYING = 'playing',       // 游戏中
    PAUSED = 'paused',         // 暂停
    GAMEOVER = 'gameover'      // 游戏结束
}
```

**EventManager.ts 事件管理器模板：**

```typescript
/**
 * 事件管理器
 * 用于组件间通信
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

    /**
     * 注册事件监听
     */
    public on(eventName: string, callback: Function) {
        if (!this._eventMap.has(eventName)) {
            this._eventMap.set(eventName, []);
        }
        this._eventMap.get(eventName)?.push(callback);
    }

    /**
     * 移除事件监听
     */
    public off(eventName: string, callback: Function) {
        const callbacks = this._eventMap.get(eventName);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    /**
     * 触发事件
     */
    public emit(eventName: string, ...args: any[]) {
        const callbacks = this._eventMap.get(eventName);
        if (callbacks) {
            callbacks.forEach(callback => callback(...args));
        }
    }
}

// 游戏事件定义
export class GameEvents {
    public static readonly PLAYER_DIED = 'PLAYER_DIED';
    public static readonly LEVEL_COMPLETED = 'LEVEL_COMPLETED';
    public static readonly SCORE_CHANGED = 'SCORE_CHANGED';
    public static readonly HEALTH_CHANGED = 'HEALTH_CHANGED';
}
```

**AudioManager.ts 音频管理器模板：**

```typescript
import { _decorator, Component, Node, AudioSource, resources } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 音频管理器
 * 负责背景音乐和音效的播放控制
 */
@ccclass('AudioManager')
export class AudioManager extends Component {
    private static _instance: AudioManager;

    public static get instance(): AudioManager {
        return AudioManager._instance;
    }

    @property(AudioSource)
    private bgmSource: AudioSource = null;

    @property(AudioSource)
    private sfxSource: AudioSource = null;

    private _bgmVolume: number = 0.6;
    private _sfxVolume: number = 0.8;

    onLoad() {
        if (AudioManager._instance) {
            this.node.destroy();
            return;
        }
        AudioManager._instance = this;
    }

    /**
     * 播放背景音乐
     */
    public playBGM(audioPath: string, loop: boolean = true) {
        // 实现BGM播放
    }

    /**
     * 停止背景音乐
     */
    public stopBGM() {
        if (this.bgmSource) {
            this.bgmSource.stop();
        }
    }

    /**
     * 播放音效
     */
    public playSFX(audioPath: string) {
        // 实现音效播放
    }

    /**
     * 设置BGM音量
     */
    public setBGMVolume(volume: number) {
        this._bgmVolume = Math.max(0, Math.min(1, volume));
        if (this.bgmSource) {
            this.bgmSource.volume = this._bgmVolume;
        }
    }

    /**
     * 设置SFX音量
     */
    public setSFXVolume(volume: number) {
        this._sfxVolume = Math.max(0, Math.min(1, volume));
        if (this.sfxSource) {
            this.sfxSource.volume = this._sfxVolume;
        }
    }
}
```

### 第四步：生成场景脚本

**SceneBase.ts 场景基类模板：**

```typescript
import { _decorator, Component, Node } from 'cc';
const { ccclass } = _decorator;

/**
 * 场景基类
 * 所有场景的基类，提供通用功能
 */
@ccclass('SceneBase')
export abstract class SceneBase extends Component {

    protected onLoad(): void {
        this.initScene();
    }

    protected start(): void {
        this.onSceneEnter();
    }

    /**
     * 初始化场景
     */
    protected abstract initScene(): void;

    /**
     * 场景进入
     */
    protected abstract onSceneEnter(): void;

    /**
     * 场景退出
     */
    protected onSceneExit(): void {
        // 子类可重写
    }

    protected onDestroy(): void {
        this.onSceneExit();
    }
}
```

### 第五步：生成组件

**Character.ts 角色组件模板：**

```typescript
import { _decorator, Component, Node, Sprite, UITransform } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 角色数据结构
 */
export interface CharacterData {
    id: string;
    name: string;
    maxHealth: number;
    speed: number;
}

/**
 * 角色组件
 * 基础角色功能
 */
@ccclass('Character')
export class Character extends Component {
    @property(Sprite)
    protected sprite: Sprite = null;

    protected _data: CharacterData = null;
    protected _health: number = 0;

    /**
     * 初始化角色数据
     */
    public init(data: CharacterData) {
        this._data = data;
        this._health = data.maxHealth;
    }

    /**
     * 移动
     */
    public move(direction: { x: number, y: number }) {
        if (!this._data) return;
        // 实现移动逻辑
    }

    /**
     * 受到伤害
     */
    public takeDamage(damage: number) {
        this._health -= damage;
        if (this._health <= 0) {
            this.onDeath();
        }
    }

    /**
     * 死亡
     */
    protected onDeath() {
        // 子类重写
    }

    /**
     * 获取当前生命值
     */
    public get health(): number {
        return this._health;
    }

    /**
     * 获取最大生命值
     */
    public get maxHealth(): number {
        return this._data ? this._data.maxHealth : 0;
    }
}
```

**PlayerController.ts 玩家控制模板：**

```typescript
import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode } from 'cc';
const { ccclass } = _decorator;

/**
 * 玩家控制器
 * 处理玩家输入
 */
@ccclass('PlayerController')
export class PlayerController extends Component {

    private _moveDir: { x: number, y: number } = { x: 0, y: 0 };

    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                this._moveDir.y = 1;
                break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                this._moveDir.y = -1;
                break;
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                this._moveDir.x = -1;
                break;
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                this._moveDir.x = 1;
                break;
        }
    }

    private onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                this._moveDir.y = 0;
                break;
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                this._moveDir.x = 0;
                break;
        }
    }

    update(deltaTime: number) {
        // 根据移动方向处理角色移动
    }
}
```

### 第六步：生成UI组件

**UIBase.ts UI基类模板：**

```typescript
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * UI基类
 */
@ccclass('UIBase')
export abstract class UIBase extends Component {

    @property(Node)
    protected container: Node = null;

    protected onLoad(): void {
        this.initUI();
    }

    /**
     * 初始化UI
     */
    protected abstract initUI(): void;

    /**
     * 显示UI
     */
    public show() {
        this.node.active = true;
        this.onShow();
    }

    /**
     * 隐藏UI
     */
    public hide() {
        this.node.active = false;
        this.onHide();
    }

    /**
     * UI显示时调用
     */
    protected onShow(): void {
        // 子类可重写
    }

    /**
     * UI隐藏时调用
     */
    protected onHide(): void {
        // 子类可重写
    }
}
```

### 第七步：生成数据结构

**PlayerData.ts 玩家数据模板：**

```typescript
/**
 * 玩家数据
 */
export class PlayerData {
    public nickname: string = '';
    public level: number = 1;
    public experience: number = 0;
    public score: number = 0;
    public health: number = 100;
    public maxHealth: number = 100;

    /**
     * 增加经验
     */
    public addExperience(amount: number): boolean {
        this.experience += amount;
        // 检查升级
        if (this.experience >= this.getExpToNextLevel()) {
            this.levelUp();
            return true;
        }
        return false;
    }

    /**
     * 获取升级所需经验
     */
    public getExpToNextLevel(): number {
        return this.level * 100;
    }

    /**
     * 升级
     */
    protected levelUp() {
        this.level++;
        this.maxHealth += 10;
        this.health = this.maxHealth;
    }

    /**
     * 序列化
     */
    public toJSON(): string {
        return JSON.stringify({
            nickname: this.nickname,
            level: this.level,
            experience: this.experience,
            score: this.score,
            health: this.health,
            maxHealth: this.maxHealth
        });
    }

    /**
     * 反序列化
     */
    public static fromJSON(json: string): PlayerData {
        const data = new PlayerData();
        const parsed = JSON.parse(json);
        Object.assign(data, parsed);
        return data;
    }
}
```

### 第八步：输出代码清单

生成 `code_manifest.md`，包含：

```markdown
# 代码资源清单

## 生成信息
- 生成时间：
- Cocos版本：
- TypeScript版本：

## 代码结构

### 核心系统（core/）
| 文件名 | 说明 | 关键类/接口 |
|--------|------|-------------|
| GameManager.ts | 游戏管理器 | GameManager, GameState |
| EventManager.ts | 事件管理器 | EventManager, GameEvents |
| AudioManager.ts | 音频管理器 | AudioManager |
| DataManager.ts | 数据管理器 | DataManager |

### 场景脚本（scenes/）
| 文件名 | 说明 | 关键类/接口 |
|--------|------|-------------|
| SceneBase.ts | 场景基类 | SceneBase |

### 组件（components/）
| 文件名 | 说明 | 关键类/接口 |
|--------|------|-------------|
| Character.ts | 角色组件 | Character, CharacterData |
| PlayerController.ts | 玩家控制 | PlayerController |

### UI组件（ui/）
| 文件名 | 说明 | 关键类/接口 |
|--------|------|-------------|
| UIBase.ts | UI基类 | UIBase |

### 数据结构（data/）
| 文件名 | 说明 | 关键类/接口 |
|--------|------|-------------|
| PlayerData.ts | 玩家数据 | PlayerData |

## 使用说明
（列出代码使用说明和注意事项）
```

## 输出文件清单

| 文件/目录 | 说明 |
|-----------|------|
| core/ | 核心管理器代码 |
| scenes/ | 场景脚本代码 |
| components/ | 游戏组件代码 |
| ui/ | UI组件代码 |
| data/ | 数据结构代码 |
| utils/ | 工具函数代码 |
| code_manifest.md | 代码资源清单 |

## 代码规范

1. **命名规范**
   - 类名：PascalCase（如：GameManager）
   - 方法名：camelCase（如：getPlayerData）
   - 私有成员：下划线前缀（如：_health）
   - 常量：UPPER_SNAKE_CASE（如：MAX_HEALTH）

2. **注释规范**
   - 类：使用JSDoc注释
   - 公共方法：必须注释
   - 复杂逻辑：添加行内注释

3. **类型规范**
   - 使用TypeScript类型注解
   - 定义明确的接口
   - 避免使用any类型

## 注意事项

1. **Cocos版本兼容性**：确保代码兼容Cocos Creator 3.x
2. **性能优化**：使用对象池、避免频繁GC
3. **内存管理**：正确注册/注销事件监听
4. **错误处理**：添加必要的错误处理逻辑
