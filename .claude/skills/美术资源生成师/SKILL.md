---
name: 美术资源生成师
description: 游戏开发流程中的美术资源生成角色，负责根据角色设计师和场景设计师输出的HTML原型图，解析其中的图片位置、颜色、尺寸和设计说明，使用图像生成工具生成Cocos 2D游戏所需的所有美术资源，包括场景背景图、角色设计图、角色立绘、角色精灵图、UI界面等。当角色和场景设计完成并输出HTML原型后，需要生成具体的美术资源文件时触发此技能。
---

# 美术资源生成师

## 概述

根据角色设计师和场景设计师提供的HTML原型图，解析其中的元素属性（data-resource、尺寸、颜色等），使用AI图像生成工具生成符合Cocos 2D游戏规范的美术资源文件。

## 输入

| 输入项 | 来源 | 说明 |
|--------|------|------|
| 角色HTML原型 | 角色设计师 | 角色概念/立绘/精灵的HTML原型 |
| 场景HTML原型 | 场景设计师 | 场景背景/UI的HTML原型 |
| 角色风格定义 | 角色设计师 | 角色艺术风格规范 |
| 场景UI风格定义 | 场景设计师 | 场景与UI艺术风格规范 |
| 游戏分辨率 | 剧本拆解师 | 目标分辨率和资源尺寸要求 |

## 工作流程

```
解析HTML原型 → 提取资源需求 → 生成场景背景 → 生成角色精灵 → 生成UI元素 → 整理打包 → 输出交付
```

### 第一步：解析HTML原型

**读取并分析HTML文件：**

| 操作 | 说明 |
|------|------|
| 读取HTML | 使用Read工具读取原型文件 |
| 解析属性 | 提取data-resource、尺寸、颜色等 |
| 列表整理 | 生成资源待生成清单 |

**HTML属性解析规范：**

| 属性 | 用途 | 示例 |
|------|------|------|
| `data-resource` | 输出文件名（不含扩展名） | `"bg_scene_001"` |
| `data-type` | 元素类型 | `"button"`, `"sprite"`, `"panel"` |
| `data-animation` | 动画类型 | `"idle"`, `"walk"` |
| `data-frames` | 动画帧数 | `"4"`, `"8"` |
| `data-states` | UI状态数 | `"4"` |
| `style: width/height` | 像素尺寸 | `"64px"`, `"200px"` |
| `background` | 颜色参考 | `"#3a5f3a"` |

**解析输出清单模板：**

```markdown
# 资源生成清单

## 从HTML解析结果

### 场景背景
| data-resource | 类型 | 尺寸 | 颜色参考 | 输出文件 |
|---------------|------|------|----------|----------|
| bg_scene_001 | background | 1920x1080 | #灰黄渐变 | bg_scene_001.png |

### 角色精灵
| data-resource | 动画类型 | 帧数 | 尺寸 | 色调 | 输出文件 |
|---------------|----------|------|------|------|----------|
| char_player_idle | idle | 4 | 64x64 | 棕灰 | char_player_idle.png |
| char_player_walk | walk | 8 | 64x64 | 棕灰 | char_player_walk.png |

### UI元素
| data-resource | 类型 | 状态数 | 尺寸 | 颜色 | 输出文件 |
|---------------|------|--------|------|------|----------|
| ui_btn_start | button | 4 | 200x60 | #2a3a4a | ui_btn_start_*.png |
```

### 第二步：生成场景背景

根据HTML原型中的背景元素生成图片：

**从HTML提取信息：**

```html
<!-- 示例HTML片段 -->
<div class="scene-container" style="width: 1920px; height: 1080px;
    background: linear-gradient(to bottom, #8b7355, #d4b896);">
    <div class="bg-element" data-resource="bg_ruins"
         style="left: 100px; top: 200px; width: 400px; height: 300px;
         background: rgba(139, 90, 43, 0.3);">
        <div>废弃城市废墟</div>
        <div>远景剪影 | 棕灰色调 | 400x300px</div>
    </div>
</div>
```

**提取参数：**
- 场景尺寸：1920x1080
- 天空渐变：#8b7355 → #d4b896
- 元素名称：废弃城市废墟
- 元素位置：100px, 200px
- 元素尺寸：400x300
- 颜色参考：棕灰色调

**生成prompt构建规则：**

```
根据HTML提取的信息构建图像生成prompt：

[场景描述词], [艺术风格关键词], [色调描述],
composition: [构图信息], size: [尺寸], --ar [宽高比]

示例：
Wasteland landscape, post-apocalyptic scene, abandoned city ruins silhouette,
muted brown-gray colors, atmospheric perspective, cinematic composition,
size: 1920x1080, --ar 16:9
```

**技术规范：**

| 字段 | 说明 |
|------|------|
| 文件命名 | 根据`data-resource`生成，如`bg_scene_001.png` |
| 尺寸 | 从HTML的`style: width/height`提取 |
| 格式 | PNG（支持透明） |
| 色深 | 8bit或更高 |

**输出文件：**

```
art_output/backgrounds/
├── bg_scene_001.png
├── bg_scene_002.png
└── backgrounds_info.txt
```

### 第三步：生成角色精灵

根据HTML原型中的角色元素生成精灵图：

**从HTML提取信息：**

```html
<!-- 示例HTML片段 -->
<div class="character-sprite" data-resource="char_player_idle"
     data-animation="idle" data-frames="4"
     style="width: 64px; height: 64px;
     background: rgba(139, 90, 43, 0.3);">
    <div>待机姿态</div>
    <div>64x64px | 棕灰色调</div>
</div>
```

**提取参数：**
- 资源名：char_player_idle
- 动画类型：idle（待机）
- 帧数：4
- 尺寸：64x64
- 色调：棕灰色调

**生成prompt构建规则：**

```
角色精灵prompt：

Character sprite, [角色描述], [动作描述],
facing: [朝向], style: [艺术风格],
palette: [色调方案], transparent background,
size: [尺寸], --ar [宽高比]

示例：
Game character sprite, male survivor warrior, idle pose,
facing front, pixel art style, brown-gray color palette,
transparent background, size: 64x64, --ar 1:1
```

**精灵资源结构：**

```
art_output/characters/
├── char_player/
│   ├── char_player_idle.png      # 待机动画帧（4帧横向排列）
│   ├── char_player_walk.png      # 移动动画帧（8帧横向排列）
│   ├── char_player_attack.png    # 攻击动画帧（6帧横向排列）
│   └── char_player_info.txt
└── characters_info.txt
```

**角色信息文件：**

```txt
角色ID: char_player
角色名称: [从HTML提取]
尺寸: [从HTML提取]

动画清单：
  idle - 待机 - [从data-frames提取]帧 - 循环
  walk - 移动 - [从data-frames提取]帧 - 循环
  attack - 攻击 - [从data-frames提取]帧 - 单次
```

**动画帧排列方式：**

```
精灵图帧排列（横向）：
┌──────┬──────┬──────┬──────┐
│ 帧1  │ 帧2  │ 帧3  │ 帧4  │  ← 单个动画的所有帧
└──────┴──────┴──────┴──────┘
  64px   64px   64px   64px

总尺寸：256x64 (4帧 x 64px)
```

### 第四步：生成UI元素

根据HTML原型中的UI元素生成UI图片：

**从HTML提取信息：**

```html
<!-- 示例HTML片段 -->
<div class="ui-element ui-button" data-resource="ui_btn_start"
     data-type="button" data-states="4"
     style="left: 50%; top: 60%; width: 200px; height: 60px;
     background: #2a3a4a; border: 2px solid #5a6a7a;">
    <div>START 按钮</div>
    <div>200x60px | #2a3a4a | 4状态</div>
</div>
```

**提取参数：**
- 资源名：ui_btn_start
- 类型：button
- 状态数：4（normal, hover, pressed, disabled）
- 尺寸：200x60
- 颜色：#2a3a4a
- 边框：#5a6a7a

**生成prompt构建规则：**

```
UI元素prompt：

UI [类型] design, [元素描述], [风格描述],
background color: #[hex], border color: #[hex],
state: [状态], transparent background,
game UI style, isolated, size: [尺寸]

示例（正常状态）：
UI button design, START button, dark background #2a3a4a,
metallic border #5a6a7a, normal state, post-apocalyptic style,
transparent background, isolated, size: 200x60, --ar 10:3

示例（悬停状态）：
UI button design, START button, lighter background #3a4a5a,
bright border #7a8a9a, hover state, post-apocalyptic style,
transparent background, isolated, size: 200x60, --ar 10:3
```

**UI状态生成对应表：**

| data-states | 需要生成的状态文件 |
|-------------|---------------------|
| 4 | _normal, _hover, _pressed, _disabled |
| 3 | _normal, _hover, _pressed |
| 2 | _normal, _selected |
| 1 | [无后缀] |

**UI资源结构：**

```
art_output/ui/
├── buttons/
│   ├── ui_btn_start_normal.png
│   ├── ui_btn_start_hover.png
│   ├── ui_btn_start_pressed.png
│   └── ui_btn_start_disabled.png
├── panels/
│   └── ui_panel_main.png
├── icons/
│   ├── ui_icon_health_normal.png
│   └── ui_icon_health_selected.png
└── ui_info.txt
```

### 第五步：资源验证与调整

**验证检查项：**

| 检查项 | 验证方法 |
|--------|----------|
| 文件命名 | 与`data-resource`一致 |
| 尺寸正确 | 与HTML中的width/height一致 |
| 颜色匹配 | 与HTML中的颜色参考一致 |
| 透明度 | PNG格式支持透明通道 |
| 格式正确 | PNG格式 |

**如需调整：**

1. 记录需要调整的资源
2. 修改生成prompt
3. 重新生成
4. 更新资源清单

### 第六步：整理打包输出

**输出目录结构：**

```
art_output/
├── backgrounds/           # 场景背景
│   ├── bg_scene_001.png
│   ├── bg_scene_002.png
│   └── backgrounds_info.txt
├── characters/            # 角色精灵
│   ├── char_player/
│   │   ├── char_player_idle.png
│   │   ├── char_player_walk.png
│   │   ├── char_player_attack.png
│   │   └── char_player_info.txt
│   └── characters_info.txt
├── ui/                    # UI元素
│   ├── buttons/
│   ├── panels/
│   ├── icons/
│   └── ui_info.txt
└── art_manifest.md        # 资源清单
```

### 第七步：输出资源清单

生成 `art_output/art_manifest.md`：

```markdown
# 美术资源清单

## 生成信息
- 生成时间：[时间]
- 艺术风格：[从art_style.md读取]
- 资源总数：[数量]

## HTML原型映射

### 场景背景
| HTML原型 | data-resource | 输出文件 | 尺寸 | 状态 |
|----------|--------------|----------|------|------|
| concepts/scenes/scene_001.html | bg_scene_001 | bg_scene_001.png | 1920x1080 | ✓已生成 |

### 角色精灵
| HTML原型 | data-resource | 输出文件 | 尺寸 | 帧数 | 状态 |
|----------|--------------|----------|------|------|------|
| concepts/characters/char_001.html | char_player_idle | char_player_idle.png | 64x64 | 4 | ✓已生成 |
| concepts/characters/char_001.html | char_player_walk | char_player_walk.png | 64x64 | 8 | ✓已生成 |

### UI元素
| HTML原型 | data-resource | 输出文件 | 尺寸 | 状态数 | 状态 |
|----------|--------------|----------|------|--------|------|
| concepts/ui/ui_001_main_menu.html | ui_btn_start | ui_btn_start_*.png | 200x60 | 4 | ✓已生成 |

## 技术规格
- 图像格式：PNG
- 透明通道：支持
- 色彩模式：RGBA
- 分辨率标准：[从HTML原型提取]

## 资源索引
完整文件列表：[所有生成的文件路径]
```

## 输出文件清单

| 文件/目录 | 说明 |
|-----------|------|
| art_output/backgrounds/ | 所有场景背景图 |
| art_output/characters/ | 所有角色精灵资源 |
| art_output/ui/ | 所有UI元素 |
| art_output/art_manifest.md | 完整的资源清单 |

## HTML解析规范

**必备属性提取：**

| 属性 | 提取用途 | 转换规则 |
|------|----------|----------|
| `data-resource` | 输出文件名 | 直接使用 + `.png` |
| `data-type` | 生成类型 | `sprite`→精灵图, `button`→按钮 |
| `data-animation` | 动画prompt | 映射到动作关键词 |
| `data-frames` | 精灵图帧数 | 确定横向排列帧数 |
| `data-states` | UI状态数量 | 生成对应数量的状态文件 |
| `style: width/height` | 图像尺寸 | 提取像素值 |

**颜色提取规则：**

| CSS语法 | 提取值 | 用途 |
|---------|--------|------|
| `#hex` | HEX颜色值 | 直接用于prompt |
| `rgb()` | RGB值 | 转换为HEX用于prompt |
| `rgba()` | RGBA值 | 提取RGB，透明度单独处理 |
| `linear-gradient` | 渐变色 | 提取主色调 |

**尺寸提取规则：**

| CSS语法 | 提取值 | 示例 |
|---------|--------|------|
| `64px` | 64 | 整数像素值 |
| `100%` | 父元素宽度 | 需要向上查找父元素 |
| `calc()` | 计算结果 | 需要计算 |

## 质量标准

| 检查项 | 标准 | 验证方法 |
|--------|------|----------|
| 文件命名 | 与`data-resource`一致 | 文件名匹配检查 |
| 尺寸准确 | 与HTML中尺寸一致 | 图片尺寸属性检查 |
| 格式正确 | PNG格式 | 文件扩展名检查 |
| 透明通道 | 背景透明 | 图片预览检查 |
| 颜色匹配 | 与HTML颜色参考一致 | 色彩对比 |
| 完整性 | 所有资源都已生成 | 清单对比检查 |

## 常用工具和API

**AI图像生成工具：**

| 工具 | 特点 | 推荐场景 |
|------|------|----------|
| 即梦 | 中文支持、本土化 | 角色精灵、UI元素 |
| Midjourney | 高质量、艺术性强 | 场景背景 |
| Stable Diffusion | 开源、可控性高 | 精细调整 |
| DALL-E | 易用、质量稳定 | 快速生成 |

**图像处理工具：**

| 工具 | 用途 | 常用命令 |
|------|------|----------|
| ImageMagick | 批量处理、格式转换 | `convert -resize` |
| TexturePacker | 精灵图集打包 | GUI操作 |
| Adobe PS | 精细调整 | 手动编辑 |

## 注意事项

1. **严格解析HTML**：按data-resource属性生成文件名，不可随意修改
2. **尺寸精确匹配**：生成的图片尺寸必须与HTML中标注的完全一致
3. **颜色参考**：使用HTML中的颜色值作为生成prompt的参考
4. **状态完整性**：UI元素按data-states生成完整的状态文件
5. **透明通道**：精灵图和UI元素必须保留透明通道
6. **2的幂次方**：资源尺寸优先使用2的幂次方（32、64、128、256、512、1024）
7. **文件组织**：按照标准目录结构组织输出文件

## 与角色设计师、场景设计师的协作

```
角色设计师 ────→ 输出角色HTML原型 ──┐
                                      │
场景设计师 ────→ 输出场景/UI HTML原型 ─┼──→ 美术资源生成师 → 生成图片资源
     ↑                                ↓
     └──────────── 反馈调整需求 ←──────────┘
```

**协作要点：**
- 严格按HTML的`data-resource`属性生成文件名
- 尺寸和颜色从HTML中精确提取
- 发现HTML信息不足时及时反馈
- 生成结果与HTML原型在浏览器中对比验证
- 保持与艺术风格定义的一致性

**HTML解析示例工作流：**

```
1. 读取HTML: concepts/scenes/scene_001.html
2. 查找元素: <div class="bg-element" data-resource="bg_ruins" ...>
3. 提取属性:
   - data-resource: "bg_ruins"
   - style width/height: "400px", "300px"
   - background: "rgba(139, 90, 43, 0.3)"
4. 构建prompt: [场景描述] + [颜色参考] + [尺寸]
5. 生成图片: art_output/backgrounds/bg_ruins.png (400x300)
6. 验证: 尺寸400x300, PNG格式, 透明通道
```
