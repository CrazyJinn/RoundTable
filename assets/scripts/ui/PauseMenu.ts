/**
 * 暂停菜单
 * @brief 游戏暂停界面
 */

import { _decorator, Component, Node, Button, Label } from 'cc';
import { GameManager } from '../core/GameManager';
import { SceneManager, SceneNames } from '../core/SceneManager';
import { SaveManager } from '../core/SaveManager';
import { InputManager, InputAction } from '../core/InputManager';
import { GameState } from '../data/types';

const { ccclass, property } = _decorator;

/**
 * 暂停菜单组件
 */
@ccclass('PauseMenu')
export class PauseMenu extends Component {
    // === 面板引用 ===
    @property(Node)
    pausePanel: Node | null = null;

    // === 按钮引用 ===
    @property(Button)
    resumeButton: Button | null = null;

    @property(Button)
    saveButton: Button | null = null;

    @property(Button)
    loadButton: Button | null = null;

    @property(Button)
    settingsButton: Button | null = null;

    @property(Button)
    mainMenuButton: Button | null = null;

    // === 存档槽位 ===
    @property([Button])
    saveSlotButtons: Button[] = [];

    @property(Node)
    saveSlotPanel: Node | null = null;

    /** 是否显示 */
    private isVisible: boolean = false;

    protected onLoad(): void {
        this.initButtons();
        this.hide();

        // 注册暂停输入回调
        InputManager.instance.onAction(InputAction.Pause, this.togglePause, this);
    }

    protected onDestroy(): void {
        InputManager.instance.offAction(InputAction.Pause, this.togglePause, this);
    }

    /**
     * 初始化按钮
     */
    private initButtons(): void {
        this.resumeButton?.node.on(Button.EventType.CLICK, this.onResumeClick, this);
        this.saveButton?.node.on(Button.EventType.CLICK, this.onSaveClick, this);
        this.loadButton?.node.on(Button.EventType.CLICK, this.onLoadClick, this);
        this.settingsButton?.node.on(Button.EventType.CLICK, this.onSettingsClick, this);
        this.mainMenuButton?.node.on(Button.EventType.CLICK, this.onMainMenuClick, this);
    }

    /**
     * 切换暂停状态
     */
    private togglePause(): void {
        if (this.isVisible) {
            this.hide();
            GameManager.instance.resume();
        } else if (GameManager.instance.currentState === GameState.Playing) {
            GameManager.instance.pause();
            this.show();
        }
    }

    /**
     * 显示暂停菜单
     */
    show(): void {
        this.isVisible = true;
        if (this.pausePanel) {
            this.pausePanel.active = true;
        }
    }

    /**
     * 隐藏暂停菜单
     */
    hide(): void {
        this.isVisible = false;
        if (this.pausePanel) {
            this.pausePanel.active = false;
        }
        if (this.saveSlotPanel) {
            this.saveSlotPanel.active = false;
        }
    }

    // === 按钮回调 ===

    /**
     * 继续游戏
     */
    private onResumeClick(): void {
        this.hide();
        GameManager.instance.resume();
    }

    /**
     * 保存游戏
     */
    private onSaveClick(): void {
        this.showSaveSlots(true);
    }

    /**
     * 加载游戏
     */
    private onLoadClick(): void {
        this.showSaveSlots(false);
    }

    /**
     * 设置
     */
    private onSettingsClick(): void {
        // TODO: 打开设置面板
    }

    /**
     * 返回主菜单
     */
    private async onMainMenuClick(): Promise<void> {
        this.hide();

        // 自动存档
        const player = GameManager.instance.getCurrentPlayer();
        if (player) {
            SaveManager.instance.autoSave(player);
        }

        // 返回主菜单
        GameManager.instance.returnToMenu();
    }

    /**
     * 显示存档槽位
     * @param isSaving 是保存还是加载
     */
    private showSaveSlots(isSaving: boolean): void {
        if (this.saveSlotPanel) {
            this.saveSlotPanel.active = true;
        }

        // 更新槽位显示
        const slots = SaveManager.instance.getAllSaveSlots();

        this.saveSlotButtons.forEach((btn, index) => {
            if (index < slots.length) {
                const slot = slots[index];
                const label = btn.node.getComponentInChildren(Label);

                if (label) {
                    if (slot.exists) {
                        const date = new Date(slot.lastModified);
                        label.string = `存档 ${index + 1}\n${date.toLocaleString()}`;
                    } else {
                        label.string = `空存档 ${index + 1}`;
                    }
                }

                // 加载模式下，空存档不可点击
                if (!isSaving && !slot.exists) {
                    btn.interactable = false;
                } else {
                    btn.interactable = true;
                }

                // 绑定点击事件
                btn.node.off(Button.EventType.CLICK);
                btn.node.on(Button.EventType.CLICK, () => {
                    if (isSaving) {
                        this.saveToSlot(index);
                    } else {
                        this.loadFromSlot(index);
                    }
                }, this);
            }
        });
    }

    /**
     * 保存到槽位
     */
    private saveToSlot(slotIndex: number): void {
        const player = GameManager.instance.getCurrentPlayer();
        if (!player) return;

        const success = SaveManager.instance.saveGame(slotIndex, player);

        if (success) {
            console.log(`[PauseMenu] Game saved to slot ${slotIndex}`);
            // TODO: 显示保存成功提示
        }

        if (this.saveSlotPanel) {
            this.saveSlotPanel.active = false;
        }
    }

    /**
     * 从槽位加载
     */
    private async loadFromSlot(slotIndex: number): Promise<void> {
        const saveData = SaveManager.instance.loadGame(slotIndex);
        if (!saveData) return;

        this.hide();
        GameManager.instance.resume();

        // TODO: 应用存档数据到当前游戏

        console.log(`[PauseMenu] Game loaded from slot ${slotIndex}`);
    }
}
