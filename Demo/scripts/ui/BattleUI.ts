import { _decorator, Component, Node, Label, ProgressBar, Sprite } from 'cc';
import { Character } from '../components/Character';
import { CharacterType } from '../data/CombatData';
const { ccclass, property } = _decorator;

/**
 * 战斗UI组件
 * 显示血条、魔法值、技能冷却等
 */
@ccclass('BattleUI')
export class BattleUI extends Component {
    // 玩家状态
    @property(ProgressBar)
    playerHealthBar: ProgressBar = null!;

    @property(ProgressBar)
    playerManaBar: ProgressBar = null!;

    @property(Label)
    playerHealthLabel: Label = null!;

    @property(Label)
    playerManaLabel: Label = null!;

    // 敌人状态（简单版，只显示一个敌人的状态）
    @property(Node)
    enemyStatusPanel: Node = null!;

    @property(ProgressBar)
    enemyHealthBar: ProgressBar = null!;

    @property(Label)
    enemyNameLabel: Label = null!;

    // 技能图标
    @property(Node)
    skillBar: Node = null!;

    @property(Sprite)
    skillIcon1: Sprite = null!;

    @property(Sprite)
    skillIcon2: Sprite = null!;

    @property(Sprite)
    ultimateIcon: Sprite = null!;

    // 冷却遮罩
    @property(Node)
    cooldownMask1: Node = null!;

    @property(Node)
    cooldownMask2: Node = null!;

    @property(Node)
    cooldownMaskUlt: Node = null!;

    @property(Label)
    cooldownLabel1: Label = null!;

    @property(Label)
    cooldownLabel2: Label = null!;

    @property(Label)
    cooldownLabelUlt: Label = null!;

    // 引用
    private _player: Character | null = null;

    onLoad() {
        console.log('[BattleUI] 初始化');

        // 隐藏战斗UI
        this.node.active = false;

        // 注册事件监听
        this.registerEvents();
    }

    /**
     * 注册事件监听
     */
    private registerEvents() {
        // 监听角色受伤事件
        this.node.on('character-damaged', this.onCharacterDamaged, this);
        this.node.on('character-healed', this.onCharacterHealed, this);
    }

    /**
     * 设置玩家引用
     */
    public setPlayer(player: Character) {
        this._player = player;
        this.updatePlayerUI();
    }

    /**
     * 更新玩家UI
     */
    private updatePlayerUI() {
        if (!this._player) return;

        const stats = this._player.stats;

        // 更新血条
        if (this.playerHealthBar) {
            const healthPercent = stats.health / stats.maxHealth;
            this.playerHealthBar.progress = healthPercent;
        }

        // 更新魔法条
        if (this.playerManaBar) {
            const manaPercent = stats.mana / stats.maxMana;
            this.playerManaBar.progress = manaPercent;
        }

        // 更新血量文字
        if (this.playerHealthLabel) {
            this.playerHealthLabel.string = `${stats.health}/${stats.maxHealth}`;
        }

        // 更新魔法文字
        if (this.playerManaLabel) {
            this.playerManaLabel.string = `${stats.mana}/${stats.maxMana}`;
        }
    }

    /**
     * 更新敌人UI
     */
    public updateEnemyUI(enemy: Character) {
        if (!this.enemyStatusPanel) return;

        const stats = enemy.stats;

        // 显示敌人面板
        this.enemyStatusPanel.active = true;

        // 更新名字
        if (this.enemyNameLabel) {
            this.enemyNameLabel.string = enemy.name;
        }

        // 更新血条
        if (this.enemyHealthBar) {
            const healthPercent = stats.health / stats.maxHealth;
            this.enemyHealthBar.progress = healthPercent;
        }
    }

    /**
     * 隐藏敌人UI
     */
    public hideEnemyUI() {
        if (this.enemyStatusPanel) {
            this.enemyStatusPanel.active = false;
        }
    }

    /**
     * 角色受伤回调
     */
    private onCharacterDamaged(event: any) {
        if (event.id === this._player?.id) {
            this.updatePlayerUI();
        } else {
            // 更新敌人UI
            // 这里需要找到对应的敌人组件
        }
    }

    /**
     * 角色治疗回调
     */
    private onCharacterHealed(event: any) {
        if (event.id === this._player?.id) {
            this.updatePlayerUI();
        }
    }

    /**
     * 设置技能冷却
     */
    public setSkillCooldown(skillSlot: number, currentTime: number, maxTime: number) {
        let mask: Node | null = null;
        let label: Label | null = null;

        switch (skillSlot) {
            case 1:
                mask = this.cooldownMask1;
                label = this.cooldownLabel1;
                break;
            case 2:
                mask = this.cooldownMask2;
                label = this.cooldownLabel2;
                break;
            case 3:
                mask = this.cooldownMaskUlt;
                label = this.cooldownLabelUlt;
                break;
        }

        if (!mask) return;

        const remaining = Math.max(0, maxTime - currentTime);
        const progress = remaining / maxTime;

        // 更新遮罩
        if (mask.getComponent UITransform) {
            const transform = mask.getComponent(UITransform)!;
            transform.setContentSize(transform.width, transform.height * progress);
        }

        // 更新文字
        if (label) {
            if (remaining > 0) {
                label.string = Math.ceil(remaining).toString();
            } else {
                label.string = '';
            }
        }
    }

    /**
     * 显示战斗UI
     */
    public show() {
        this.node.active = true;
    }

    /**
     * 隐藏战斗UI
     */
    public hide() {
        this.node.active = false;
    }

    update(deltaTime: number) {
        // 每帧更新玩家UI（平滑效果）
        if (this._player && this.node.active) {
            this.updatePlayerUI();
        }
    }

    onDestroy() {
        // 清理事件监听
        this.node.off('character-damaged', this.onCharacterDamaged, this);
        this.node.off('character-healed', this.onCharacterHealed, this);
    }
}
