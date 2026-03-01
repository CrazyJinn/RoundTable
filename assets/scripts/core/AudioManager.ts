/**
 * 音频管理器
 * @brief 音频播放控制
 */

import { AudioSource, AudioClip, resources, Node, director } from 'cc';
import { AUDIO_CONFIG } from '../data/constants';

/**
 * 音频管理器 - 单例
 * 管理BGM、SFX播放
 */
export class AudioManager {
    public static readonly instance: AudioManager = new AudioManager();

    // 音量设置
    private _bgmVolume: number = AUDIO_CONFIG.DEFAULT_BGM_VOLUME;
    private _sfxVolume: number = AUDIO_CONFIG.DEFAULT_SFX_VOLUME;

    public get bgmVolume(): number { return this._bgmVolume; }
    public get sfxVolume(): number { return this._sfxVolume; }

    public set bgmVolume(value: number) {
        this._bgmVolume = Math.max(0, Math.min(1, value));
        this.updateBGMVolume();
    }

    public set sfxVolume(value: number) {
        this._sfxVolume = Math.max(0, Math.min(1, value));
    }

    // 当前BGM
    private currentBGM: AudioSource | null = null;
    private currentBGMName: string = '';

    // BGM节点
    private bgmNode: Node | null = null;

    // 音效池
    private sfxPool: Node[] = [];
    private readonly MAX_SFX_CHANNELS = AUDIO_CONFIG.SFX_POOL_SIZE;

    private initialized: boolean = false;

    private constructor() {}

    /**
     * 初始化
     */
    init(): void {
        if (this.initialized) return;

        // 创建BGM节点
        this.bgmNode = new Node('BGM');
        director.getScene()?.addChild(this.bgmNode);

        // 创建SFX池
        for (let i = 0; i < this.MAX_SFX_CHANNELS; i++) {
            const node = new Node(`SFX_${i}`);
            const source = node.addComponent(AudioSource);
            source.playOnAwake = false;
            director.getScene()?.addChild(node);
            this.sfxPool.push(node);
        }

        this.initialized = true;
        console.log('[AudioManager] Initialized');
    }

    /**
     * 播放BGM
     * @param name BGM文件名（不含路径和扩展名）
     * @param loop 是否循环
     * @param fadeTime 淡入淡出时间
     */
    playBGM(name: string, loop: boolean = true, fadeTime: number = AUDIO_CONFIG.BGM_FADE_IN_TIME): void {
        if (this.currentBGMName === name) return;

        resources.load(`audio/bgm/${name}`, AudioClip, (err, clip) => {
            if (err) {
                console.error(`[AudioManager] Failed to load BGM: ${name}`, err);
                return;
            }

            // 淡出当前BGM
            if (this.currentBGM && this.bgmNode) {
                this.fadeOut(this.currentBGM, fadeTime, () => {
                    this.currentBGM?.stop();
                });
            }

            // 创建新BGM源
            const source = this.bgmNode!.getComponent(AudioSource) || this.bgmNode!.addComponent(AudioSource);
            source.clip = clip;
            source.loop = loop;
            source.volume = 0;
            source.play();

            this.currentBGM = source;
            this.currentBGMName = name;

            // 淡入
            this.fadeIn(source, fadeTime);
            console.log(`[AudioManager] Playing BGM: ${name}`);
        });
    }

    /**
     * 停止BGM
     * @param fadeTime 淡出时间
     */
    stopBGM(fadeTime: number = AUDIO_CONFIG.BGM_FADE_OUT_TIME): void {
        if (this.currentBGM) {
            this.fadeOut(this.currentBGM, fadeTime, () => {
                this.currentBGM?.stop();
                this.currentBGM = null;
                this.currentBGMName = '';
            });
        }
    }

    /**
     * 暂停BGM
     */
    pauseBGM(): void {
        this.currentBGM?.pause();
    }

    /**
     * 恢复BGM
     */
    resumeBGM(): void {
        this.currentBGM?.play();
    }

    /**
     * 播放音效
     * @param name 音效文件名（不含路径和扩展名）
     * @param volume 音量倍率
     */
    playSFX(name: string, volume: number = 1.0): void {
        resources.load(`audio/sfx/${name}`, AudioClip, (err, clip) => {
            if (err) {
                console.error(`[AudioManager] Failed to load SFX: ${name}`, err);
                return;
            }

            const source = this.getSFXSource();
            if (source) {
                source.playOneShot(clip, volume * this._sfxVolume);
            }
        });
    }

    /**
     * 播放3D音效
     * @param name 音效文件名
     * @param position 位置
     * @param volume 音量
     */
    playSFX3D(name: string, position: { x: number; y: number; z: number }, volume: number = 1.0): void {
        // TODO: 实现3D空间音效
        this.playSFX(name, volume);
    }

    /**
     * 播放环境音
     * @param name 环境音文件名
     * @param loop 是否循环
     */
    playAmbient(name: string, loop: boolean = true): void {
        resources.load(`audio/ambient/${name}`, AudioClip, (err, clip) => {
            if (err) {
                console.error(`[AudioManager] Failed to load ambient: ${name}`, err);
                return;
            }

            // 使用独立的节点播放环境音
            const node = new Node('Ambient_' + name);
            const source = node.addComponent(AudioSource);
            source.clip = clip;
            source.loop = loop;
            source.volume = this._sfxVolume * 0.5;
            source.play();

            director.getScene()?.addChild(node);
        });
    }

    /**
     * 停止所有音效
     */
    stopAllSFX(): void {
        for (const node of this.sfxPool) {
            const source = node.getComponent(AudioSource);
            source?.stop();
        }
    }

    /**
     * 静音/取消静音
     */
    setMute(mute: boolean): void {
        if (this.currentBGM) {
            this.currentBGM.volume = mute ? 0 : this._bgmVolume;
        }
    }

    /**
     * 获取可用的音效源
     */
    private getSFXSource(): AudioSource | null {
        // 尝试从池中获取空闲的
        for (const node of this.sfxPool) {
            const source = node.getComponent(AudioSource);
            if (source && !source.playing) {
                return source;
            }
        }

        // 强制使用第一个
        return this.sfxPool[0]?.getComponent(AudioSource) || null;
    }

    private fadeIn(source: AudioSource, duration: number): void {
        // 简化实现，实际可用 tween
        source.volume = this._bgmVolume;
    }

    private fadeOut(source: AudioSource, duration: number, callback?: () => void): void {
        source.volume = 0;
        callback?.();
    }

    private updateBGMVolume(): void {
        if (this.currentBGM) {
            this.currentBGM.volume = this._bgmVolume;
        }
    }
}
