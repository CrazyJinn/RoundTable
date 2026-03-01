/**
 * 场景管理器
 * @brief 场景切换控制
 */

import { director, Scene, Node } from 'cc';
import { GameManager } from './GameManager';

/** 场景名称常量 */
export const SceneNames = {
    MAIN_MENU: 'MainMenu',
    CHARACTER_SELECT: 'CharacterSelect',
    GAME: 'Game',
    TOWN_KNIGHT: 'Town_Knight',
    TOWN_MAGIC: 'Town_Magic',
    WASTELAND: 'Wasteland',
    FOREST: 'Forest',
    RUINS: 'Ruins',
    SNOW: 'Snow',
    DUNGEON_CAVE: 'Dungeon_Cave'
} as const;

/** 场景加载选项 */
export interface SceneLoadOptions {
    showLoading?: boolean;
    fadeIn?: boolean;
    fadeTime?: number;
    onLoad?: () => void;
}

/**
 * 场景管理器 - 单例
 * 负责场景加载、切换、过渡效果
 */
export class SceneManager {
    public static readonly instance: SceneManager = new SceneManager();

    /** 当前场景名称 */
    private _currentScene: string = '';
    public get currentScene(): string { return this._currentScene; }

    /** 上一场景名称 */
    private _previousScene: string = '';
    public get previousScene(): string { return this._previousScene; }

    /** 是否正在加载 */
    private _isLoading: boolean = false;
    public get isLoading(): boolean { return this._isLoading; }

    /** 加载进度 */
    private _loadProgress: number = 0;
    public get loadProgress(): number { return this._loadProgress; }

    /** 场景根节点 */
    private _sceneRoot: Node | null = null;

    private constructor() {}

    /**
     * 加载场景
     * @param sceneName 场景名称
     * @param options 加载选项
     */
    async loadScene(sceneName: string, options?: SceneLoadOptions): Promise<void> {
        if (this._isLoading) {
            console.warn('[SceneManager] Already loading a scene');
            return;
        }

        this._isLoading = true;
        this._loadProgress = 0;

        const opts = {
            showLoading: true,
            fadeIn: true,
            fadeTime: 0.5,
            ...options
        };

        console.log(`[SceneManager] Loading scene: ${sceneName}`);

        try {
            // 淡出当前场景
            if (opts.fadeIn && this._currentScene) {
                await this.fadeOut(opts.fadeTime);
            }

            // 显示加载界面
            if (opts.showLoading) {
                this.showLoadingScreen();
            }

            // 加载新场景
            await new Promise<void>((resolve, reject) => {
                director.loadScene(sceneName, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });

            // 更新场景记录
            this._previousScene = this._currentScene;
            this._currentScene = sceneName;

            // 触发加载完成回调
            opts.onLoad?.();

            // 淡入新场景
            if (opts.fadeIn) {
                await this.fadeIn(opts.fadeTime);
            }

            // 隐藏加载界面
            if (opts.showLoading) {
                this.hideLoadingScreen();
            }

            console.log(`[SceneManager] Scene loaded: ${sceneName}`);

        } catch (error) {
            console.error(`[SceneManager] Failed to load scene: ${sceneName}`, error);
            throw error;
        } finally {
            this._isLoading = false;
            this._loadProgress = 1;
        }
    }

    /**
     * 预加载场景
     * @param sceneName 场景名称
     */
    preloadScene(sceneName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            director.preloadScene(sceneName, (err) => {
                if (err) {
                    console.error(`[SceneManager] Failed to preload scene: ${sceneName}`, err);
                    reject(err);
                    return;
                }
                console.log(`[SceneManager] Scene preloaded: ${sceneName}`);
                resolve();
            });
        });
    }

    /**
     * 返回上一场景
     */
    async goBack(options?: SceneLoadOptions): Promise<void> {
        if (!this._previousScene) {
            console.warn('[SceneManager] No previous scene to go back to');
            return;
        }
        await this.loadScene(this._previousScene, options);
    }

    /**
     * 获取当前活动场景
     */
    getActiveScene(): Scene | null {
        return director.getScene();
    }

    /**
     * 设置场景根节点
     */
    setSceneRoot(node: Node): void {
        this._sceneRoot = node;
    }

    /**
     * 获取场景根节点
     */
    getSceneRoot(): Node | null {
        return this._sceneRoot;
    }

    // === 私有方法 ===

    private showLoadingScreen(): void {
        // TODO: 实现加载界面显示
        this._loadProgress = 0.5;
    }

    private hideLoadingScreen(): void {
        // TODO: 实现加载界面隐藏
        this._loadProgress = 1;
    }

    private fadeOut(duration: number): Promise<void> {
        return new Promise(resolve => {
            // TODO: 实现淡出效果
            setTimeout(resolve, duration * 1000);
        });
    }

    private fadeIn(duration: number): Promise<void> {
        return new Promise(resolve => {
            // TODO: 实现淡入效果
            setTimeout(resolve, duration * 1000);
        });
    }
}
