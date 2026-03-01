---
name: code-implementer
description: 游戏代码实现专家。根据需求文档生成可运行的游戏代码。当用户提供游戏基本信息.md和代码需求.md，需要生成具体代码实现时使用此技能。支持Cocos Creator、Unity、Godot等主流游戏引擎，可生成核心系统、组件、UI、数据结构等完整代码。
---

# 代码实现专家

将需求文档转化为可运行的游戏代码。

## 工作流程

```
输入文档                    生成过程                      输出代码
┌─────────────────┐      ┌──────────────┐           ┌─────────────────┐
│ 游戏基本信息.md  │─────▶│  1. 确认引擎  │──────────▶│ scripts/        │
│ 代码需求.md      │      │  2. 规划架构  │           │ ├─ core/        │
│ (可选)剧本数据   │      │  3. 生成代码  │           │ ├─ systems/     │
└─────────────────┘      │  4. 创建配置  │           │ ├─ components/  │
                         └──────────────┘           │ ├─ entities/    │
                                                     │ └─ ui/          │
                                                     resources/data/  │
                                                     └─────────────────┘
```

## 执行步骤

### 1. 确认技术栈

读取需求文档，确认：
- 游戏引擎（Cocos Creator / Unity / Godot）
- 编程语言（TypeScript / C# / GDScript）
- 目标平台

### 2. 规划代码架构

参考 [structure.md](references/structure.md) 规划目录结构：
- `core/` - 核心管理器
- `systems/` - 游戏系统
- `components/` - 可复用组件
- `entities/` - 实体定义
- `ui/` - UI组件
- `data/` - 数据结构

### 3. 按优先级生成代码

**P0 - 核心系统（必须先实现）：**
1. GameManager - 游戏状态管理
2. InputManager - 输入处理
3. AudioManager - 音频控制
4. SaveManager - 存档系统

**P1 - 游戏系统：**
1. CombatSystem - 战斗逻辑
2. DialogSystem - 对话系统
3. InventorySystem - 背包系统

**P2 - 组件与实体：**
1. Movement - 移动组件
2. Health - 生命值组件
3. Player/Enemy/NPC - 实体类

**P3 - UI系统：**
1. HUD - 游戏界面
2. DialogUI - 对话界面
3. MenuUI - 菜单界面

### 4. 创建数据配置

生成JSON配置文件：
- `characters.json` - 角色属性
- `enemies.json` - 敌人属性
- `skills.json` - 技能数据
- `items.json` - 物品数据

## 设计模式参考

实现代码时参考 [patterns.md](references/patterns.md) 中的设计模式：
- 单例模式 - 全局管理器
- 状态机 - 角色/游戏状态
- 观察者 - 事件系统
- 对象池 - 子弹/特效
- 命令模式 - 输入处理

## 代码规范

### 命名约定

| 类型 | 规范 | 示例 |
|------|------|------|
| 类名 | PascalCase | `GameManager` |
| 方法名 | camelCase | `changeState()` |
| 常量 | UPPER_SNAKE | `MAX_HEALTH` |
| 私有属性 | _前缀 | `_currentHp` |
| 接口 | I前缀 | `IState` |
| 枚举 | PascalCase | `GameState` |

### 注释规范

```typescript
/**
 * 类描述
 * @brief 简要说明
 */
export class ClassName {
    /** 属性说明 */
    public property: type;

    /**
     * 方法说明
     * @param paramName 参数说明
     * @returns 返回值说明
     */
    public method(paramName: type): returnType {
        // 实现
    }
}
```

### TypeScript规范

```typescript
// 优先使用接口定义数据结构
interface CharacterData {
    id: string;
    name: string;
    maxHp: number;
    atk: number;
}

// 使用枚举定义状态
enum GameState {
    Playing,
    Paused
}

// 使用类型别名
type DamageType = 'physical' | 'magical' | 'true';
```

## 模板文件

| 模板 | 用途 |
|------|------|
| [templates.ts](assets/templates/templates.ts) | 核心系统代码模板 |

## 参考文档

| 文档 | 内容 |
|------|------|
| [patterns.md](references/patterns.md) | 常用设计模式与实现 |
| [structure.md](references/structure.md) | 项目目录结构规范 |

## 输出规范

### 文件放置位置

```
project/
├── assets/scripts/          # 代码输出目录
│   ├── core/                # 核心系统
│   ├── systems/             # 游戏系统
│   ├── components/          # 组件
│   ├── entities/            # 实体
│   ├── ui/                  # UI
│   └── data/                # 数据结构
└── assets/resources/data/   # 配置文件
```

### 代码文件命名

- 管理器：`XxxManager.ts`
- 系统：`XxxSystem.ts`
- 组件：`Xxx.ts` 或 `XxxComponent.ts`
- 实体：`Player.ts` / `Enemy.ts` / `NPC.ts`
- 接口：`types.ts` 或 `interfaces.ts`

## 使用示例

**用户输入：**
> 根据代码需求.md 生成核心系统代码

**执行流程：**
1. 读取代码需求.md，确认使用Cocos Creator + TypeScript
2. 规划目录结构
3. 生成 GameManager.ts、InputManager.ts、AudioManager.ts
4. 生成数据类型定义 types.ts
5. 创建基础配置文件
