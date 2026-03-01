/**
 * 游戏HUD
 * @brief 游戏内界面显示
 */

import { _decorator, Component, Node, Label, ProgressBar, UIOpacity, tween, Vec3 } from 'cc';
import { Player, PlayerState } from '../entities/Player';
import { GameManager } from '../core/GameManager';
import { EconomySystem } from '../systems/EconomySystem';
import { CharacterType, GameEventType } from '../data/types';
import { EventManager } from '../data/EventManager';

const { ccclass, property } = _decorator;

/**
 * 游戏HUD组件
 * 显示玩家状态、技能、货币等信息
 */
@ccclass('GameHUD')
export class GameHUD extends Component {
    // === HP/MP 条 ===
    @property(ProgressBar)
    hpBar: ProgressBar | null = null;

    @property(ProgressBar)
    mpBar: ProgressBar | null = null;

    @property(Label)
    hpLabel: Label | null = null;

    @property(Label)
    mpLabel: Label | null = null;

    // === 技能图标 ===
    @property(Node)
    skill1Node: Node | null = null;

    @property(Node)
    skill2Node: Node | null = null;

    @property(Node)
    ultimateNode: Node | null = null;

    @property(Label)
    skill1CooldownLabel: Label | null = null;

    @property(Label)
    skill2CooldownLabel: Label | null = null;

    @property(Label)
    ultimateCooldownLabel: Label | null = null;

    // === 弹药/冥想 ===
    @property(Node)
    ammoNode: Node | null = null;

    @property(Label)
    ammoLabel: Label | null = null;

    @property(Node)
    meditateNode: Node | null = null;

    // === 货币 ===
    @property(Label)
    currencyLabel: Label | null = null;

    // === 交互提示 ===
    @property(Node)
    interactPrompt: Node | null = null;

    @property(Label)
    interactLabel: Label | null = null;

    // === 状态效果 ===
    @property(Node)
    statusEffectsContainer: Node | null = null;

    /** 玩家引用 */
    private player: Player | null = null;

    /** 更新间隔计时器 */
    private updateTimer: number = 0;

    protected onLoad(): void {
        // 注册事件
        EventManager.instance.on(GameEventType.CurrencyChanged, this.onCurrencyChanged.bind(this));
    }

    protected onDestroy(): void {
        EventManager.instance.off(GameEventType.CurrencyChanged, this.onCurrencyChanged.bind(this));
    }

    protected start(): void {
        // 获取玩家引用
        this.player = GameManager.instance.getCurrentPlayer();

        // 初始化UI
        this.initUI();
    }

    /**
     * 初始化UI
     */
    private initUI(): void {
        if (!this.player) return;

        // 根据角色类型显示/隐藏UI元素
        const isTech = this.player.characterType === CharacterType.Tech;

        if (this.ammoNode) this.ammoNode.active = isTech;
        if (this.mpBar) this.mpBar.node.active = !isTech;
        if (this.meditateNode) this.meditateNode.active = !isTech;

        // 更新货币
        this.updateCurrency();
    }

    protected update(dt: number): void {
        this.updateTimer += dt;

        // 限制更新频率
        if (this.updateTimer < 0.05) return;
        this.updateTimer = 0;

        this.player = GameManager.instance.getCurrentPlayer();
        if (!this.player) return;

        this.updateHPMP();
        this.updateSkills();
        this.updateAmmoOrMeditate();
    }

    /**
     * 更新HP/MP显示
     */
    private updateHPMP(): void {
        if (!this.player) return;

        // HP
        if (this.hpBar) {
            this.hpBar.progress = this.player.healthPercent;
        }
        if (this.hpLabel) {
            this.hpLabel.string = `${Math.ceil(this.player.stats.currentHp)}/${this.player.stats.maxHp}`;
        }

        // MP (魔法主角)
        if (this.player.characterType === CharacterType.Magic && this.mpBar) {
            this.mpBar.progress = this.player.mpPercent;
        }
        if (this.mpLabel && this.player.characterType === CharacterType.Magic) {
            const stats = this.player.stats as any;
            if (stats.maxMp && stats.currentMp !== undefined) {
                this.mpLabel.string = `${Math.ceil(stats.currentMp)}/${stats.maxMp}`;
            }
        }
    }

    /**
     * 更新技能显示
     */
    private updateSkills(): void {
        if (!this.player) return;

        // 技能1
        const skill1 = this.player.getSkill('skill_1');
        if (skill1 && this.skill1CooldownLabel) {
            if (skill1.isReady) {
                this.skill1CooldownLabel.string = '';
                this.setNodeGray(this.skill1Node, false);
            } else {
                this.skill1CooldownLabel.string = Math.ceil(skill1.currentCooldown).toString();
                this.setNodeGray(this.skill1Node, true);
            }
        }

        // 技能2
        const skill2 = this.player.getSkill('skill_2');
        if (skill2 && this.skill2CooldownLabel) {
            if (skill2.isReady) {
                this.skill2CooldownLabel.string = '';
                this.setNodeGray(this.skill2Node, false);
            } else {
                this.skill2CooldownLabel.string = Math.ceil(skill2.currentCooldown).toString();
                this.setNodeGray(this.skill2Node, true);
            }
        }

        // 终极技能
        const ultimate = this.player.getSkill('ultimate');
        if (ultimate && this.ultimateCooldownLabel) {
            if (ultimate.isReady) {
                this.ultimateCooldownLabel.string = '';
                this.setNodeGray(this.ultimateNode, false);
            } else {
                this.ultimateCooldownLabel.string = Math.ceil(ultimate.currentCooldown).toString();
                this.setNodeGray(this.ultimateNode, true);
            }
        }
    }

    /**
     * 更新弹药/冥想显示
     */
    private updateAmmoOrMeditate(): void {
        if (!this.player) return;

        if (this.player.characterType === CharacterType.Tech) {
            // 弹药显示
            if (this.ammoLabel) {
                this.ammoLabel.string = `${(this.player as any).currentAmmo || 0}/${(this.player as any).maxAmmo || 30}`;
            }
        }
    }

    /**
     * 更新货币
     */
    private updateCurrency(): void {
        if (this.currencyLabel) {
            this.currencyLabel.string = EconomySystem.instance.getCurrency().toString();
        }
    }

    /**
     * 货币变化回调
     */
    private onCurrencyChanged(data: any): void {
        this.updateCurrency();

        // 播放动画效果
        if (this.currencyLabel) {
            tween(this.currencyLabel.node)
                .to(0.1, { scale: new Vec3(1.2, 1.2, 1) })
                .to(0.1, { scale: new Vec3(1, 1, 1) })
                .start();
        }
    }

    /**
     * 显示交互提示
     */
    showInteractPrompt(text: string): void {
        if (this.interactPrompt) {
            this.interactPrompt.active = true;
        }
        if (this.interactLabel) {
            this.interactLabel.string = text;
        }
    }

    /**
     * 隐藏交互提示
     */
    hideInteractPrompt(): void {
        if (this.interactPrompt) {
            this.interactPrompt.active = false;
        }
    }

    /**
     * 设置节点灰度
     */
    private setNodeGray(node: Node | null, gray: boolean): void {
        if (!node) return;

        const opacity = node.getComponent(UIOpacity);
        if (opacity) {
            opacity.opacity = gray ? 128 : 255;
        }
    }
}
