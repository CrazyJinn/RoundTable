---
name: 角色设计师
description: 游戏开发流程中的角色设计角色，负责根据剧本拆解师输出的角色清单，生成角色概念设计的HTML原型图，包括人物设计图、人物立绘、人物精灵图等，标明图片位置、颜色、尺寸和设计说明。当剧本拆解完成并确认角色需求后，需要设计角色时触发此技能。
---

# 角色设计师

## 概述

根据游戏需求，生成角色概念设计的HTML原型图，包括人物设计图、人物立绘、人物精灵图等，通过HTML直观展示角色的外观、姿态、动画状态等，为美术资源生成师提供清晰的设计参考。

## 输入

| 输入项 | 来源 | 说明 |
|--------|------|------|
| 角色清单 | 剧本拆解师 | 包含每个角色的造型和动画需求 |
| 游戏基本信息 | 剧本拆解师 | 艺术风格、分辨率等信息 |
| 参考素材 | 用户 | 用户提供的角色参考图片或描述 |

## 工作流程

```
接收角色需求 → 确定艺术风格 → 设计角色概念图 → 设计角色立绘 → 设计角色精灵 → 输出角色原型包
```

### 第一步：接收角色需求分析

**确认关键信息：**

| 信息项 | 说明 |
|--------|------|
| 艺术风格 | 像素/手绘/扁平/卡通/写实等 |
| 角色数量 | 需要设计的角色总数 |
| 角色类型 | 主角、NPC、敌人等 |
| 动画需求 | 每个角色的动画动作 |
| 角色尺寸 | 角色精灵的像素尺寸 |
| 参考风格 | 用户提供的参考作品风格 |

### 第二步：确定角色艺术风格

**输出角色风格定义文件 `character_style.md`：**

```markdown
# 角色艺术风格定义

## 整体风格
- 风格名称：[如"像素风废土角色"]
- 风格类型：[像素/手绘/扁平/卡通/写实]
- 角色特点：[详细描述]

## 角色色彩方案
- 主色调：#[hex代码] - [颜色名称和用途]
- 皮肤色：#[hex代码] - [肤色参考]
- 服装色：#[hex代码] - [服装主色]
- 强调色：#[hex代码] - [配饰和细节]

## 角色设计规范
- 头身比例：[如3头身、4头身等]
- 线条风格：[粗细/类型]
- 质感描述：[质感特征]
- 阴影处理：[阴影方式]

## 参考角色
- [参考角色1名称和描述]
- [参考角色2名称和描述]
```

### 第三步：设计角色概念图

为每个角色生成概念设计HTML：

**角色概念图HTML结构：**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>角色概念设计 - [角色名称]</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #1a1a1a;
            font-family: Arial, sans-serif;
            padding: 20px;
        }
        .concept-container {
            display: flex;
            gap: 40px;
            align-items: flex-start;
        }
        .character-design {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .design-view {
            position: relative;
            width: [设计图宽度]px;
            height: [设计图高度]px;
            border: 2px dashed #666;
            background: rgba(255,255,255,0.05);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #fff;
        }
        .design-view h3 {
            margin-bottom: 10px;
            color: #f0c040;
        }
        .info-panel {
            background: rgba(0,0,0,0.8);
            color: #fff;
            padding: 20px;
            border-radius: 8px;
            font-size: 14px;
            min-width: 280px;
        }
        .info-panel h3 {
            margin-bottom: 15px;
            color: #f0c040;
            font-size: 18px;
        }
        .info-item {
            margin: 8px 0;
        }
        .info-item label {
            color: #888;
            margin-right: 8px;
        }
        .color-palette {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }
        .color-swatch {
            width: 40px;
            height: 40px;
            border-radius: 4px;
            border: 2px solid #444;
        }
    </style>
</head>
<body>
    <div class="concept-container">
        <!-- 角色设计视图 -->
        <div class="character-design">
            <!-- 正面视图 -->
            <div class="design-view" data-resource="char_[ID]_design_front"
                 data-view="front" style="width: 256px; height: 256px;">
                <h3>正面设计图</h3>
                <div style="font-size: 12px; opacity: 0.8;">
                    256x256px | [色调描述]
                </div>
            </div>

            <!-- 侧面视图 -->
            <div class="design-view" data-resource="char_[ID]_design_side"
                 data-view="side" style="width: 256px; height: 256px;">
                <h3>侧面设计图</h3>
                <div style="font-size: 12px; opacity: 0.8;">
                    256x256px | [色调描述]
                </div>
            </div>

            <!-- 背面视图 -->
            <div class="design-view" data-resource="char_[ID]_design_back"
                 data-view="back" style="width: 256px; height: 256px;">
                <h3>背面设计图</h3>
                <div style="font-size: 12px; opacity: 0.8;">
                    256x256px | [色调描述]
                </div>
            </div>
        </div>

        <!-- 角色信息面板 -->
        <div class="info-panel">
            <h3>[角色名称] - 概念设计</h3>
            <div class="info-item">
                <label>角色ID:</label> char_[编号]
            </div>
            <div class="info-item">
                <label>角色类型:</label> [主角/NPC/敌人]
            </div>
            <div class="info-item">
                <label>头身比例:</label> [如3头身]
            </div>
            <div class="info-item">
                <label>体型:</label> [体型描述]
            </div>
            <div class="info-item">
                <label>发型:</label> [发型描述]
            </div>
            <div class="info-item">
                <label>服装:</label> [服装风格和细节]
            </div>
            <div class="info-item">
                <label>特征:</label> [标志性特征]
            </div>
            <div class="info-item">
                <label>表情:</label> [默认表情]
            </div>
            <hr style="margin: 15px 0; border-color: #333;">
            <div class="info-item">
                <label>配色方案:</label>
                <div class="color-palette">
                    <div class="color-swatch" style="background: #[主色];" title="主色"></div>
                    <div class="color-swatch" style="background: #[皮肤色];" title="皮肤色"></div>
                    <div class="color-swatch" style="background: #[服装色];" title="服装色"></div>
                    <div class="color-swatch" style="background: #[强调色];" title="强调色"></div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

**角色概念图HTML规范：**

| 元素 | 属性 | 说明 |
|------|------|------|
| `.design-view` | `data-resource` | 对应的资源文件名 |
| `.design-view` | `data-view` | 视图方向（front/side/back） |
| 尺寸样式 | width/height | 设计图的像素尺寸 |

**输出目录：**

```
concepts/characters/
├── char_001_concept.html        # 角色1概念设计
├── char_002_concept.html        # 角色2概念设计
└── characters_concept_list.md    # 角色概念清单
```

### 第四步：设计角色立绘

为每个角色生成立绘HTML原型：

**角色立绘HTML结构：**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>角色立绘 - [角色名称]</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #1a1a1a;
            font-family: Arial, sans-serif;
            padding: 20px;
        }
        .portrait-container {
            display: flex;
            gap: 30px;
            flex-wrap: wrap;
            justify-content: center;
        }
        .portrait-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }
        .portrait-frame {
            position: relative;
            width: [立绘宽度]px;
            height: [立绘高度]px;
            border: 2px dashed #666;
            background: rgba(255,255,255,0.05);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #fff;
            text-align: center;
        }
        .emotion-label {
            color: #f0c040;
            font-size: 14px;
            margin-top: 8px;
        }
        .info-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: #fff;
            padding: 15px;
            border-radius: 8px;
            font-size: 13px;
            max-width: 250px;
        }
    </style>
</head>
<body>
    <!-- 信息面板 -->
    <div class="info-panel">
        <strong>[角色名称] - 立绘原型</strong><br>
        角色ID: char_[编号]<br>
        立绘尺寸: [宽]x[高]<br>
        表情数量: [数量]
    </div>

    <div class="portrait-container">
        <!-- 正常表情 -->
        <div class="portrait-item">
            <div class="portrait-frame" data-resource="char_[ID]_portrait_normal"
                 data-emotion="normal" style="width: 512px; height: 768px;">
                <div style="font-size: 16px; font-weight: bold;">正常表情</div>
                <div style="font-size: 12px; opacity: 0.8; margin-top: 8px;">
                    512x768px | 全身立绘
                </div>
            </div>
            <span class="emotion-label">normal - 正常</span>
        </div>

        <!-- 开心表情 -->
        <div class="portrait-item">
            <div class="portrait-frame" data-resource="char_[ID]_portrait_happy"
                 data-emotion="happy" style="width: 512px; height: 768px;">
                <div style="font-size: 16px; font-weight: bold;">开心表情</div>
                <div style="font-size: 12px; opacity: 0.8; margin-top: 8px;">
                    512x768px | 全身立绘
                </div>
            </div>
            <span class="emotion-label">happy - 开心</span>
        </div>

        <!-- 愤怒表情 -->
        <div class="portrait-item">
            <div class="portrait-frame" data-resource="char_[ID]_portrait_angry"
                 data-emotion="angry" style="width: 512px; height: 768px;">
                <div style="font-size: 16px; font-weight: bold;">愤怒表情</div>
                <div style="font-size: 12px; opacity: 0.8; margin-top: 8px;">
                    512x768px | 全身立绘
                </div>
            </div>
            <span class="emotion-label">angry - 愤怒</span>
        </div>

        <!-- 悲伤表情 -->
        <div class="portrait-item">
            <div class="portrait-frame" data-resource="char_[ID]_portrait_sad"
                 data-emotion="sad" style="width: 512px; height: 768px;">
                <div style="font-size: 16px; font-weight: bold;">悲伤表情</div>
                <div style="font-size: 12px; opacity: 0.8; margin-top: 8px;">
                    512x768px | 全身立绘
                </div>
            </div>
            <span class="emotion-label">sad - 悲伤</span>
        </div>
    </div>
</body>
</html>
```

**角色立绘HTML规范：**

| 元素 | 属性 | 说明 |
|------|------|------|
| `.portrait-frame` | `data-resource` | 对应的资源文件名 |
| `.portrait-frame` | `data-emotion` | 表情类型 |

**输出目录：**

```
concepts/characters/portraits/
├── char_001_portraits.html       # 角色1立绘原型
├── char_002_portraits.html       # 角色2立绘原型
└── portraits_list.md             # 立绘清单
```

### 第五步：设计角色精灵

为每个角色生成精灵图HTML原型：

**角色精灵HTML结构：**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>角色精灵 - [角色名称]</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #1a1a1a;
            font-family: Arial, sans-serif;
            padding: 20px;
        }
        .sprite-showcase {
            display: flex;
            gap: 40px;
            align-items: flex-start;
        }
        .sprite-preview {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .animation-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .animation-title {
            color: #f0c040;
            font-size: 14px;
            font-weight: bold;
        }
        .sprite-frame {
            position: relative;
            width: [角色宽度]px;
            height: [角色高度]px;
            border: 2px dashed #666;
            background: rgba(255,255,255,0.05);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #fff;
        }
        .sprite-sheet {
            position: relative;
            border: 2px dashed #666;
            background: rgba(255,255,255,0.05);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #fff;
        }
        .info-panel {
            background: rgba(0,0,0,0.8);
            color: #fff;
            padding: 20px;
            border-radius: 8px;
            font-size: 14px;
            min-width: 280px;
        }
        .info-panel h3 {
            margin-bottom: 15px;
            color: #f0c040;
        }
        .info-item {
            margin: 8px 0;
        }
        .info-item label {
            color: #888;
            margin-right: 8px;
        }
    </style>
</head>
<body>
    <div class="sprite-showcase">
        <!-- 精灵预览区域 -->
        <div class="sprite-preview">
            <!-- 待机动画 -->
            <div class="animation-group">
                <div class="animation-title">idle (待机) - 4帧循环</div>
                <!-- 单帧预览 -->
                <div style="display: flex; gap: 10px;">
                    <div class="sprite-frame" style="width: 64px; height: 64px;">
                        <div style="font-size: 11px;">帧1</div>
                    </div>
                    <div class="sprite-frame" style="width: 64px; height: 64px;">
                        <div style="font-size: 11px;">帧2</div>
                    </div>
                    <div class="sprite-frame" style="width: 64px; height: 64px;">
                        <div style="font-size: 11px;">帧3</div>
                    </div>
                    <div class="sprite-frame" style="width: 64px; height: 64px;">
                        <div style="font-size: 11px;">帧4</div>
                    </div>
                </div>
                <!-- 精灵图 -->
                <div class="sprite-sheet" data-resource="char_[ID]_idle"
                     data-animation="idle" data-frames="4"
                     style="width: 256px; height: 64px;">
                    <div style="font-size: 14px; font-weight: bold;">待机精灵图</div>
                    <div style="font-size: 12px; opacity: 0.8; margin-top: 8px;">
                        256x64px (4帧 x 64px) | [色调描述]
                    </div>
                </div>
            </div>

            <!-- 移动动画 -->
            <div class="animation-group">
                <div class="animation-title">walk (移动) - 8帧循环</div>
                <div class="sprite-sheet" data-resource="char_[ID]_walk"
                     data-animation="walk" data-frames="8"
                     style="width: 512px; height: 64px;">
                    <div style="font-size: 14px; font-weight: bold;">移动精灵图</div>
                    <div style="font-size: 12px; opacity: 0.8; margin-top: 8px;">
                        512x64px (8帧 x 64px) | [色调描述]
                    </div>
                </div>
            </div>

            <!-- 攻击动画 -->
            <div class="animation-group">
                <div class="animation-title">attack (攻击) - 6帧单次</div>
                <div class="sprite-sheet" data-resource="char_[ID]_attack"
                     data-animation="attack" data-frames="6"
                     style="width: 384px; height: 64px;">
                    <div style="font-size: 14px; font-weight: bold;">攻击精灵图</div>
                    <div style="font-size: 12px; opacity: 0.8; margin-top: 8px;">
                        384x64px (6帧 x 64px) | [色调描述]
                    </div>
                </div>
            </div>
        </div>

        <!-- 角色信息面板 -->
        <div class="info-panel">
            <h3>[角色名称] - 精灵原型</h3>
            <div class="info-item">
                <label>角色ID:</label> char_[编号]
            </div>
            <div class="info-item">
                <label>单帧尺寸:</label> [宽]x[高]
            </div>
            <div class="info-item">
                <label>朝向:</label> [四向/八向]
            </div>
            <hr style="margin: 15px 0; border-color: #333;">
            <div class="info-item">
                <label>动画清单:</label>
            </div>
            <ul style="margin-left: 20px; font-size: 13px;">
                <li>idle (待机) - 4帧 - 循环</li>
                <li>walk (移动) - 8帧 - 循环</li>
                <li>attack (攻击) - 6帧 - 单次</li>
                <li>hurt (受伤) - 3帧 - 单次</li>
                <li>die (死亡) - 6帧 - 单次</li>
            </ul>
        </div>
    </div>
</body>
</html>
```

**角色精灵HTML规范：**

| 元素 | 属性 | 说明 |
|------|------|------|
| `.sprite-sheet` | `data-resource` | 对应的资源文件名 |
| `.sprite-sheet` | `data-animation` | 动画类型 |
| `.sprite-sheet` | `data-frames` | 帧数 |
| 尺寸样式 | width/height | 精灵图总尺寸 |

**精灵图排列方式说明：**

```
精灵图帧排列（横向）：
┌──────┬──────┬──────┬──────┐
│ 帧1  │ 帧2  │ 帧3  │ 帧4  │
└──────┴──────┴──────┴──────┘
  64px   64px   64px   64px

总尺寸：256x64 (4帧 × 64px)
```

**输出目录：**

```
concepts/characters/sprites/
├── char_001_sprites.html         # 角色1精灵原型
├── char_002_sprites.html         # 角色2精灵原型
└── sprites_list.md              # 精灵清单
```

### 第六步：输出角色设计清单

生成 `concepts/characters/character_manifest.md`：

```markdown
# 角色设计清单

## 生成信息
- 生成时间：[时间]
- 艺术风格：[风格名称]
- 角色总数：[数量]

## 角色映射表

### 角色概念设计图
| 角色ID | HTML原型 | 对应资源文件 | 尺寸 | 视图 |
|--------|----------|--------------|------|------|
| char_001 | concepts/characters/char_001_concept.html | char_001_design_*.png | 256x256 | front/side/back |

### 角色立绘
| 角色ID | HTML原型 | 对应资源文件 | 尺寸 | 表情数 |
|--------|----------|--------------|------|--------|
| char_001 | concepts/characters/portraits/char_001_portraits.html | char_001_portrait_*.png | 512x768 | 4 |

### 角色精灵
| 角色ID | HTML原型 | 对应资源文件 | 单帧尺寸 | 动画数 |
|--------|----------|--------------|----------|--------|
| char_001 | concepts/characters/sprites/char_001_sprites.html | char_001_*.png | 64x64 | 5 |

## 使用说明

### 给美术资源生成师
1. 打开各HTML原型文件查看设计
2. 根据 `data-resource` 属性确定对应的输出文件名
3. 根据尺寸、颜色说明生成具体图片
4. 精灵图按帧数横向排列
```

## 输出文件清单

| 文件/目录 | 说明 |
|-----------|------|
| character_style.md | 角色艺术风格定义 |
| concepts/characters/ | 所有角色概念设计HTML |
| concepts/characters/portraits/ | 所有角色立绘HTML |
| concepts/characters/sprites/ | 所有角色精灵HTML |
| character_manifest.md | 角色设计清单 |

## HTML原型编写规范

**必备属性：**

| 属性 | 用途 | 示例值 |
|------|------|--------|
| `data-resource` | 指定输出文件名 | `"char_001_idle"` |
| `data-view` | 概念图视图方向 | `"front"`, `"side"`, `"back"` |
| `data-emotion` | 立绘表情类型 | `"normal"`, `"happy"`, `"angry"` |
| `data-animation` | 精灵动画类型 | `"idle"`, `"walk"`, `"attack"` |
| `data-frames` | 精灵帧数 | `"4"`, `"8"` |

**颜色标注规范：**

- 使用HEX颜色代码标注
- 标注主色、皮肤色、服装色、强调色
- 使用色块（color-swatch）直观展示

**尺寸标注规范：**

- 设计图：通常256x256或512x512
- 立绘：通常512x768或768x1024
- 精灵单帧：通常32x32、64x64、128x128
- 精灵图总宽度 = 单帧宽度 × 帧数

## 质量标准

| 检查项 | 标准 |
|--------|------|
| HTML有效性 | 可在浏览器中正常打开 |
| 信息完整 | 所有元素都有data-resource属性 |
| 尺寸准确 | 位置和尺寸数值精确 |
| 颜色明确 | 使用HEX或色块展示 |
| 说明清晰 | 每个元素都有文字说明 |
| 风格统一 | 所有原型遵循相同风格 |

## 注意事项

1. **与用户确认**：生成HTML原型前应与用户确认角色风格
2. **浏览器测试**：生成的HTML应在浏览器中测试显示
3. **表情完整性**：立绘应包含游戏需要的全部表情
4. **动画完整性**：精灵应包含游戏需要的全部动画
5. **帧数规范**：遵循动画帧数的最佳实践
6. **朝向处理**：说明角色是四向还是八向

## 与美术资源生成师的协作

```
角色设计师 → 输出角色HTML原型 → 美术资源生成师 → 生成角色图片资源
     ↑                                              ↓
     └────────── 反馈调整需求 ←──────────────────────────┘
```

**协作要点：**
- HTML原型的data-resource属性直接对应输出文件名
- 颜色和尺寸标注是生成资源的直接依据
- 精灵图按帧数横向排列的总尺寸需要计算
- 发现问题可在HTML中添加注释说明
