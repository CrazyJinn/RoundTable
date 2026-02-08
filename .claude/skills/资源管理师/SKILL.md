---
name: 资源管理师
description: 游戏开发流程中的资源整理和管理角色，负责整合美术资源、音频资源、代码文件和配置文件，生成符合Cocos Creator项目规范的完整项目结构，输出资源导入清单、组件使用指南和项目说明文档。当所有资源和配置生成完毕后，需要整合为Cocos项目时触发此技能。
---

# 资源管理师

## 概述

整合所有生成的资源和代码，构建完整的Cocos Creator项目结构，输出可导入的项目文件和详细的使用指南。

## 输入

| 输入项 | 来源 | 说明 |
|--------|------|------|
| 美术资源包 | 美术生成师 | 场景背景、角色精灵、UI资源 |
| 音频资源包 | 音频生成师 | 背景音乐、音效 |
| 代码文件 | 代码架构师 | TypeScript代码 |
| 配置文件 | 配置生成师 | 各种JSON配置文件 |
| 资源清单 | 各生成师 | 完整的资源清单 |

## 工作流程

```
接收所有资源 → 检查完整性 → 构建项目结构 → 生成文档 → 输出交付
```

### 第一步：接收并检查资源

**资源完整性检查清单：**

| 资源类型 | 检查项 | 状态 |
|---------|--------|------|
| 美术资源 | 文件数量、命名规范、格式 | ⬜ |
| 音频资源 | 文件数量、格式、时长 | ⬜ |
| 代码文件 | 语法检查、完整性 | ⬜ |
| 配置文件 | JSON格式验证、引用完整性 | ⬜ |

### 第二步：构建Cocos项目结构

**标准项目目录结构：**

```
assets/
├── scripts/                    # TypeScript代码
│   ├── core/                   # 核心系统
│   │   ├── GameManager.ts
│   │   ├── EventManager.ts
│   │   ├── AudioManager.ts
│   │   └── DataManager.ts
│   ├── scenes/                 # 场景脚本
│   │   ├── SceneBase.ts
│   │   ├── MainMenuScene.ts
│   │   └── GameScene.ts
│   ├── components/             # 游戏组件
│   │   ├── Character.ts
│   │   ├── PlayerController.ts
│   │   ├── EnemyAI.ts
│   │   └── AnimationController.ts
│   ├── ui/                     # UI组件
│   │   ├── UIBase.ts
│   │   ├── ButtonBase.ts
│   │   └── PanelBase.ts
│   ├── data/                   # 数据结构
│   │   ├── PlayerData.ts
│   │   ├── LevelData.ts
│   │   └── GameConfig.ts
│   └── utils/                  # 工具函数
│       ├── Logger.ts
│       ├── ObjectPool.ts
│       └── Timer.ts
├── scenes/                     # 场景文件
│   ├── MainMenu.scene
│   └── GameScene.scene
├── prefabs/                    # 预制体
│   ├── Player.prefab
│   └── Enemy.prefab
├── textures/                   # 图片资源
│   ├── backgrounds/            # 场景背景
│   │   ├── bg_main_menu.png
│   │   └── bg_level_01.png
│   ├── characters/            # 角色精灵
│   │   ├── player/
│   │   │   ├── char_player_idle.png
│   │   │   └── char_player_walk.png
│   │   └── enemy/
│   │       └── char_enemy_01.png
│   └── ui/                    # UI资源
│       ├── ui_main_menu.png
│       └── buttons/
│           ├── btn_start_normal.png
│           └── btn_start_pressed.png
├── audio/                      # 音频资源
│   ├── bgm/                   # 背景音乐
│   │   ├── bgm_main_theme.mp3
│   │   └── bgm_level_01.mp3
│   └── sfx/                   # 音效
│       ├── sfx_jump.mp3
│       └── sfx_attack.mp3
├── animations/                 # 动画资源
│   └── player_animations/
│       ├── player_idle.anim
│       └── player_walk.anim
└── config/                     # 配置文件
    ├── scene_config.json
    ├── prefab_config.json
    ├── resource_mapping.json
    ├── game_config.json
    ├── level_data.json
    ├── animation_config.json
    └── ui_layout.json
```

### 第三步：生成资源导入清单

**导入清单（import_checklist.md）：**

```markdown
# 资源导入清单

## 导入步骤

### 1. 创建项目
1. 打开Cocos Creator
2. 新建项目，选择空白模板
3. 设置项目名称和位置

### 2. 导入代码文件
将 `scripts/` 目录复制到项目的 `assets/` 目录

### 3. 导入场景文件
将 `scenes/` 目录复制到项目的 `assets/` 目录

### 4. 导入预制体
将 `prefabs/` 目录复制到项目的 `assets/` 目录

### 5. 导入图片资源
将 `textures/` 目录复制到项目的 `assets/` 目录
- 在编辑器中选中图片
- 设置类型为 Sprite Frame
- 设置打包方式（Sprite Atlas 或 单独）

### 6. 导入音频资源
将 `audio/` 目录复制到项目的 `assets/` 目录
- 在编辑器中选中音频
- 设置音频格式

### 7. 导入动画资源
将 `animations/` 目录复制到项目的 `assets/` 目录

### 8. 导入配置文件
将 `config/` 目录复制到项目的 `assets/` 目录

## 资源配置检查清单

### 图片资源配置
- [ ] 所有图片已设置为 Sprite Frame
- [ ] Sprite Atlas 已正确配置
- [ ] 图片压缩格式已设置
- [ ] 九宫格设置（如需要）

### 音频资源配置
- [ ] BGM 已设置为循环
- [ ] 音效已设置为不循环
- [ ] 音频格式兼容性检查

### 动画资源配置
- [ ] 动画剪辑已创建
- [ ] 动画帧序列已设置
- [ ] 循环设置已配置

### 配置文件
- [ ] JSON 文件格式正确
- [ ] 资源引用路径正确
- [ ] 配置参数已验证
```

### 第四步：生成组件使用指南

**组件使用指南（component_guide.md）：**

```markdown
# 组件使用指南

## 核心管理器

### GameManager
**位置**: `scripts/core/GameManager.ts`

**功能**: 游戏流程控制

**使用方法**:
```typescript
// 获取实例
const gm = GameManager.instance;

// 开始游戏
gm.startGame();

// 暂停游戏
gm.pauseGame();

// 恢复游戏
gm.resumeGame();

// 游戏结束
gm.gameOver();
```

### EventManager
**位置**: `scripts/core/EventManager.ts`

**功能**: 事件系统，组件间通信

**使用方法**:
```typescript
// 注册事件
EventManager.instance.on(GameEvents.PLAYER_DIED, this.onPlayerDied, this);

// 触发事件
EventManager.instance.emit(GameEvents.PLAYER_DIED, playerData);

// 移除事件
EventManager.instance.off(GameEvents.PLAYER_DIED, this.onPlayerDied, this);
```

**游戏事件列表**:
- `PLAYER_DIED` - 玩家死亡
- `LEVEL_COMPLETED` - 关卡完成
- `SCORE_CHANGED` - 分数变化
- `HEALTH_CHANGED` - 生命值变化

### AudioManager
**位置**: `scripts/core/AudioManager.ts`

**功能**: 音频播放控制

**使用方法**:
```typescript
// 播放BGM
AudioManager.instance.playBGM('bgm_level_01');

// 播放音效
AudioManager.instance.playSFX('sfx_jump');

// 设置音量
AudioManager.instance.setBGMVolume(0.5);
AudioManager.instance.setSFXVolume(0.8);
```

## 场景组件

### SceneBase
**位置**: `scripts/scenes/SceneBase.ts`

**功能**: 场景基类

**继承方法**:
- `initScene()` - 初始化场景
- `onSceneEnter()` - 场景进入
- `onSceneExit()` - 场景退出

**使用示例**:
```typescript
export class MyScene extends SceneBase {
    protected initScene(): void {
        // 初始化逻辑
    }

    protected onSceneEnter(): void {
        // 场景进入逻辑
    }
}
```

## 游戏组件

### Character
**位置**: `scripts/components/Character.ts`

**功能**: 角色基础组件

**属性**:
- `health` - 当前生命值
- `maxHealth` - 最大生命值

**方法**:
- `init(data: CharacterData)` - 初始化角色
- `move(direction)` - 移动
- `takeDamage(damage)` - 受到伤害

### PlayerController
**位置**: `scripts/components/PlayerController.ts`

**功能**: 玩家输入控制

**按键**:
- WASD / 方向键 - 移动
- 空格 - 跳跃

## UI组件

### UIBase
**位置**: `scripts/ui/UIBase.ts`

**功能**: UI基类

**方法**:
- `show()` - 显示UI
- `hide()` - 隐藏UI
- `onShow()` - 显示时调用（可重写）
- `onHide()` - 隐藏时调用（可重写）
```

### 第五步：生成场景组装指南

**场景组装指南（scene_setup_guide.md）：**

```markdown
# 场景组装指南

## 主菜单场景 (MainMenu.scene)

### 节点结构
```
MainMenu (Canvas)
├── Background (Sprite)
├── MainMenuPanel (Node)
│   ├── Title (Label)
│   ├── BtnStart (Button)
│   ├── BtnSettings (Button)
│   └── BtnQuit (Button)
└── AudioManager (Node)
```

### 组装步骤
1. 创建 Canvas 节点
2. 添加 Background Sprite，设置图片为 `bg_main_menu`
3. 创建 Panel，添加按钮组件
4. 为每个按钮配置：
   - 正常状态图片
   - 悬停状态图片
   - 按下状态图片
   - 点击事件
5. 添加 MainMenuScene 脚本组件
6. 添加 AudioManager 组件

## 游戏场景 (GameScene.scene)

### 节点结构
```
GameScene (Canvas)
├── Background (Sprite)
├── GameWorld (Node)
│   ├── Player (Node)
│   │   └── Sprite (Character Component)
│   └── Enemies (Node)
│       └── Enemy01 (Node)
│           └── Sprite (Character Component)
├── UI (Canvas)
│   ├── HealthBar (Node)
│   ├── ScoreLabel (Label)
│   └── PauseBtn (Button)
├── Camera (Camera)
└── GameManager (Node)
```

### 组装步骤
1. 创建场景节点
2. 创建玩家预制体
3. 创建敌人预制体
4. 设置相机参数
5. 配置UI元素
6. 添加脚本组件
```

### 第六步：生成项目说明文档

**项目说明（project_readme.md）：**

```markdown
# 项目说明

## 项目信息
- **项目名称**: [游戏名称]
- **Cocos版本**: 3.x
- **TypeScript版本**: 4.x
- **创建日期**: [日期]

## 项目结构
（项目目录结构说明）

## 快速开始

### 1. 导入项目
（导入步骤说明）

### 2. 配置资源
（资源配置说明）

### 3. 运行项目
（运行说明）

## 核心功能
（游戏核心功能说明）

## 技术说明
（技术实现说明）

## 注意事项
（开发注意事项）
```

### 第七步：输出最终清单

生成 `resource_manifest.md`，包含：

```markdown
# 资源管理输出清单

## 项目信息
- 项目名称：
- 生成时间：
- 版本号：

## 资源统计

### 代码文件
| 类别 | 文件数 | 说明 |
|------|--------|------|
| 核心系统 | | |
| 场景脚本 | | |
| 组件 | | |
| UI组件 | | |
| 数据结构 | | |
| 工具函数 | | |

### 美术资源
| 类别 | 文件数 | 说明 |
|------|--------|------|
| 场景背景 | | |
| 角色精灵 | | |
| UI资源 | | |
| 动画资源 | | |

### 音频资源
| 类别 | 文件数 | 总时长 |
|------|--------|--------|
| 背景音乐 | | |
| 音效 | | |

### 配置文件
| 文件名 | 说明 |
|--------|------|
| scene_config.json | |
| prefab_config.json | |
| resource_mapping.json | |
| game_config.json | |
| level_data.json | |

## 输出文件

### 项目文件
- [ ] scripts/ - TypeScript代码
- [ ] scenes/ - 场景文件
- [ ] prefabs/ - 预制体
- [ ] textures/ - 图片资源
- [ ] audio/ - 音频资源
- [ ] animations/ - 动画资源
- [ ] config/ - 配置文件

### 文档文件
- [ ] import_checklist.md - 资源导入清单
- [ ] component_guide.md - 组件使用指南
- [ ] scene_setup_guide.md - 场景组装指南
- [ ] project_readme.md - 项目说明
```

## 输出文件清单

| 文件/目录 | 说明 |
|-----------|------|
| scripts/ | 所有TypeScript代码 |
| scenes/ | 场景文件结构 |
| prefabs/ | 预制体文件结构 |
| textures/ | 所有图片资源 |
| audio/ | 所有音频资源 |
| animations/ | 动画资源结构 |
| config/ | 所有配置文件 |
| import_checklist.md | 资源导入清单 |
| component_guide.md | 组件使用指南 |
| scene_setup_guide.md | 场景组装指南 |
| project_readme.md | 项目说明文档 |
| resource_manifest.md | 资源管理输出清单 |

## 项目交付标准

1. **结构规范**：遵循Cocos Creator标准项目结构
2. **文档完整**：包含所有必要的使用文档
3. **资源完整**：所有资源文件齐全
4. **配置正确**：所有配置文件格式正确、引用完整
5. **易于使用**：提供清晰的导入和使用指南

## 注意事项

1. **路径问题**：确保所有资源路径相对于assets目录
2. **编码格式**：所有文本文件使用UTF-8编码
3. **命名规范**：遵循项目命名规范
4. **版本兼容**：确保与目标Cocos Creator版本兼容
5. **测试验证**：建议在Cocos Creator中验证项目结构
