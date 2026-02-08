import { _decorator, Component, Node, Label, RichText, Sprite, UITransform, Vec3, Color } from 'cc';
import { DialogManager } from '../core/DialogManager';
import { DialogLine, DialogOption } from '../data/DialogData';
const { ccclass, property } = _decorator;

/**
 * 对话UI组件
 * 显示对话内容、角色名称、选项等
 */
@ccclass('DialogUI')
export class DialogUI extends Component {
    // UI元素
    @property(Node)
    dialogPanel: Node = null!;

    @property(Label)
    speakerNameLabel: Label = null!;

    @property(RichText)
    dialogText: RichText = null!;

    @property(Node)
    optionsContainer: Node = null!;

    @property(Node)
    optionButtonPrefab: Node = null!;

    @property(Node)
    continueHint: Node = null!;

    @property(Sprite)
    speakerAvatar: Sprite = null!;

    // 打字效果
    private _typewriterSpeed: number = 30; // 每秒字符数
    private _currentText: string = '';
    private _displayedText: string = '';
    private _typewriterTimer: number = 0;
    private _isTyping: boolean = false;

    // 当前对话行
    private _currentLine: DialogLine | null = null;

    onLoad() {
        console.log('[DialogUI] 初始化');

        // 隐藏对话面板
        if (this.dialogPanel) {
            this.dialogPanel.active = false;
        }

        // 注册事件监听
        this.registerEvents();
    }

    /**
     * 注册事件监听
     */
    private registerEvents() {
        const dialogManager = DialogManager.instance;
        if (!dialogManager) return;

        dialogManager.on('dialog-line', this.onDialogLine, this);
        dialogManager.on('dialog-options', this.onDialogOptions, this);
        dialogManager.on('dialog-typing-complete', this.onTypingComplete, this);
        dialogManager.on('dialog-end', this.onDialogEnd, this);

        // 监听点击继续
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    /**
     * 移除事件监听
     */
    private unregisterEvents() {
        const dialogManager = DialogManager.instance;
        if (!dialogManager) return;

        dialogManager.off('dialog-line', this.onDialogLine, this);
        dialogManager.off('dialog-options', this.onDialogOptions, this);
        dialogManager.off('dialog-typing-complete', this.onTypingComplete, this);
        dialogManager.off('dialog-end', this.onDialogEnd, this);

        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    /**
     * 显示对话行
     */
    private onDialogLine(line: DialogLine) {
        this._currentLine = line;

        // 显示对话面板
        if (this.dialogPanel) {
            this.dialogPanel.active = true;
        }

        // 设置说话者名称
        if (this.speakerNameLabel) {
            this.speakerNameLabel.string = line.speakerId;
        }

        // 开始打字效果
        this.startTypewriter(line.text);

        // 隐藏选项和继续提示
        if (this.optionsContainer) {
            this.optionsContainer.active = false;
        }
        if (this.continueHint) {
            this.continueHint.active = false;
        }
    }

    /**
     * 开始打字效果
     */
    private startTypewriter(text: string) {
        this._currentText = text;
        this._displayedText = '';
        this._typewriterTimer = 0;
        this._isTyping = true;

        if (this.dialogText) {
            this.dialogText.string = '';
        }

        DialogManager.instance?.setTypingState(true);
    }

    /**
     * 更新打字效果
     */
    private updateTypewriter(deltaTime: number) {
        if (!this._isTyping) return;

        this._typewriterTimer += deltaTime;
        const charsToShow = Math.floor(this._typewriterTimer * this._typewriterSpeed);

        if (charsToShow >= this._currentText.length) {
            // 打字完成
            this._displayedText = this._currentText;
            this._isTyping = false;

            if (this.dialogText) {
                this.dialogText.string = this._displayedText;
            }

            DialogManager.instance?.setTypingState(false);

            // 显示继续提示或选项
            this.onTypewriterComplete();
        } else {
            // 更新显示文本
            this._displayedText = this._currentText.substring(0, charsToShow);

            if (this.dialogText) {
                this.dialogText.string = this._displayedText;
            }
        }
    }

    /**
     * 打字完成
     */
    private onTypewriterComplete() {
        // 如果有选项，显示选项
        if (this._currentLine?.options && this._currentLine.options.length > 0) {
            // 选项会在onDialogOptions回调中显示
            return;
        }

        // 否则显示继续提示
        if (this.continueHint) {
            this.continueHint.active = true;
        }
    }

    /**
     * 显示对话选项
     */
    private onDialogOptions(options: DialogOption[]) {
        if (!this.optionsContainer || !this.optionButtonPrefab) return;

        // 清空现有选项
        this.optionsContainer.removeAllChildren();

        // 创建选项按钮
        options.forEach((option, index) => {
            const buttonNode = instantiate(this.optionButtonPrefab);
            buttonNode.setParent(this.optionsContainer);

            const label = buttonNode.getComponent(Label);
            if (label) {
                label.string = option.text;
            }

            // 注册点击事件
            buttonNode.on(Node.EventType.TOUCH_END, () => {
                this.onOptionSelected(index);
            }, this);
        });

        this.optionsContainer.active = true;
    }

    /**
     * 选择选项
     */
    private onOptionSelected(index: number) {
        DialogManager.instance?.selectOption(index);
    }

    /**
     * 触摸结束（点击继续）
     */
    private onTouchEnd() {
        const dialogManager = DialogManager.instance;
        if (!dialogManager || !dialogManager.isPlaying) return;

        // 如果正在打字，完成打字
        if (this._isTyping) {
            this._displayedText = this._currentText;
            this._isTyping = false;

            if (this.dialogText) {
                this.dialogText.string = this._displayedText;
            }

            DialogManager.instance?.setTypingState(false);
            this.onTypewriterComplete();
            return;
        }

        // 如果有选项，不处理
        if (this._currentLine?.options && this._currentLine.options.length > 0) {
            return;
        }

        // 下一句对话
        dialogManager.nextLine();
    }

    /**
     * 对话结束
     */
    private onDialogEnd() {
        // 隐藏对话面板
        if (this.dialogPanel) {
            this.dialogPanel.active = false;
        }

        // 清空数据
        this._currentLine = null;
        this._currentText = '';
        this._displayedText = '';
        this._isTyping = false;
    }

    update(deltaTime: number) {
        // 更新打字效果
        if (this._isTyping) {
            this.updateTypewriter(deltaTime);
        }
    }

    onDestroy() {
        // 清理事件监听
        this.unregisterEvents();
    }
}
