import { _decorator, Component, Node } from 'cc';
import { DialogData, DialogLine, DialogSection } from '../data/DialogData';
const { ccclass, property } = _decorator;

/**
 * 对话管理器
 * 负责对话系统的核心逻辑
 */
@ccclass('DialogManager')
export class DialogManager extends Component {
    private static _instance: DialogManager;

    // 当前对话数据
    private _currentDialog: DialogData = null!;
    private _currentSection: DialogSection = null!;
    private _currentLineIndex: number = 0;

    // 对话状态
    private _isPlaying: boolean = false;
    private _isTyping: boolean = false;

    // 当前对话行
    private _currentLine: DialogLine = null!;

    // 回调
    private _onDialogStart: (() => void) | null = null;
    private _onDialogEnd: (() => void) | null = null;
    private _onLineComplete: ((line: DialogLine) => void) | null = null;

    public static get instance(): DialogManager {
        return DialogManager._instance;
    }

    public get isPlaying(): boolean {
        return this._isPlaying;
    }

    public get currentLine(): DialogLine {
        return this._currentLine;
    }

    onLoad() {
        if (DialogManager._instance) {
            this.node.destroy();
            return;
        }
        DialogManager._instance = this;
        console.log('[DialogManager] 初始化完成');
    }

    /**
     * 开始对话
     */
    public startDialog(
        dialogData: DialogData,
        sectionId: string,
        onStart?: () => void,
        onEnd?: () => void,
        onLineComplete?: (line: DialogLine) => void
    ) {
        if (this._isPlaying) {
            console.warn('[DialogManager] 对话正在进行中，无法开始新对话');
            return;
        }

        this._currentDialog = dialogData;
        this._currentSection = dialogData.sections[sectionId];

        if (!this._currentSection) {
            console.error(`[DialogManager] 找不到对话段: ${sectionId}`);
            return;
        }

        this._currentLineIndex = 0;
        this._isPlaying = true;
        this._onDialogStart = onStart || null;
        this._onDialogEnd = onEnd || null;
        this._onLineComplete = onLineComplete || null;

        console.log(`[DialogManager] 开始对话: ${dialogData.id}/${sectionId}`);

        if (this._onDialogStart) {
            this._onDialogStart();
        }

        this.showCurrentLine();
    }

    /**
     * 显示当前对话行
     */
    private showCurrentLine() {
        if (!this._isPlaying || !this._currentSection) return;

        this._currentLine = this._currentSection.lines[this._currentLineIndex];

        console.log(`[DialogManager] 显示对话: ${this._currentLine.speakerId} - ${this._currentLine.text}`);

        // 触发对话行事件
        this.node.emit('dialog-line', this._currentLine);

        // 如果有事件触发
        if (this._currentLine.event) {
            this.node.emit(this._currentLine.event);
        }
    }

    /**
     * 跳到下一句对话
     */
    public nextLine() {
        if (!this._isPlaying) return;

        // 如果正在打字，先完成打字
        if (this._isTyping) {
            this.completeTyping();
            return;
        }

        // 当前行完成回调
        if (this._onLineComplete) {
            this._onLineComplete(this._currentLine);
        }

        // 检查是否有选项
        if (this._currentLine.options && this._currentLine.options.length > 0) {
            // 显示选项，等待玩家选择
            this.node.emit('dialog-options', this._currentLine.options);
            return;
        }

        // 检查是否有跳转
        if (this._currentLine.nextDialogId) {
            this.jumpToDialog(this._currentLine.nextDialogId);
            return;
        }

        // 下一句
        this._currentLineIndex++;

        // 检查是否结束
        if (this._currentLineIndex >= this._currentSection.lines.length) {
            this.endDialog();
        } else {
            this.showCurrentLine();
        }
    }

    /**
     * 跳转到指定对话段
     */
    public jumpToDialog(sectionId: string) {
        const section = this._currentDialog.sections[sectionId];
        if (!section) {
            console.error(`[DialogManager] 找不到对话段: ${sectionId}`);
            this.endDialog();
            return;
        }

        this._currentSection = section;
        this._currentLineIndex = 0;
        this.showCurrentLine();
    }

    /**
     * 选择对话选项
     */
    public selectOption(optionIndex: number) {
        if (!this._currentLine.options || optionIndex >= this._currentLine.options.length) {
            console.error('[DialogManager] 无效的选项索引');
            return;
        }

        const option = this._currentLine.options[optionIndex];

        // 执行选项动作
        if (option.action) {
            this.node.emit(option.action);
        }

        // 跳转到指定对话
        if (option.nextDialogId) {
            this.jumpToDialog(option.nextDialogId);
        } else {
            this.nextLine();
        }
    }

    /**
     * 完成打字效果
     */
    public completeTyping() {
        if (!this._isTyping) return;

        this._isTyping = false;
        this.node.emit('dialog-typing-complete');
    }

    /**
     * 结束对话
     */
    public endDialog() {
        console.log('[DialogManager] 对话结束');

        this._isPlaying = false;
        this._currentDialog = null!;
        this._currentSection = null!;
        this._currentLine = null!;
        this._currentLineIndex = 0;

        if (this._onDialogEnd) {
            this._onDialogEnd();
            this._onDialogEnd = null;
        }

        this.node.emit('dialog-end');
    }

    /**
     * 跳过对话
     */
    public skipDialog() {
        if (!this._isPlaying) return;

        this._isPlaying = false;
        this.node.emit('dialog-skipped');

        if (this._onDialogEnd) {
            this._onDialogEnd();
        }

        this.endDialog();
    }

    /**
     * 设置打字状态
     */
    public setTypingState(isTyping: boolean) {
        this._isTyping = isTyping;
    }

    /**
     * 注册事件监听
     */
    public on(event: string, callback: Function) {
        this.node.on(event, callback);
    }

    /**
     * 移除事件监听
     */
    public off(event: string, callback: Function) {
        this.node.off(event, callback);
    }
}
