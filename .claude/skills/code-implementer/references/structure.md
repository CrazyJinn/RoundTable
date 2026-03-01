# 游戏项目目录结构

## Cocos Creator 3.x 项目结构

```
project/
├── assets/                      # 资源目录
│   ├── scripts/                 # 脚本目录
│   │   ├── core/                # 核心系统
│   │   │   ├── GameManager.ts
│   │   │   ├── InputManager.ts
│   │   │   ├── SceneManager.ts
│   │   │   ├── AudioManager.ts
│   │   │   ├── SaveManager.ts
│   │   │   └── EventManager.ts
│   │   │
│   │   ├── systems/             # 游戏系统
│   │   │   ├── CombatSystem.ts
│   │   │   ├── DialogSystem.ts
│   │   │   ├── InventorySystem.ts
│   │   │   └── QuestSystem.ts
│   │   │
│   │   ├── components/          # 组件
│   │   │   ├── Character.ts
│   │   │   ├── Movement.ts
│   │   │   ├── Health.ts
│   │   │   ├── Animator.ts
│   │   │   ├── Interactable.ts
│   │   │   └── EnemyAI.ts
│   │   │
│   │   ├── entities/            # 实体定义
│   │   │   ├── Player.ts
│   │   │   ├── Enemy.ts
│   │   │   ├── NPC.ts
│   │   │   └── Item.ts
│   │   │
│   │   ├── ui/                  # UI组件
│   │   │   ├── DialogUI.ts
│   │   │   ├── HUD.ts
│   │   │   ├── MainMenu.ts
│   │   │   ├── PauseMenu.ts
│   │   │   └── InventoryUI.ts
│   │   │
│   │   ├── data/                # 数据结构与类型
│   │   │   ├── types.ts
│   │   │   ├── constants.ts
│   │   │   └── interfaces.ts
│   │   │
│   │   └── utils/               # 工具函数
│   │       ├── MathUtils.ts
│   │       ├── ArrayUtils.ts
│   │       └── DebugUtils.ts
│   │
│   ├── resources/               # 动态加载资源
│   │   ├── data/                # 配置数据
│   │   │   ├── characters.json
│   │   │   ├── enemies.json
│   │   │   ├── skills.json
│   │   │   ├── items.json
│   │   │   └── dialogs/         # 对话数据
│   │   │
│   │   ├── prefabs/             # 预制体
│   │   │   ├── characters/
│   │   │   ├── enemies/
│   │   │   ├── items/
│   │   │   └── effects/
│   │   │
│   │   └── scenes/              # 场景文件
│   │       ├── MainMenu.scene
│   │       ├── Game.scene
│   │       └── levels/
│   │
│   ├── textures/                # 图片资源
│   │   ├── characters/
│   │   ├── enemies/
│   │   ├── items/
│   │   ├── tiles/
│   │   └── ui/
│   │
│   ├── audio/                   # 音频资源
│   │   ├── bgm/
│   │   └── sfx/
│   │
│   └── fonts/                   # 字体资源
│
├── settings/                    # 编辑器设置
├── project.json                 # 项目配置
└── tsconfig.json               # TypeScript配置
```

## 文件命名规范

| 类型 | 命名规则 | 示例 |
|------|----------|------|
| 脚本文件 | PascalCase.ts | `GameManager.ts` |
| 场景文件 | kebab-case.scene | `main-menu.scene` |
| 预制体 | PascalCase.prefab | `Player.prefab` |
| 资源文件 | snake_case.png | `player_idle_01.png` |
| 配置文件 | kebab-case.json | `game-config.json` |

## 模块导入规范

```typescript
// 使用别名导入（tsconfig配置paths）
import { GameManager } from 'db://scripts/core/GameManager';
import { Player } from 'db://scripts/entities/Player';
import { GAME_CONFIG } from 'db://scripts/data/constants';

// 相对路径导入（同目录）
import { Helper } from './Helper';
```

## TypeScript配置示例

```json
{
  "compilerOptions": {
    "target": "ES2015",
    "module": "ES2015",
    "strict": true,
    "skipLibCheck": true,
    "importHelpers": false,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "declaration": false,
    "experimentalDecorators": true,
    "baseUrl": ".",
    "paths": {
      "db://*": ["./assets/*"]
    }
  },
  "exclude": [
    "node_modules",
    "library",
    "local",
    "temp",
    "build"
  ]
}
```
