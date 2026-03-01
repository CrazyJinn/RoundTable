/**
 * 玩家控制器
 * @brief 处理玩家输入，控制玩家角色
 */

import { _decorator, Component, Node, Vec2, Camera, UITransform } from 'cc';
import { Player, PlayerState } from '../entities/Player';
import { InputManager, InputAction } from '../core/InputManager';
import { GameManager } from '../core/GameManager';
import { CharacterType } from '../data/types';

const { ccclass, property } = _decorator;

/**
 * 玩家控制器组件
 */
@ccclass('PlayerController')
export class PlayerController extends Component {
    /** 玩家角色实例 */
    private player: Player | null = null;

    /** 主相机 */
    @property(Camera)
    mainCamera: Camera | null = null;

    /** 是否启用输入 */
    private inputEnabled: boolean = true;

    /**
     * 初始化玩家
     * @param type 角色类型
     */
    initPlayer(type: CharacterType): void {
        this.player = new Player(type);
        GameManager.instance.setCurrentPlayer(this.player);

        // 设置世界坐标转换器
        InputManager.instance.setWorldPositionConverter((screenPos) => {
            return this.screenToWorldPosition(screenPos);
        });

        console.log(`[PlayerController] Player initialized: ${type === CharacterType.Tech ? 'Tech' : 'Magic'}`);
    }

    /**
     * 获取玩家实例
     */
    getPlayer(): Player | null {
        return this.player;
    }

    /**
     * 启用/禁用输入
     */
    setInputEnabled(enabled: boolean): void {
        this.inputEnabled = enabled;
    }

    /**
     * 每帧更新
     */
    update(dt: number): void {
        if (!this.player || this.player.isDead) return;

        // 更新玩家逻辑
        this.player.update(dt);

        // 处理输入
        if (this.inputEnabled && GameManager.instance.canControl) {
            this.handleInput();
        }

        // 同步节点位置
        this.node.setPosition(this.player.position.x, this.player.position.y, 0);
    }

    /**
     * 每帧结束更新
     */
    lateUpdate(dt: number): void {
        InputManager.instance.lateUpdate();
    }

    /**
     * 处理输入
     */
    private handleInput(): void {
        if (!this.player) return;

        // 移动输入
        const movement = InputManager.instance.getMovement();
        this.player.move(movement);

        // 闪避
        if (InputManager.instance.isActionDown(InputAction.Dodge)) {
            this.player.dodge();
        }

        // 攻击
        if (InputManager.instance.isLeftMouseDown()) {
            this.player.attack();
        }

        // 技能1
        if (InputManager.instance.isActionDown(InputAction.Skill1)) {
            this.player.useSkill('skill_1');
        }

        // 技能2
        if (InputManager.instance.isActionDown(InputAction.Skill2)) {
            this.player.useSkill('skill_2');
        }

        // 终极技能
        if (InputManager.instance.isRightMouseDown()) {
            this.player.useUltimate();
        }

        // 换弹/冥想
        if (InputManager.instance.isActionDown(InputAction.Reload)) {
            if (this.player.characterType === CharacterType.Tech) {
                this.player.reload();
            } else {
                this.player.meditate();
            }
        }

        // 停止冥想（松开R键或移动）
        if (InputManager.instance.isActionUp(InputAction.Reload) ||
            movement.length() > 0) {
            this.player.stopMeditate();
        }

        // 交互
        if (InputManager.instance.isActionDown(InputAction.Interact)) {
            this.player.interact();
        }
    }

    /**
     * 屏幕坐标转世界坐标
     */
    private screenToWorldPosition(screenPos: Vec2): Vec2 {
        if (!this.mainCamera) {
            return screenPos.clone();
        }

        // 简化实现，实际需要根据相机设置进行转换
        const worldPos = new Vec2();
        this.mainCamera.screenToWorld(new Vec3(screenPos.x, screenPos.y, 0), worldPos as any);
        return worldPos;
    }

    /**
     * 设置玩家位置
     */
    setPlayerPosition(position: Vec2): void {
        if (this.player) {
            this.player.position = position.clone();
            this.node.setPosition(position.x, position.y, 0);
        }
    }
}
