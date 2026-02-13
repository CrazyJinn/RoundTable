# 角色设计清单

## 生成信息
- **生成时间：** 2026-02-13
- **艺术风格：** 像素风废土角色
- **角色总数：** 14个（主角2个 + 普通怪物8个 + 精英怪物4个）

---

## 角色映射表

### 角色概念设计图

| 角色ID | HTML原型 | 对应资源文件 | 尺寸 | 视图 |
|--------|----------|--------------|------|------|
| char_player_tech | characters/char_player_tech_concept.html | char_player_tech_design_*.png | 256x256 | front/side/back |
| char_player_magic | characters/char_player_magic_concept.html | char_player_magic_design_*.png | 256x256 | front/side/back |
| char_enemy_rat | characters/char_enemy_rat_concept.html | char_enemy_rat_design_*.png | 128x128 | front/side/back |
| char_enemy_boar | characters/char_enemy_boar_concept.html | char_enemy_boar_design_*.png | 128x128 | front/side/back |
| char_enemy_crow | characters/char_enemy_crow_concept.html | char_enemy_crow_design_*.png | 128x128 | front/side/back |
| char_enemy_spider | characters/char_enemy_spider_concept.html | char_enemy_spider_design_*.png | 128x128 | front/side/back |
| char_enemy_bear | characters/char_enemy_bear_concept.html | char_enemy_bear_design_*.png | 256x256 | front/side/back |
| char_enemy_wolf | characters/char_enemy_wolf_concept.html | char_enemy_wolf_design_*.png | 256x256 | front/side/back |
| char_enemy_vine | characters/char_enemy_vine_concept.html | char_enemy_vine_design_*.png | 128x128 | front/side/attack |
| char_enemy_mushroom | characters/char_enemy_mushroom_concept.html | char_enemy_mushroom_design_*.png | 128x128 | front/side/explode |
| char_enemy_vampire | characters/char_enemy_vampire_concept.html | char_enemy_vampire_design_*.png | 128x128 | front/side/drain |
| char_enemy_acid | characters/char_enemy_acid_concept.html | char_enemy_acid_design_*.png | 128x128 | front/side/spray |
| char_enemy_treant | characters/char_enemy_treant_concept.html | char_enemy_treant_design_*.png | 256x256 | front/side/attack |
| char_enemy_flower | characters/char_enemy_flower_concept.html | char_enemy_flower_design_*.png | 256x256 | closed/open/devour |

### 角色立绘

| 角色ID | HTML原型 | 对应资源文件 | 尺寸 | 表情数 |
|--------|----------|--------------|------|--------|
| char_player_tech | portraits/char_player_tech_portraits.html | char_player_tech_portrait_*.png | 512x768 | 5 |
| char_player_magic | portraits/char_player_magic_portraits.html | char_player_magic_portrait_*.png | 512x768 | 5 |
| 所有怪物 | portraits/enemies_portraits.html | char_enemy_*_portrait.png | 256x384/512x768 | 1 |

### 角色精灵

| 角色ID | HTML原型 | 对应资源文件 | 单帧尺寸 | 动画数 |
|--------|----------|--------------|----------|--------|
| char_player_tech | sprites/char_player_tech_sprites.html | char_player_tech_*.png | 64x64 | 7+ |
| char_player_magic | sprites/char_player_magic_sprites.html | char_player_magic_*.png | 64x64 | 7+ |
| 所有怪物 | sprites/enemies_sprites.html | char_enemy_*_*.png | 32-96 | 4-6 |

---

## 使用说明

### 给美术资源生成师

1. **打开各HTML原型文件查看设计**
   - 使用浏览器打开HTML文件查看角色设计
   - 每个设计包含多个视图和详细说明

2. **根据 `data-resource` 属性确定对应的输出文件名**
   - HTML中的 `data-resource` 属性直接对应输出的PNG文件名
   - 例如：`data-resource="char_player_tech_idle"` 对应 `char_player_tech_idle.png`

3. **根据尺寸、颜色说明生成具体图片**
   - 遵循标注的像素尺寸
   - 使用指定的配色方案
   - 保持像素艺术风格

4. **精灵图按帧数横向排列**
   - 精灵图总宽度 = 单帧宽度 × 帧数
   - 所有帧横向排列在同一行
   - 帧与帧之间不要留空隙

---

## 文件目录结构

```
角色设计输出/
├── character_style.md              # 角色艺术风格定义
├── character_manifest.md           # 角色设计清单（本文件）
└── characters/
    ├── *_concept.html              # 角色概念设计HTML（14个）
    ├── portraits/
    │   ├── char_player_tech_portraits.html
    │   ├── char_player_magic_portraits.html
    │   └── enemies_portraits.html
    └── sprites/
        ├── char_player_tech_sprites.html
        ├── char_player_magic_sprites.html
        └── enemies_sprites.html
```

---

## 配色方案参考

### 科技派（骑士团）
- **主色：** #2C2C2C（深灰色）
- **副色：** #1A1A1A（黑色）
- **强调色：** #E8E8E8（白色）
- **标识色：** #8B0000（深红色）

### 魔法派（秘术协会）
- **主色：** #1A1A1A（黑色）
- **副色：** #9B30FF（紫色）
- **强调色：** #E066FF（亮紫色）
- **背景色：** #4B0082（深紫色）

### 怪物配色
- **辐射怪物：** #8B7355（灰褐色）
- **血肉色：** #CD5C5C（暗红色）
- **毒液色：** #32CD32（绿色）
- **骨白色：** #F5F5DC（米白色）
- **植物绿：** #228B22（森林绿）
- **酸液绿：** #32CD32（酸橙绿）

---

## 角色分类汇总

### 主角（2个）
1. **char_player_tech** - 科技主角（男，17岁，骑士团）
2. **char_player_magic** - 魔法主角（女，120岁，秘术协会）

### 普通怪物-动物类（4个）
3. **char_enemy_rat** - 辐射巨鼠（★☆☆☆☆）
4. **char_enemy_boar** - 钢鬃野猪（★★☆☆☆）
5. **char_enemy_crow** - 骨翼鸦（★★☆☆☆）
6. **char_enemy_spider** - 毒液蜘蛛（★★☆☆☆）

### 精英怪物-动物类（2个）
7. **char_enemy_bear** - 裂变熊（★★★★☆）
8. **char_enemy_wolf** - 双头狼（★★★☆☆）

### 普通怪物-植物类（4个）
9. **char_enemy_vine** - 藤蔓怪（★☆☆☆☆）
10. **char_enemy_mushroom** - 爆炸孢子菇（★★☆☆☆）
11. **char_enemy_vampire** - 吸血藤（★★☆☆☆）
12. **char_enemy_acid** - 酸液喷壶草（★★☆☆☆）

### 精英怪物-植物类（2个）
13. **char_enemy_treant** - 树人守卫（★★★★☆）
14. **char_enemy_flower** - 食人花（★★★☆☆）

---

**文档版本：** v1.0
**生成时间：** 2026-02-13
**维护者：** 角色设计师
