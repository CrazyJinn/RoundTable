/**
 * 主菜单
 * @brief 游戏主菜单界面
 */

import { _decorator, Component, Node, Button, Label } from 'cc';
import { GameManager } from '../core/GameManager';
import { SceneManager, SceneNames } from '../core/SceneManager';
import { SaveManager } from '../core/SaveManager';
import { CharacterType, GameState } from '../data/types';

const { ccclass, property } = _decorator;

/**
 * 主菜单组件
 */
@ccclass('MainMenu')
export class MainMenu extends Component {
    // === 按钮引用 ===
    @property(Button)
    newGameButton: Button | null = null;

    @property(Button)
    continueButton: Button | null = null;

    @property(Button)
    settingsButton: Button | null = null;

    @property(Button)
    quitButton: Button | null = null;

    // === 面板引用 ===
    @property(Node)
    mainPanel: Node | null = null;

    @property(Node)
    characterSelectPanel: Node | null = null;

    @property(Node)
    settingsPanel: Node | null = null;

    // === 角色选择按钮 ===
    @property(Button)
    techCharacterButton: Button | null = null;

    @property(Button)
    magicCharacterButton: Button | null = null;

    @property(Button)
    backButton: Button | null = null;

    protected onLoad(): void {
        this.initButtons();
        this.checkContinueAvailable();
    }

    protected start(): void {
        GameManager.instance.changeState(GameState.Menu);
    }

    /**
     * 初始化按钮事件
     */
    private initButtons(): void {
        // 主菜单按钮
        this.newGameButton?.node.on(Button.EventType.CLICK, this.onNewGameClick, this);
        this.continueButton?.node.on(Button.EventType.CLICK, this.onContinueClick, this);
        this.settingsButton?.node.on(Button.EventType.CLICK, this.onSettingsClick, this);
        this.quitButton?.node.on(Button.EventType.CLICK, this.onQuitClick, this);

        // 角色选择按钮
        this.techCharacterButton?.node.on(Button.EventType.CLICK, () => this.selectCharacter(CharacterType.Tech), this);
        this.magicCharacterButton?.node.on(Button.EventType.CLICK, () => this.selectCharacter(CharacterType.Magic), this);
        this.backButton?.node.on(Button.EventType.CLICK, this.onBackClick, this);
    }

    /**
     * 检查是否有可继续的游戏
     */
    private checkContinueAvailable(): void {
        const hasSave = SaveManager.instance.hasAutoSave() ||
                        SaveManager.instance.getAllSaveSlots().some(slot => slot.exists);

        if (this.continueButton) {
            this.continueButton.interactable = hasSave;
        }
    }

    // === 按钮回调 ===

    /**
     * 新游戏按钮
     */
    private onNewGameClick(): void {
        this.showCharacterSelect();
    }

    /**
     * 继续游戏按钮
     */
    private async onContinueClick(): Promise<void> {
        // 尝试加载自动存档
        const autoSave = SaveManager.instance.loadAutoSave();
        if (autoSave) {
            await this.loadSaveAndStart(autoSave);
            return;
        }

        // 加载最近的存档
        const slots = SaveManager.instance.getAllSaveSlots();
        const latestSlot = slots
            .filter(s => s.exists)
            .sort((a, b) => b.lastModified - a.lastModified)[0];

        if (latestSlot) {
            const saveData = SaveManager.instance.loadGame(latestSlot.index);
            if (saveData) {
                await this.loadSaveAndStart(saveData);
            }
        }
    }

    /**
     * 设置按钮
     */
    private onSettingsClick(): void {
        this.showSettings();
    }

    /**
     * 退出游戏按钮
     */
    private onQuitClick(): void {
        // 在Web环境下可能无法退出
        console.log('[MainMenu] Quit game requested');
    }

    /**
     * 返回按钮
     */
    private onBackClick(): void {
        this.showMainPanel();
    }

    // === 角色选择 ===

    /**
     * 选择角色并开始游戏
     */
    private async selectCharacter(type: CharacterType): Promise<void> {
        console.log(`[MainMenu] Selected character: ${CharacterType[type]}`);

        // 初始化游戏
        GameManager.instance.init();
        GameManager.instance.startNewGame(type);

        // 加载游戏场景
        await SceneManager.instance.loadScene(SceneNames.GAME);
    }

    /**
     * 加载存档并开始游戏
     */
    private async loadSaveAndStart(saveData: any): Promise<void> {
        GameManager.instance.init();
        await SceneManager.instance.loadScene(SceneNames.GAME);
        // 存档数据将在游戏场景中应用
    }

    // === 面板切换 ===

    /**
     * 显示主面板
     */
    private showMainPanel(): void {
        if (this.mainPanel) this.mainPanel.active = true;
        if (this.characterSelectPanel) this.characterSelectPanel.active = false;
        if (this.settingsPanel) this.settingsPanel.active = false;
    }

    /**
     * 显示角色选择面板
     */
    private showCharacterSelect(): void {
        if (this.mainPanel) this.mainPanel.active = false;
        if (this.characterSelectPanel) this.characterSelectPanel.active = true;
        if (this.settingsPanel) this.settingsPanel.active = false;
    }

    /**
     * 显示设置面板
     */
    private showSettings(): void {
        if (this.mainPanel) this.mainPanel.active = false;
        if (this.characterSelectPanel) this.characterSelectPanel.active = false;
        if (this.settingsPanel) this.settingsPanel.active = true;
    }
}
