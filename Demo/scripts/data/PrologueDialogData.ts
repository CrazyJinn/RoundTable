import { DialogData } from './DialogData';

/**
 * 序章对话数据
 * 时间：14年前
 * 地点：废土边缘的科技派聚居地
 * 角色：
 * - 女主（当时106岁）：魔法派秘术协会成员
 * - 秘术协会长老：派遣任务的长老
 * - 男主父亲：科技派平民
 * - 男主母亲：科技派平民
 * - 小男主（当时3岁）：目击者
 */
export const prologueDialogData: DialogData = {
    id: 'prologue',
    sections: {
        // ==================== 第一阶段：任务接受 ====================
        'phase1_task': {
            id: 'phase1_task',
            lines: [
                {
                    speakerId: '旁白',
                    text: '【14年前】',
                    emotion: 'narration',
                    nextDialogId: null
                },
                {
                    speakerId: '旁白',
                    text: '魔法派秘术协会总部',
                    emotion: 'scene_desc',
                    nextDialogId: null
                },
                {
                    speakerId: '长老',
                    text: '本次任务至关重要。根据情报，科技派在那个废土聚居地发现了某种古代遗物...',
                    emotion: 'serious',
                    nextDialogId: null
                },
                {
                    speakerId: '女主（106岁）',
                    text: '长老，那个遗物具体是什么？为什么我们如此重视？',
                    emotion: 'curious',
                    nextDialogId: null
                },
                {
                    speakerId: '长老',
                    text: '那是一种能够逆转核辐射影响的古代科技...如果让它落入科技派手中，我们魔法派将失去优势。',
                    emotion: 'serious',
                    nextDialogId: null
                },
                {
                    speakerId: '长老',
                    text: '你的任务是潜入那个聚居地，找到遗物，然后...销毁它。必要时，可以采取一切手段。',
                    emotion: 'cold',
                    nextDialogId: null
                },
                {
                    speakerId: '女主（106岁）',
                    text: '...明白了。我会完成任务的。',
                    emotion: 'determined',
                    nextDialogId: null
                },
                {
                    speakerId: '旁白',
                    text: '就这样，女主踏上了前往科技派聚居地的路途。',
                    emotion: 'narration',
                    nextDialogId: null
                }
            ]
        },

        // ==================== 第二阶段：潜入任务（战斗前） ====================
        'phase2_infiltration': {
            id: 'phase2_infiltration',
            lines: [
                {
                    speakerId: '旁白',
                    text: '夜幕降临，女主潜入了科技派的聚居地。',
                    emotion: 'narration',
                    nextDialogId: null
                },
                {
                    speakerId: '女主（106岁）',
                    text: '（这个聚居地比我想象的要大...情报显示遗物应该在西边的建筑里）',
                    emotion: 'thinking',
                    nextDialogId: null
                },
                {
                    speakerId: '旁白',
                    text: '就在女主准备靠近那座建筑时，两个身影挡在了她的面前。',
                    emotion: 'alert',
                    nextDialogId: null
                },
                {
                    speakerId: '男主父亲',
                    text: '你是谁？为什么会在这种时间出现在这里？',
                    emotion: 'suspicious',
                    nextDialogId: null
                },
                {
                    speakerId: '男主母亲',
                    text: '亲爱的，别那么凶...也许她是迷路了？',
                    emotion: 'concerned',
                    nextDialogId: null
                },
                {
                    speakerId: '女主（106岁）',
                    text: '（该死，被发现了...必须快速解决掉）',
                    emotion: 'alert',
                    nextDialogId: null
                },
                {
                    speakerId: '旁白',
                    text: '女主意识到情况不妙，决定先下手为强。',
                    emotion: 'tension',
                    nextDialogId: null
                },
                {
                    speakerId: '男主父亲',
                    text: '等等，你的穿着...你是魔法派的人？！',
                    emotion: 'shocked',
                    nextDialogId: null
                },
                {
                    speakerId: '女主（106岁）',
                    text: '...抱歉，但我必须这么做。',
                    emotion: 'determined',
                    nextDialogId: null
                },
                {
                    speakerId: '旁白',
                    text: '【战斗开始】',
                    emotion: 'battle_start',
                    event: 'start-battle',
                    nextDialogId: null
                }
            ]
        },

        // ==================== 第三阶段：战后反思 ====================
        'phase3_reflection': {
            id: 'phase3_reflection',
            lines: [
                {
                    speakerId: '旁白',
                    text: '战斗结束后，女主找到了那份古代遗物...并按照长老的指示销毁了它。',
                    emotion: 'narration',
                    nextDialogId: null
                },
                {
                    speakerId: '女主（106岁）',
                    text: '任务完成了...但是...',
                    emotion: 'conflicted',
                    nextDialogId: null
                },
                {
                    speakerId: '旁白',
                    text: '女主望向那对倒在地上的夫妇，心中涌起一丝不安。',
                    emotion: 'melancholy',
                    nextDialogId: null
                },
                {
                    speakerId: '女主（106岁）',
                    text: '（这对夫妇...他们只是普通人啊。我真的做对了吗？）',
                    emotion: 'guilt',
                    nextDialogId: null
                },
                {
                    speakerId: '旁白',
                    text: '就在这时，一个小小的身影从废墟中走了出来。',
                    emotion: 'alert',
                    nextDialogId: null
                },
                {
                    speakerId: '小男主（3岁）',
                    text: '爸爸...妈妈...？',
                    emotion: 'confused',
                    nextDialogId: null
                },
                {
                    speakerId: '女主（106岁）',
                    text: '！！',
                    emotion: 'shocked',
                    nextDialogId: null
                },
                {
                    speakerId: '旁白',
                    text: '女主看着那个只有三岁大的孩子，他的眼神中充满了恐惧和困惑。',
                    emotion: 'drama',
                    nextDialogId: null
                },
                {
                    speakerId: '小男主（3岁）',
                    text: '爸爸妈妈...为什么不醒...？',
                    emotion: 'sad',
                    nextDialogId: null
                },
                {
                    speakerId: '女主（106岁）',
                    text: '...对不起。',
                    emotion: 'guilt',
                    nextDialogId: null
                },
                {
                    speakerId: '旁白',
                    text: '女主无法面对这个孩子的目光，她转身离开了...',
                    emotion: 'melancholy',
                    nextDialogId: null
                },
                {
                    speakerId: '旁白',
                    text: '那一年，男主失去了双亲，只留下零碎的记忆片段。',
                    emotion: 'narration',
                    nextDialogId: null
                },
                {
                    speakerId: '旁白',
                    text: '那一年，女主完成了任务，却永远无法释怀。',
                    emotion: 'narration',
                    nextDialogId: null
                },
                {
                    speakerId: '旁白',
                    text: '14年后，两人的命运即将再次交织...',
                    emotion: 'foreshadowing',
                    nextDialogId: null
                },
                {
                    speakerId: '旁白',
                    text: '【序章 完】',
                    emotion: 'end',
                    nextDialogId: null
                }
            ]
        }
    }
};

/**
 * 角色配置（用于UI显示）
 */
export const prologueCharacters = {
    '女主（106岁）': {
        name: '女主',
        color: '#FF69B4', // 粉色
        avatar: 'avatars/female_magic.png'
    },
    '长老': {
        name: '长老',
        color: '#FFD700', // 金色
        avatar: 'avatars/elder.png'
    },
    '男主父亲': {
        name: '男主父亲',
        color: '#808080', // 灰色
        avatar: 'avatars/father.png'
    },
    '男主母亲': {
        name: '男主母亲',
        color: '#FFA07A', // 浅橙色
        avatar: 'avatars/mother.png'
    },
    '小男主（3岁）': {
        name: '小男主',
        color: '#87CEEB', // 天蓝色
        avatar: 'avatars/boy.png'
    },
    '旁白': {
        name: '',
        color: '#FFFFFF', // 白色
        avatar: ''
    }
};
