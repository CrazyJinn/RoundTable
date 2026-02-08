---
name: 配置生成师
description: 游戏开发流程中的配置文件生成角色，负责整合美术资源、音频资源和代码，生成Cocos Creator 2D游戏所需的配置文件，包括场景配置、预制体配置、资源路径映射、游戏参数配置等。当美术、音频、代码资源都生成完毕后，需要生成配置文件时触发此技能。
---

# 配置生成师

## 概述

整合美术、音频、代码资源，生成Cocos Creator所需的配置文件，确保所有资源能够正确加载和使用。

## 输入

| 输入项 | 来源 | 说明 |
|--------|------|------|
| 美术资源包 | 美术生成师 | 场景背景、角色精灵、UI资源 |
| 音频资源包 | 音频生成师 | 背景音乐、音效 |
| 代码文件 | 代码架构师 | TypeScript代码 |
| 资源清单 | 各生成师 | 完整的资源清单 |
| 游戏基本信息 | 剧本拆解师 | 游戏类型、分辨率等 |

## 工作流程

```
接收资源 → 分析资源 → 生成配置 → 整合映射 → 输出交付
```

### 第一步：接收并分析资源

**资源检查清单：**

| 资源类型 | 检查项 |
|---------|--------|
| 美术资源 | 文件完整性、命名规范、格式正确 |
| 音频资源 | 文件完整性、格式兼容 |
| 代码文件 | 语法正确、类型定义完整 |

### 第二步：生成场景配置

**场景配置文件（scene_config.json）：**

```json
{
  "scenes": [
    {
      "id": "scene_001",
      "name": "MainMenu",
      "type": "menu",
      "description": "主菜单场景",
      "resources": {
        "background": "bg_main_menu",
        "audio": {
          "bgm": "bgm_main_theme"
        },
        "ui": ["ui_main_menu", "ui_btn_start", "ui_btn_settings", "ui_btn_quit"]
      },
      "script": "MainMenuScene",
      "nextScenes": {
        "start": "scene_002"
      }
    },
    {
      "id": "scene_002",
      "name": "Level01",
      "type": "level",
      "description": "第一关",
      "resources": {
        "background": "bg_level_01",
        "audio": {
          "bgm": "bgm_level_01"
        },
        "characters": ["char_player", "char_enemy_01"],
        "ui": ["ui_hud", "ui_pause_btn"]
      },
      "script": "GameScene",
      "levelData": "level_01_data"
    }
  ]
}
```

### 第三步：生成预制体配置

**预制体配置文件（prefab_config.json）：**

```json
{
  "prefabs": [
    {
      "id": "player",
      "name": "PlayerPrefab",
      "type": "character",
      "components": [
        "Character",
        "PlayerController",
        "AnimationController"
      ],
      "resources": {
        "sprite": "char_player",
        "audio": {
          "footstep": "sfx_footstep",
          "jump": "sfx_jump"
        }
      },
      "properties": {
        "health": 100,
        "speed": 200,
        "jumpForce": 500
      }
    },
    {
      "id": "enemy_01",
      "name": "Enemy01Prefab",
      "type": "character",
      "components": [
        "Character",
        "EnemyAI",
        "AnimationController"
      ],
      "resources": {
        "sprite": "char_enemy_01",
        "audio": {
          "attack": "sfx_enemy_attack",
          "death": "sfx_enemy_death"
        }
      },
      "properties": {
        "health": 50,
        "speed": 100,
        "damage": 10
      }
    }
  ]
}
```

### 第四步：生成资源路径映射

**资源映射文件（resource_mapping.json）：**

```json
{
  "version": "1.0.0",
  "resources": {
    "backgrounds": {
      "bg_main_menu": {
        "path": "textures/backgrounds/bg_main_menu.png",
        "type": "sprite-frame"
      },
      "bg_level_01": {
        "path": "textures/backgrounds/bg_level_01.png",
        "type": "sprite-frame"
      }
    },
    "characters": {
      "char_player": {
        "idle": "textures/characters/player/char_player_idle.png",
        "walk": "textures/characters/player/char_player_walk.png",
        "attack": "textures/characters/player/char_player_attack.png",
        "type": "sprite-atlas"
      },
      "char_enemy_01": {
        "idle": "textures/characters/enemy_01/char_enemy_01_idle.png",
        "walk": "textures/characters/enemy_01/char_enemy_01_walk.png",
        "type": "sprite-atlas"
      }
    },
    "ui": {
      "ui_main_menu": {
        "path": "textures/ui/ui_main_menu.png",
        "type": "sprite-frame"
      },
      "ui_btn_start": {
        "normal": "textures/ui/btn_start_normal.png",
        "hover": "textures/ui/btn_start_hover.png",
        "pressed": "textures/ui/btn_start_pressed.png",
        "type": "button"
      }
    },
    "audio": {
      "bgm": {
        "bgm_main_theme": {
          "path": "audio/bgm/bgm_main_theme.mp3",
          "loop": true,
          "volume": 0.6
        },
        "bgm_level_01": {
          "path": "audio/bgm/bgm_level_01.mp3",
          "loop": true,
          "volume": 0.6
        }
      },
      "sfx": {
        "sfx_jump": {
          "path": "audio/sfx/sfx_jump.mp3",
          "loop": false,
          "volume": 0.8
        },
        "sfx_attack": {
          "path": "audio/sfx/sfx_attack.mp3",
          "loop": false,
          "volume": 0.8
        }
      }
    }
  }
}
```

### 第五步：生成游戏参数配置

**游戏参数配置（game_config.json）：**

```json
{
  "game": {
    "name": "游戏名称",
    "version": "1.0.0",
    "targetFPS": 60,
    "designResolution": {
      "width": 1920,
      "height": 1080
    },
    "orientation": "landscape"
  },
  "player": {
    "maxHealth": 100,
    "maxSpeed": 300,
    "acceleration": 500,
    "friction": 0.8,
    "jumpForce": 800
  },
  "camera": {
    "followSpeed": 5,
    "zoom": 1,
    "bounds": {
      "left": -1000,
      "right": 1000,
      "top": 500,
      "bottom": -500
    }
  },
  "audio": {
    "masterVolume": 1.0,
    "bgmVolume": 0.6,
    "sfxVolume": 0.8
  },
  "gameplay": {
    "respawnTime": 2,
    "invincibleTime": 1,
    "scoreMultiplier": 1
  }
}
```

### 第六步：生成关卡数据配置

**关卡数据配置（level_data.json）：**

```json
{
  "levels": [
    {
      "id": "level_01",
      "name": "第一关",
      "scene": "scene_002",
      "difficulty": 1,
      "timeLimit": 300,
      "objectives": [
        {
          "type": "reach_destination",
          "description": "到达终点"
        }
      ],
      "spawns": {
        "player": {
          "position": { "x": -400, "y": 0 }
        },
        "enemies": [
          {
            "prefab": "enemy_01",
            "position": { "x": 200, "y": 0 },
            "count": 3
          }
        ]
      },
      "items": [
        {
          "type": "coin",
          "position": { "x": 100, "y": 50 },
          "value": 10
        }
      ],
      "triggers": [
        {
          "id": "finish_trigger",
          "position": { "x": 800, "y": 0 },
          "size": { "width": 100, "height": 200 },
          "action": "complete_level"
        }
      ]
    }
  ]
}
```

### 第七步：生成动画配置

**动画配置（animation_config.json）：**

```json
{
  "animations": [
    {
      "id": "player_anim_idle",
      "target": "char_player",
      "type": "sprite_frame",
      "frames": ["char_player_idle_0", "char_player_idle_1", "char_player_idle_2", "char_player_idle_3"],
      "frameRate": 8,
      "loop": true
    },
    {
      "id": "player_anim_walk",
      "target": "char_player",
      "type": "sprite_frame",
      "frames": ["char_player_walk_0", "char_player_walk_1", "char_player_walk_2", "char_player_walk_3",
                 "char_player_walk_4", "char_player_walk_5", "char_player_walk_6", "char_player_walk_7"],
      "frameRate": 12,
      "loop": true
    },
    {
      "id": "player_anim_jump",
      "target": "char_player",
      "type": "sprite_frame",
      "frames": ["char_player_jump_0", "char_player_jump_1", "char_player_jump_2",
                 "char_player_jump_3", "char_player_jump_4", "char_player_jump_5"],
      "frameRate": 12,
      "loop": false
    }
  ]
}
```

### 第八步：生成UI布局配置

**UI布局配置（ui_layout.json）：**

```json
{
  "layouts": [
    {
      "id": "main_menu_layout",
      "name": "MainMenu",
      "elements": [
        {
          "id": "ui_main_menu",
          "type": "panel",
          "position": { "x": 0, "y": 0 },
          "size": { "width": 1920, "height": 1080 },
          "anchor": { "x": 0.5, "y": 0.5 }
        },
        {
          "id": "btn_start",
          "type": "button",
          "position": { "x": 0, "y": 100 },
          "size": { "width": 200, "height": 60 },
          "anchor": { "x": 0.5, "y": 0.5 },
          "resources": {
            "normal": "ui_btn_start_normal",
            "hover": "ui_btn_start_hover",
            "pressed": "ui_btn_start_pressed"
          },
          "onClick": "start_game"
        },
        {
          "id": "btn_settings",
          "type": "button",
          "position": { "x": 0, "y": 0 },
          "size": { "width": 200, "height": 60 },
          "anchor": { "x": 0.5, "y": 0.5 },
          "resources": {
            "normal": "ui_btn_settings_normal",
            "hover": "ui_btn_settings_hover",
            "pressed": "ui_btn_settings_pressed"
          },
          "onClick": "open_settings"
        },
        {
          "id": "btn_quit",
          "type": "button",
          "position": { "x": 0, "y": -100 },
          "size": { "width": 200, "height": 60 },
          "anchor": { "x": 0.5, "y": 0.5 },
          "resources": {
            "normal": "ui_btn_quit_normal",
            "hover": "ui_btn_quit_hover",
            "pressed": "ui_btn_quit_pressed"
          },
          "onClick": "quit_game"
        }
      ]
    }
  ]
}
```

### 第九步：输出配置清单

生成 `config_manifest.md`，包含：

```markdown
# 配置文件清单

## 生成信息
- 生成时间：
- 配置版本：
- Cocos版本：

## 配置文件列表

| 文件名 | 说明 | 依赖资源 |
|--------|------|----------|
| scene_config.json | 场景配置 | 美术、音频资源 |
| prefab_config.json | 预制体配置 | 美术、代码 |
| resource_mapping.json | 资源路径映射 | 全部资源 |
| game_config.json | 游戏参数配置 | 无 |
| level_data.json | 关卡数据配置 | 预制体 |
| animation_config.json | 动画配置 | 美术资源 |
| ui_layout.json | UI布局配置 | UI资源 |

## 配置说明

### scene_config.json
定义每个场景的资源引用和脚本关联。

### prefab_config.json
定义预制体的组件和属性配置。

### resource_mapping.json
资源ID到文件路径的映射表，用于运行时加载资源。

### game_config.json
游戏全局参数，包括玩家属性、相机设置、音频设置等。

### level_data.json
关卡设计数据，包括敌人生成、道具位置、触发器等。

### animation_config.json
动画剪辑配置，定义帧序列和播放参数。

### ui_layout.json
UI界面布局配置，定义元素位置和交互。

## 使用说明
（列出配置文件的使用方法和注意事项）
```

## 输出文件清单

| 文件 | 说明 |
|------|------|
| scene_config.json | 场景配置 |
| prefab_config.json | 预制体配置 |
| resource_mapping.json | 资源路径映射 |
| game_config.json | 游戏参数配置 |
| level_data.json | 关卡数据配置 |
| animation_config.json | 动画配置 |
| ui_layout.json | UI布局配置 |
| config_manifest.md | 配置文件清单 |

## 配置文件规范

1. **JSON格式**：所有配置文件使用JSON格式
2. **编码格式**：UTF-8编码
3. **命名规范**：使用下划线分隔的小写命名
4. **版本控制**：包含版本号便于追溯

## 注意事项

1. **资源引用**：确保所有资源ID在映射文件中存在
2. **路径正确**：资源路径使用相对于assets目录的路径
3. **类型匹配**：资源配置类型与实际文件类型匹配
4. **完整性检查**：所有必需的配置项都不能缺失
