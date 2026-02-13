---
name: 场景设计师
description: 游戏开发流程中的场景和UI设计角色，负责根据剧本拆解师输出的场景清单和UI清单，生成场景概念和UI概念的HTML原型图，标明图片位置、颜色、尺寸和设计说明。当剧本拆解完成并确认场景/UI需求后，需要设计场景和UI时触发此技能。
---

# 场景设计师

## 概述

根据游戏需求，生成场景概念设计和UI概念设计的HTML原型图，通过HTML直观展示场景布局、背景元素、UI元素等，为美术资源生成师提供清晰的设计参考。

## 输入

| 输入项 | 来源 | 说明 |
|--------|------|------|
| 场景清单 | 剧本拆解师 | 包含每个场景的背景需求 |
| UI清单 | 剧本拆解师 | 包含每个UI元素的设计需求 |
| 游戏基本信息 | 剧本拆解师 | 艺术风格、分辨率等信息 |
| 参考素材 | 用户 | 用户提供的参考图片或描述 |

## 工作流程

```
接收需求 → 确定艺术风格 → 设计场景HTML原型 → 设计UI HTML原型 → 输出场景/UI原型包
```

### 第一步：接收需求分析

**确认关键信息：**

| 信息项 | 说明 |
|--------|------|
| 艺术风格 | 像素/手绘/扁平/卡通/写实等 |
| 分辨率标准 | 游戏目标分辨率 |
| 色彩方案 | 主色调和配色规范 |
| 场景数量 | 需要设计的场景总数 |
| UI数量 | 需要设计的UI元素总数 |
| 参考风格 | 用户提供的参考作品风格 |

### 第二步：确定场景艺术风格

**输出场景风格定义文件 `scene_ui_style.md`：**

```markdown
# 场景与UI风格定义

## 场景风格
- 风格名称：[如"像素风废土场景"]
- 风格类型：[像素/手绘/扁平/卡通/写实]
- 画面特点：[详细描述]

## 色彩方案
- 天空色：#[hex代码] - [颜色名称]
- 地面色：#[hex代码] - [颜色名称]
- 环境色：#[hex代码] - [颜色名称]
- 阴影色：#[hex代码] - [颜色名称]

## 设计规范
- 透视关系：[透视类型]
- 光照风格：[光照方式]
- 氛围营造：[氛围描述]

## UI风格
- UI风格：[扁平/立体/像素/手绘]
- 主色调：#[hex代码]
- 边框色：#[hex代码]
- 文字色：#[hex代码]
- 背景色：#[hex代码]

## 参考作品
- [参考作品1名称和描述]
- [参考作品2名称和描述]
```

### 第三步：设计场景HTML原型

为每个场景生成HTML原型图：

**场景HTML原型结构：**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>场景原型 - [场景名称]</title>
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
            background: #0a0a0a;
            font-family: Arial, sans-serif;
        }
        .scene-wrapper {
            display: flex;
            flex-direction: column;
            gap: 20px;
            align-items: center;
        }
        .scene-container {
            position: relative;
            width: [宽度]px;
            height: [高度]px;
            background: linear-gradient(to bottom, [天空色], [地平线色]);
            border: 2px solid #444;
            overflow: hidden;
        }

        /* 背景层 */
        .bg-layer {
            position: absolute;
            width: 100%;
            height: 100%;
        }

        /* 背景元素占位符 */
        .bg-element {
            position: absolute;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border: 2px dashed #666;
            background: rgba(255,255,255,0.1);
            color: #fff;
            font-size: 12px;
            text-align: center;
            padding: 8px;
        }

        /* 图层说明 */
        .layer-label {
            position: absolute;
            left: 10px;
            font-size: 11px;
            color: rgba(255,255,255,0.6);
            background: rgba(0,0,0,0.5);
            padding: 2px 6px;
            border-radius: 3px;
        }

        /* 远景层元素 */
        .layer-far .bg-element {
            background: rgba(100, 100, 120, 0.3);
            border-color: rgba(150, 150, 180, 0.5);
        }

        /* 中景层元素 */
        .layer-mid .bg-element {
            background: rgba(130, 110, 90, 0.4);
            border-color: rgba(180, 160, 140, 0.5);
        }

        /* 近景层元素 */
        .layer-near .bg-element {
            background: rgba(80, 90, 70, 0.5);
            border-color: rgba(130, 140, 120, 0.5);
        }

        /* 信息面板 */
        .info-panel {
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0,0,0,0.85);
            color: #fff;
            padding: 15px;
            border-radius: 8px;
            font-size: 13px;
            max-width: 300px;
            z-index: 100;
        }
        .info-panel h3 {
            color: #f0c040;
            margin-bottom: 10px;
        }
        .info-item {
            margin: 5px 0;
        }
        .info-item label {
            color: #888;
        }

        /* 层级列表 */
        .layer-list {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.85);
            color: #fff;
            padding: 12px;
            border-radius: 8px;
            font-size: 12px;
        }
        .layer-list h4 {
            color: #f0c040;
            margin-bottom: 8px;
            font-size: 13px;
        }
        .layer-item {
            margin: 4px 0;
            padding-left: 12px;
        }
        .layer-item.far { color: #9a9aba; }
        .layer-item.mid { color: #baaa9a; }
        .layer-item.near { color: #7a8a6a; }
    </style>
</head>
<body>
    <div class="scene-wrapper">
        <div class="scene-container" data-scene-id="scene_[编号]">
            <!-- 场景信息面板 -->
            <div class="info-panel">
                <h3>[场景名称] - 概念原型</h3>
                <div class="info-item"><label>场景ID:</label> scene_[编号]</div>
                <div class="info-item"><label>分辨率:</label> [宽]x[高]</div>
                <div class="info-item"><label>氛围:</label> [明亮/阴暗/紧张/温馨]</div>
                <div class="info-item"><label>主色调:</label> [色调描述]</div>
                <div class="info-item"><label>光照:</label> [光照描述]</div>
                <div class="info-item"><label>时间:</label> [白天/黄昏/夜晚]</div>
            </div>

            <!-- 图层列表 -->
            <div class="layer-list">
                <h4>场景图层</h4>
                <div class="layer-item far">□ 远景层 - 天空、远山</div>
                <div class="layer-item mid">□ 中景层 - 建筑、树木</div>
                <div class="layer-item near">□ 近景层 - 地面、道具</div>
            </div>

            <!-- 远景层 -->
            <div class="bg-layer layer-far" style="z-index: 1;">
                <span class="layer-label">远景层</span>

                <!-- 天空渐变由CSS实现 -->
                <div class="bg-element" data-resource="bg_[scene]_sky"
                     style="left: 0; top: 0; width: 1920px; height: 600px;
                     background: linear-gradient(to bottom, #6b8e9f, #c4a77d);">
                    <div>天空背景</div>
                    <div style="font-size:10px; opacity:0.7;">渐变 #6b8e9f → #c4a77d</div>
                </div>

                <div class="bg-element" data-resource="bg_[scene]_mountains"
                     style="left: 0; top: 400px; width: 1920px; height: 300px;">
                    <div>远山剪影</div>
                    <div style="font-size:10px; opacity:0.7;">蓝灰色 | 低透明度</div>
                </div>
            </div>

            <!-- 中景层 -->
            <div class="bg-layer layer-mid" style="z-index: 2;">
                <span class="layer-label">中景层</span>

                <div class="bg-element" data-resource="bg_[scene]_ruins"
                     style="left: 200px; top: 500px; width: 600px; height: 400px;">
                    <div>废弃建筑</div>
                    <div style="font-size:10px; opacity:0.7;">棕灰色 | 600x400px</div>
                </div>

                <div class="bg-element" data-resource="bg_[scene]_trees"
                     style="left: 900px; top: 550px; width: 200px; height: 350px;">
                    <div>枯树</div>
                    <div style="font-size:10px; opacity:0.7;">暗棕色 | 200x350px</div>
                </div>
            </div>

            <!-- 近景层 -->
            <div class="bg-layer layer-near" style="z-index: 3;">
                <span class="layer-label">近景层</span>

                <div class="bg-element" data-resource="bg_[scene]_ground"
                     style="left: 0; top: 800px; width: 1920px; height: 280px;">
                    <div>地面</div>
                    <div style="font-size:10px; opacity:0.7;">龟裂土地 | 土黄色</div>
                </div>

                <div class="bg-element" data-resource="bg_[scene]_debris"
                     style="left: 150px; top: 950px; width: 120px; height: 80px;">
                    <div>碎石 debris</div>
                    <div style="font-size:10px; opacity:0.7;">120x80px</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

**场景HTML规范：**

| 元素 | 属性 | 说明 |
|------|------|------|
| `.scene-container` | `data-scene-id` | 场景ID |
| `.bg-element` | `data-resource` | 对应的资源文件名 |
| `.bg-element` | 位置样式 | left/top/width/height的像素值 |
| `.layer-far/mid/near` | 图层分类 | 远景/中景/近景 |

**图层分类：**

| 图层 | z-index | 内容 | 颜色特征 |
|------|----------|------|----------|
| 远景层 | 1 | 天空、远山 | 偏冷色、低饱和度 |
| 中景层 | 2 | 建筑、树木 | 中性色 |
| 近景层 | 3 | 地面、道具 | 偏暖色、高对比 |

**输出目录：**

```
concepts/scenes/
├── scene_001_wasteland.html       # 废土荒原场景原型
├── scene_002_ruins_city.html      # 废墟城市场景原型
└── scenes_list.md                 # 场景原型清单
```

### 第四步：设计UI HTML原型

为UI界面和元素生成HTML原型：

**UI界面HTML原型结构：**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UI原型 - [界面名称]</title>
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
            background: #0a0a0a;
            font-family: Arial, sans-serif;
        }
        .ui-screen {
            position: relative;
            width: [屏幕宽度]px;
            height: [屏幕高度]px;
            background: [背景色];
            border: 2px solid #333;
            overflow: hidden;
        }
        .ui-element {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 2px dashed #555;
            color: #fff;
            font-size: 12px;
            text-align: center;
            padding: 8px;
        }

        /* UI类型样式 */
        .ui-button {
            border-radius: 8px;
            background: rgba(42, 58, 74, 0.8);
            border: 2px solid #5a6a7a;
        }
        .ui-panel {
            background: rgba(20, 30, 40, 0.9);
            border-radius: 4px;
            border: 1px solid #4a5a6a;
        }
        .ui-icon {
            border-radius: 50%;
            background: rgba(42, 58, 74, 0.8);
            border: 2px solid #5a6a7a;
        }
        .ui-bar {
            background: rgba(20, 30, 40, 0.9);
            border: 1px solid #4a5a6a;
        }
        .ui-text {
            background: transparent;
            border: none;
        }

        /* 信息面板 */
        .info-overlay {
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0,0,0,0.9);
            color: #fff;
            padding: 12px;
            border-radius: 6px;
            font-size: 12px;
            z-index: 100;
        }

        /* 元素标签 */
        .element-label {
            position: absolute;
            bottom: -20px;
            font-size: 10px;
            color: #888;
            white-space: nowrap;
        }
    </style>
</head>
<body>
    <div class="ui-screen">
        <!-- UI信息面板 -->
        <div class="info-overlay">
            <strong>[界面名称] - 概念原型</strong><br>
            UI ID: ui_[编号]<br>
            分辨率: [宽]x[高]<br>
            元素数量: [数量]
        </div>

        <!-- 顶部状态栏 -->
        <div class="ui-element ui-bar" data-resource="ui_bar_top"
             data-type="bar" style="left: 0; top: 0; width: 100%; height: 50px;">
            <div>顶部状态栏</div>
            <div style="font-size:10px;">全宽 x 50px | 半透明黑</div>
            <div class="element-label">ui_bar_top</div>
        </div>

        <!-- 生命值图标 -->
        <div class="ui-element ui-icon" data-resource="ui_icon_health"
             data-type="icon" data-states="2"
             style="left: 20px; top: 60px; width: 40px; height: 40px;">
            <div>HP</div>
            <div style="font-size:9px;">40x40 | 2状态</div>
            <div class="element-label">ui_icon_health</div>
        </div>

        <!-- 生命值条 -->
        <div class="ui-element ui-bar" data-resource="ui_bar_health"
             data-type="progress" data-states="3"
             style="left: 70px; top: 68px; width: 150px; height: 24px;">
            <div>生命值进度条</div>
            <div style="font-size:9px;">150x24 | 3状态(空/中/满)</div>
            <div class="element-label">ui_bar_health</div>
        </div>

        <!-- 主菜单按钮 -->
        <div class="ui-element ui-button" data-resource="ui_btn_start"
             data-type="button" data-states="4"
             style="left: 50%; top: 60%; transform: translate(-50%, -50%); width: 200px; height: 60px;">
            <div style="font-size: 16px; font-weight: bold;">START</div>
            <div style="font-size:10px;">200x60px | #2a3a4a | 4状态</div>
            <div class="element-label">ui_btn_start</div>
        </div>

        <!-- 选项按钮 -->
        <div class="ui-element ui-button" data-resource="ui_btn_options"
             data-type="button" data-states="4"
             style="left: 50%; top: 72%; transform: translate(-50%, -50%); width: 200px; height: 60px;">
            <div style="font-size: 16px; font-weight: bold;">OPTIONS</div>
            <div style="font-size:10px;">200x60px | #2a3a4a | 4状态</div>
            <div class="element-label">ui_btn_options</div>
        </div>

        <!-- 底部信息栏 -->
        <div class="ui-element ui-panel" data-resource="ui_panel_bottom"
             data-type="panel" style="left: 0; bottom: 0; width: 100%; height: 40px;">
            <div>底部信息栏</div>
            <div style="font-size:10px;">全宽 x 40px</div>
            <div class="element-label">ui_panel_bottom</div>
        </div>
    </div>
</body>
</html>
```

**UI元素HTML规范：**

| 元素 | 属性 | 说明 |
|------|------|------|
| `.ui-element` | `data-resource` | 对应的资源文件名 |
| `.ui-element` | `data-type` | 元素类型 |
| `.ui-element` | `data-states` | 需要的状态数 |
| 位置样式 | left/top/width/height | 精确的像素位置和尺寸 |

**UI类型与样式类：**

| 类型 | CSS类 | 用途 |
|------|--------|------|
| 按钮 | `ui-button` | 可点击的按钮 |
| 面板 | `ui-panel` | 容器面板 |
| 图标 | `ui-icon` | 小型图标 |
| 进度条 | `ui-bar` | 水平/垂直进度条 |
| 文字 | `ui-text` | 纯文字元素 |

**UI状态生成对应：**

| data-states | 需要生成的状态文件 | 说明 |
|-------------|---------------------|------|
| 4 | _normal, _hover, _pressed, _disabled | 按钮 |
| 3 | _empty, _half, _full | 进度条 |
| 2 | _normal, _selected | 图标/选项 |
| 1 | [无后缀] | 面板/装饰 |

**输出目录：**

```
concepts/ui/
├── ui_001_main_menu.html          # 主菜单UI原型
├── ui_002_hud.html                # 游戏内HUD原型
├── ui_elements/                    # 单独UI元素原型
│   ├── ui_btn_start.html
│   ├── ui_btn_options.html
│   ├── ui_icon_health.html
│   └── ui_bar_health.html
└── ui_list.md                     # UI原型清单
```

### 第五步：输出场景/UI设计清单

生成 `concepts/scene_ui_manifest.md`：

```markdown
# 场景与UI设计清单

## 生成信息
- 生成时间：[时间]
- 场景风格：[风格名称]
- UI风格：[风格名称]
- 场景总数：[数量]
- UI元素总数：[数量]

## 场景映射表

### 场景背景
| 场景ID | HTML原型 | 对应资源文件 | 尺寸 | 图层数 |
|--------|----------|--------------|------|--------|
| scene_001 | concepts/scenes/scene_001.html | bg_scene_001_*.png | 1920x1080 | 3层 |

### UI界面
| UI ID | HTML原型 | 对应资源文件 | 尺寸 | 元素数 |
|--------|----------|--------------|------|--------|
| ui_001 | concepts/ui/ui_001_main_menu.html | ui_main_menu.png | 1920x1080 | 5 |

### UI元素
| UI ID | HTML原型 | 对应资源文件 | 尺寸 | 状态数 |
|--------|----------|--------------|------|--------|
| ui_btn_start | concepts/ui/ui_elements/ui_btn_start.html | ui_btn_start_*.png | 200x60 | 4 |

## 使用说明

### 给美术资源生成师
1. 打开各HTML原型文件查看设计
2. 根据 `data-resource` 属性确定对应的输出文件名
3. 根据尺寸、颜色说明生成具体图片
4. 保持与原型中标注的色调一致
5. UI元素按data-states生成完整的状态文件
```

## 输出文件清单

| 文件/目录 | 说明 |
|-----------|------|
| scene_ui_style.md | 场景与UI风格定义 |
| concepts/scenes/ | 所有场景HTML原型 |
| concepts/ui/ | 所有UI HTML原型 |
| concepts/ui/ui_elements/ | 单独UI元素HTML原型 |
| scene_ui_manifest.md | 场景与UI设计清单 |

## HTML原型编写规范

**必备属性：**

| 属性 | 用途 | 示例值 |
|------|------|--------|
| `data-resource` | 指定输出文件名 | `"bg_scene_001_sky"` |
| `data-scene-id` | 场景ID | `"scene_001"` |
| `data-type` | 元素类型 | `"button"`, `"panel"`, `"icon"`, `"bar"` |
| `data-states` | UI状态数 | `"4"`, `"3"`, `"2"` |

**颜色标注规范：**

- 使用HEX颜色代码标注
- 支持CSS渐变语法
- 标注透明度（rgba）
- 按图层区分色调（远景冷色、近景暖色）

**尺寸标注规范：**

- 场景尺寸：通常与游戏分辨率一致（如1920x1080）
- UI尺寸：根据具体元素确定
- 所有尺寸使用像素（px）
- 说明2的幂次方要求

**场景图层规范：**

| 图层 | z-index | 内容特点 | 颜色处理 |
|------|----------|----------|----------|
| 远景层 | 1 | 天空、远山 | 冷色、低饱和度、低透明度 |
| 中景层 | 2 | 主要建筑、物体 | 中性色调、正常饱和度 |
| 近景层 | 3 | 地面、前景道具 | 暖色、高对比、清晰 |

## 质量标准

| 检查项 | 标准 |
|--------|------|
| HTML有效性 | 可在浏览器中正常打开 |
| 信息完整 | 所有元素都有data-resource属性 |
| 尺寸准确 | 位置和尺寸数值精确 |
| 颜色明确 | 使用HEX或rgba标注 |
| 图层清晰 | 场景图层分类明确 |
| 说明清晰 | 每个元素都有文字说明 |
| 风格统一 | 所有原型遵循相同风格 |

## 注意事项

1. **与用户确认**：生成HTML原型前应与用户确认场景和UI风格
2. **浏览器测试**：生成的HTML应在浏览器中测试显示
3. **场景图层**：按远景-中景-近景分层设计
4. **UI复用**：通用UI元素应考虑复用
5. **颜色氛围**：场景颜色要符合氛围需求
6. **交互状态**：UI元素要明确标注所需状态数

## 与美术资源生成师的协作

```
场景设计师 → 输出场景/UI HTML原型 → 美术资源生成师 → 生成场景/UI图片
     ↑                                                    ↓
     └────────── 反馈调整需求 ←──────────────────────────────┘
```

**协作要点：**
- HTML原型的data-resource属性直接对应输出文件名
- 场景按图层分别生成资源
- 颜色和尺寸标注是生成资源的直接依据
- UI按data-states生成对应数量的状态文件
- 发现问题可在HTML中添加注释说明
