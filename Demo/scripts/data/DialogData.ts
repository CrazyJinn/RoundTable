/**
 * 对话数据结构
 */

/**
 * 对话角色
 */
export interface DialogCharacter {
    id: string;           // 角色ID
    name: string;         // 显示名称
    color: string;        // 名字颜色（可选）
    avatar?: string;      // 头像资源路径
}

/**
 * 对话选项
 */
export interface DialogOption {
    text: string;                  // 选项文本
    nextDialogId?: string;         // 跳转的对话ID
    condition?: string;            // 触发条件（可选）
    action?: string;               // 执行动作（可选）
}

/**
 * 单句对话
 */
export interface DialogLine {
    speakerId: string;             // 说话者ID
    text: string;                  // 对话文本
    emotion?: string;              // 表情/动作（可选）
    options?: DialogOption[];      // 对话选项（可选）
    nextDialogId?: string;         // 下一句对话ID
    event?: string;                // 触发事件（可选）
    delay?: number;                // 延迟显示（毫秒）
}

/**
 * 对话段
 */
export interface DialogSection {
    id: string;                    // 对话段ID
    lines: DialogLine[];           // 对话行列表
}

/**
 * 对话数据
 */
export interface DialogData {
    id: string;                    // 对话数据ID
    sections: { [key: string]: DialogSection }; // 对话段映射
}
