# Demo代码资源清单

> 剧本拆解师 - 序章Demo代码生成文档

---

## 生成信息

| 项目 | 信息 |
|------|------|
| 生成时间 | 2026-02-08 |
| Cocos版本 | Creator 3.x |
| TypeScript版本 | 4.x |
| Demo内容 | 序章：女主执行任务时杀死男主双亲 |

---

## 目录结构

```
Demo/
├── scripts/
│   ├── core/                      # 核心系统
│   │   ├── GameManager.ts         # 游戏管理器
│   │   ├── InputManager.ts        # 输入管理器
│   │   ├── ObjectPool.ts          # 对象池
│   │   ├── DialogManager.ts       # 对话管理器
│   │   └── CombatSystem.ts        # 战斗系统
│   ├── scenes/                    # 场景脚本
│   │   └── PrologueScene.ts       # 序章场景
│   ├── components/                # 组件
│   │   └── Character.ts           # 角色组件
│   ├── ui/                        # UI组件
│   │   ├── DialogUI.ts            # 对话UI
│   │   └── BattleUI.ts            # 战斗UI
│   └── data/                      # 数据结构
│       ├── DialogData.ts          # 对话数据结构
│       ├── CombatData.ts          # 战斗数据结构
│       └── PrologueDialogData.ts  # 序章对话数据
└── resources/
    └── data/
        └── game_config.json       # 游戏配置
```

---

## 代码文件清单

### 核心系统（core/）

| 文件名 | 说明 | 关键类/接口 | 行数 |
|--------|------|-------------|------|
| GameManager.ts | 游戏管理器 | GameManager, GameState, EventManager, GameEvent | ~180 |
| InputManager.ts | 输入管理器 | InputManager, InputType, InputEventData | ~150 |
| ObjectPool.ts | 对象池 | ObjectPool | ~50 |
| DialogManager.ts | 对话管理器 | DialogManager | ~180 |
| CombatSystem.ts | 战斗系统 | CombatSystem | ~200 |

**GameManager.ts** - 游戏流程控制
- 游戏状态管理（LOADING/MENU/DIALOG/PLAYING/PAUSED/GAMEOVER）
- 场景切换控制
- 游戏数据保存/加载
- 对话标记管理
- 战斗单位注册

**InputManager.ts** - 输入统一管理
- 键盘输入（WASD/方向键）
- 鼠标输入（位置/点击）
- 输入回调系统
- 移动输入计算

**DialogManager.ts** - 对话系统核心
- 对话数据解析
- 打字效果控制
- 对话选项处理
- 对话跳转
- 事件触发

**CombatSystem.ts** - 战斗系统核心
- 伤害计算（暴击/闪避/防御减伤）
- 单体/范围伤害
- 战斗单位管理
- 战斗状态控制

### 场景脚本（scenes/）

| 文件名 | 说明 | 关键类 | 行数 |
|--------|------|--------|------|
| PrologueScene.ts | 序章场景 | PrologueScene | ~400 |

**PrologueScene.ts** - 序章场景实现
- 三阶段剧情流程控制
  1. 任务接受（对话）
  2. 潜入战斗
  3. 战后反思（对话）
- 玩家/敌人创建
- 战斗流程控制
- 输入处理
- UI控制

### 组件（components/）

| 文件名 | 说明 | 关键类 | 行数 |
|--------|------|--------|------|
| Character.ts | 角色组件 | Character | ~250 |

**Character.ts** - 角色功能实现
- 角色属性系统
- 移动控制
- 攻击功能
- 受伤/治疗
- 死亡处理
- 动画播放
- 精灵翻转

### UI组件（ui/）

| 文件名 | 说明 | 关键类 | 行数 |
|--------|------|--------|------|
| DialogUI.ts | 对话UI | DialogUI | ~200 |
| BattleUI.ts | 战斗UI | BattleUI | ~180 |

**DialogUI.ts** - 对话界面实现
- 对话面板显示/隐藏
- 角色名称显示
- 打字效果
- 对话选项按钮
- 点击继续处理

**BattleUI.ts** - 战斗界面实现
- 血条/魔法条显示
- 敌人状态显示
- 技能冷却显示
- UI实时更新

### 数据结构（data/）

| 文件名 | 说明 | 接口/类型 | 行数 |
|--------|------|-----------|------|
| DialogData.ts | 对话数据结构 | DialogData, DialogSection, DialogLine, DialogOption, DialogCharacter | ~50 |
| CombatData.ts | 战斗数据结构 | CharacterStats, DamageResult, SkillData, CombatUnitData | ~60 |
| PrologueDialogData.ts | 序章对话数据 | prologueDialogData, prologueCharacters | ~150 |

---

## 功能模块说明

### 1. 对话系统

**功能：**
- 打字机效果显示文本
- 角色名称和头像显示
- 对话选项分支
- 对话跳转
- 事件触发

**使用方法：**
```typescript
DialogManager.instance.startDialog(
    dialogData,
    sectionId,
    onStart,    // 对话开始回调
    onEnd,      // 对话结束回调
    onLineComplete // 每句完成回调
);
```

### 2. 战斗系统

**功能：**
- 伤害计算（含暴击/闪避/防御）
- 单体/范围攻击
- 战斗单位管理
- 战斗状态控制

**使用方法：**
```typescript
// 开始战斗
CombatSystem.instance.startBattle();

// 造成伤害
CombatSystem.instance.dealDamage(
    attackerId,
    targetId,
    baseDamage,
    attackType
);

// 结束战斗
CombatSystem.instance.endBattle(victory);
```

### 3. 角色系统

**功能：**
- 角色属性管理
- 移动控制
- 攻击功能
- 受伤/治疗
- 死亡处理

**使用方法：**
```typescript
const character = node.getComponent(Character);
character.init(
    id,
    name,
    type,
    faction,
    stats
);

// 移动
character.moveTo(targetPos);

// 攻击
character.attack(target, damage, attackType);

// 受伤
character.takeDamage(damage);
```

---

## 序章剧情流程

```
开始
  ↓
第一阶段：任务接受
  ├─ 长老派遣任务
  ├─ 女主接受任务
  └─ 女主出发前往科技派聚居地
  ↓
第二阶段：潜入战斗
  ├─ 女主潜入聚居地
  ├─ 被男主双亲发现
  ├─ 【战斗开始】
  └─ 击败男主双亲
  ↓
第三阶段：战后反思
  ├─ 女主完成任务
  ├─ 发现小男主
  └─ 女主带着愧疚离开
  ↓
【序章 完】
```

---

## 配置文件说明

### game_config.json

游戏全局配置文件，包含：

| 配置项 | 说明 |
|--------|------|
| game | 游戏基本信息（类型、分辨率、平台） |
| input | 输入键位映射 |
| characters | 角色属性和技能配置 |
| enemies | 敌人属性和AI配置 |
| dialog | 对话系统配置 |
| combat | 战斗系统配置 |
| scenes | 场景配置 |
| audio | 音频配置 |

---

## 使用说明

### 1. 导入到Cocos Creator

1. 将Demo文件夹复制到Cocos Creator项目的assets目录下
2. 等待资源导入完成
3. 检查TypeScript编译是否成功

### 2. 创建场景

1. 在Cocos Creator中创建新场景，命名为PrologueScene
2. 添加以下节点结构：
   - Canvas
     - UILayer (对话UI、战斗UI)
     - BattleArea (战斗区域)
     - ManagerNode (添加管理器组件)
3. 将PrologueScene脚本挂载到场景根节点
4. 配置脚本中的属性引用

### 3. 配置管理器

在场景中创建管理器节点，添加以下组件：
- GameManager
- DialogManager
- CombatSystem
- InputManager

### 4. 创建预制体

需要创建以下预制体：
- PlayerPrefab（玩家角色预制体）
- EnemyPrefab（敌人角色预制体）
- OptionButtonPrefab（对话选项按钮预制体）

### 5. 配置UI

创建以下UI：
- DialogPanel（对话面板）
  - SpeakerNameLabel（说话者名称）
  - DialogText（对话文本，使用RichText组件）
  - OptionsContainer（选项容器）
  - ContinueHint（继续提示）
- BattlePanel（战斗面板）
  - PlayerHealthBar（玩家血条）
  - PlayerManaBar（玩家魔法条）
  - EnemyHealthBar（敌人血条）
  - SkillBar（技能栏）

### 6. 运行测试

1. 点击运行按钮
2. 观察控制台输出
3. 测试对话系统
4. 测试战斗系统

---

## 注意事项

### 已知限制

1. **美术资源**：Demo中未包含实际美术资源，需要自行准备
2. **动画资源**：角色动画需要自行配置
3. **音频资源**：背景音乐和音效需要自行添加
4. **场景布局**：场景节点结构需要在Cocos Creator中手动创建

### 待完善功能

1. **AI系统**：当前敌人AI为简化版，需要扩展
2. **技能系统**：技能效果需要更详细的实现
3. **保存系统**：游戏保存功能需要完善
4. **音效系统**：音频播放功能需要集成
5. **特效系统**：伤害数字、特效等需要添加

### 扩展建议

1. **完善美术资源**：
   - 角色精灵图
   - 场景背景图
   - UI资源
   - 特效资源

2. **完善音频资源**：
   - 背景音乐
   - 音效
   - 语音（可选）

3. **扩展功能**：
   - 更多技能
   - 更多敌人类型
   - 关卡系统
   - 成就系统

---

## 下一步建议

1. **第一阶段**：在Cocos Creator中搭建场景，配置好所有UI和预制体
2. **第二阶段**：准备临时美术资源（简单色块即可），测试核心功能
3. **第三阶段**：完善美术资源，添加动画和特效
4. **第四阶段**：添加音频资源，完善游戏体验
5. **第五阶段**：扩展内容，添加更多剧情和战斗

---

**文档版本：** v1.0
**最后更新：** 2026-02-08
**维护者：** 代码架构师
