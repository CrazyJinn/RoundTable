# 废土之战 - 序章Demo

> 基于 Cocos Creator 3.x + TypeScript 开发的2D俯视角动作游戏序章Demo

---

## Demo概述

本Demo实现了游戏序章的核心内容：**14年前，魔法派女主执行任务时杀死了科技派男主的双亲**

### 包含功能

- ✅ **对话系统** - 打字机效果、对话选项、剧情分支
- ✅ **战斗系统** - 伤害计算、暴击、闪避、防御减伤
- ✅ **角色系统** - 移动、攻击、受伤、死亡
- ✅ **UI系统** - 对话UI、战斗UI（血条、技能）
- ✅ **输入系统** - WASD移动、鼠标瞄准、技能按键
- ✅ **序章剧情** - 三阶段完整剧情流程

---

## 快速开始

### 环境要求

- Cocos Creator 3.x
- TypeScript 4.x
- Node.js（可选，用于开发工具）

### 导入项目

1. 打开 Cocos Creator
2. 新建或打开项目
3. 将 `Demo` 文件夹复制到项目的 `assets` 目录下
4. 等待资源导入完成

### 创建场景

#### 1. 创建序章场景

```
PrologueScene (场景根节点)
├── Canvas
│   ├── UILayer
│   │   ├── DialogPanel
│   │   │   ├── SpeakerNameLabel (Label)
│   │   │   ├── DialogText (RichText)
│   │   │   ├── OptionsContainer (Node)
│   │   │   └── ContinueHint (Node)
│   │   └── BattlePanel
│   │       ├── PlayerHealthBar (ProgressBar)
│   │       ├── PlayerManaBar (ProgressBar)
│   │       ├── EnemyHealthBar (ProgressBar)
│   │       └── SkillBar (Node)
│   ├── BattleArea (Node)
│   └── ManagerNode (Node)
└── PrologueScene (脚本组件)
```

#### 2. 配置管理器

在 `ManagerNode` 上添加以下组件：
- GameManager
- DialogManager
- CombatSystem
- InputManager

#### 3. 配置PrologueScene脚本

在场景根节点上添加 `PrologueScene` 脚本，配置属性：
- uiLayer → UILayer节点
- dialogUI → DialogPanel节点
- battleUI → BattlePanel节点
- battleArea → BattleArea节点
- playerPrefab → 玩家预制体（需要创建）
- enemyPrefab → 敌人预制体（需要创建）

#### 4. 创建预制体

**PlayerPrefab**:
- 添加 Sprite 组件（临时用色块）
- 添加 Character 组件
- 添加 Animation 组件（可选）

**EnemyPrefab**:
- 添加 Sprite 组件（临时用色块）
- 添加 Character 组件
- 添加 Animation 组件（可选）

**OptionButtonPrefab**:
- 添加 Button 组件
- 添加 Label 子节点（显示选项文本）

---

## 目录结构

```
Demo/
├── scripts/                          # 脚本文件
│   ├── core/                         # 核心系统
│   │   ├── GameManager.ts            # 游戏管理器
│   │   ├── InputManager.ts           # 输入管理器
│   │   ├── ObjectPool.ts             # 对象池
│   │   ├── DialogManager.ts          # 对话管理器
│   │   └── CombatSystem.ts           # 战斗系统
│   ├── scenes/                       # 场景脚本
│   │   └── PrologueScene.ts          # 序章场景
│   ├── components/                   # 组件
│   │   └── Character.ts              # 角色组件
│   ├── ui/                           # UI组件
│   │   ├── DialogUI.ts               # 对话UI
│   │   └── BattleUI.ts               # 战斗UI
│   └── data/                         # 数据结构
│       ├── DialogData.ts             # 对话数据结构
│       ├── CombatData.ts             # 战斗数据结构
│       └── PrologueDialogData.ts     # 序章对话数据
├── resources/                        # 资源文件
│   └── data/
│       └── game_config.json          # 游戏配置
├── code_manifest.md                  # 代码资源清单
└── README.md                         # 本文件
```

---

## 核心系统说明

### 对话系统

**文件：** `core/DialogManager.ts` + `ui/DialogUI.ts`

**功能：**
- 打字机效果显示文本
- 角色名称和颜色显示
- 对话选项分支
- 对话跳转
- 事件触发

**使用方法：**
```typescript
DialogManager.instance.startDialog(
    dialogData,
    'phase1_task',
    () => console.log('对话开始'),
    () => console.log('对话结束'),
    (line) => console.log('当前对话:', line)
);
```

### 战斗系统

**文件：** `core/CombatSystem.ts` + `components/Character.ts`

**功能：**
- 伤害计算（暴击、闪避、防御减伤）
- 单体/范围攻击
- 战斗单位管理
- 战斗状态控制

**伤害公式：**
```
基础伤害 = 攻击者攻击力 + 技能基础伤害
防御减伤 = 防御力 / (防御力 + 100)
最终伤害 = 基础伤害 × (1 - 防减免伤) × 暴击倍率
```

### 角色系统

**文件：** `components/Character.ts`

**功能：**
- 角色属性管理
- 移动控制
- 攻击功能
- 受伤/治疗
- 死亡处理

---

## 序章剧情

### 剧情流程

```
【14年前】
    ↓
第一阶段：任务接受
  - 长老派遣女主前往科技派聚居地
  - 任务目标：销毁古代遗物
  - 必要时可采取一切手段
    ↓
第二阶段：潜入战斗
  - 女主潜入聚居地
  - 被男主双亲发现
  - 发生战斗
  - 【击败男主双亲】
    ↓
第三阶段：战后反思
  - 女主完成任务
  - 发现目击者：3岁的男主
  - 女主带着愧疚离开
    ↓
【序章 完】
```

### 对话数据

**文件：** `data/PrologueDialogData.ts`

包含三个对话段：
- `phase1_task` - 任务接受
- `phase2_infiltration` - 潜入战斗
- `phase3_reflection` - 战后反思

---

## 配置说明

### game_config.json

游戏全局配置，包含：

| 配置项 | 说明 |
|--------|------|
| input | 键盘/鼠标键位映射 |
| characters | 角色属性和技能 |
| enemies | 敌人属性和AI |
| dialog | 对话系统参数 |
| combat | 战斗系统参数 |
| scenes | 场景配置 |
| audio | 音频配置 |

---

## 待办事项

### 核心功能
- [ ] 完善角色动画（待机、移动、攻击、受伤、死亡）
- [ ] 添加技能特效
- [ ] 实现伤害数字显示
- [ ] 完善敌人AI

### 美术资源
- [ ] 角色精灵图
- [ ] 场景背景图
- [ ] UI资源
- [ ] 特效资源

### 音频资源
- [ ] 背景音乐（主菜单、对话、战斗）
- [ ] 音效（攻击、受伤、死亡、对话点击）

### 扩展功能
- [ ] 更多技能
- [ ] 更多敌人类型
- [ ] 关卡系统
- [ ] 保存/加载系统
- [ ] 成就系统

---

## 常见问题

### Q: 场景运行后没有显示？

A: 检查以下项目：
1. 是否正确配置了UILayer和BattleArea
2. DialogPanel和BattlePanel的初始状态是否正确
3. 是否有报错信息（查看控制台）

### Q: 对话不显示？

A: 检查以下项目：
1. DialogManager是否正确初始化
2. 对话数据是否正确加载
3. DialogUI组件是否正确配置

### Q: 战斗不工作？

A: 检查以下项目：
1. 玩家和敌人预制体是否正确创建
2. Character组件是否正确初始化
3. CombatSystem是否正确注册战斗单位

---

## 开发建议

### 1. 先测试核心功能

建议先使用简单的色块作为临时美术资源，测试核心功能是否正常：

```typescript
// 创建临时角色Sprite
const sprite = node.addComponent(Sprite);
sprite.color = Color.RED; // 敌人用红色
// sprite.color = Color.BLUE; // 玩家用蓝色
```

### 2. 逐步完善

按照以下顺序逐步完善：
1. 核心功能测试
2. 添加美术资源
3. 添加动画
4. 添加音频
5. 添加特效

### 3. 使用版本控制

建议使用Git管理代码：
```bash
git init
git add .
git commit -m "Initial commit: Prologue demo"
```

---

## 技术支持

如有问题，请参考以下文档：
- [code_manifest.md](code_manifest.md) - 详细的代码资源清单
- Cocos Creator官方文档：https://docs.cocos.com/creator/3.x/

---

## 版本信息

- **版本号：** 0.1.0
- **创建日期：** 2026-02-08
- **引擎版本：** Cocos Creator 3.x
- **TypeScript版本：** 4.x

---

## 许可证

本Demo仅供学习和参考使用。
