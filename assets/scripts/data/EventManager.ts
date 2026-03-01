/**
 * 事件管理器
 * @brief 全局事件系统，实现观察者模式
 */

import { GameEventType, GameEvent } from './types';

type EventCallback = (event: GameEvent) => void;

/**
 * 事件管理器 - 单例
 * 提供全局事件的发布/订阅功能
 */
export class EventManager {
    public static readonly instance: EventManager = new EventManager();

    /** 事件监听器映射 */
    private listeners: Map<GameEventType, Set<EventCallback>> = new Map();

    /** 一次性监听器 */
    private onceListeners: Map<GameEventType, Set<EventCallback>> = new Map();

    private constructor() {}

    /**
     * 订阅事件
     * @param eventType 事件类型
     * @param callback 回调函数
     */
    on(eventType: GameEventType, callback: EventCallback): void {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, new Set());
        }
        this.listeners.get(eventType)!.add(callback);
    }

    /**
     * 订阅一次性事件
     * @param eventType 事件类型
     * @param callback 回调函数
     */
    once(eventType: GameEventType, callback: EventCallback): void {
        if (!this.onceListeners.has(eventType)) {
            this.onceListeners.set(eventType, new Set());
        }
        this.onceListeners.get(eventType)!.add(callback);
    }

    /**
     * 取消订阅事件
     * @param eventType 事件类型
     * @param callback 回调函数
     */
    off(eventType: GameEventType, callback: EventCallback): void {
        this.listeners.get(eventType)?.delete(callback);
        this.onceListeners.get(eventType)?.delete(callback);
    }

    /**
     * 发布事件
     * @param eventType 事件类型
     * @param data 事件数据
     */
    emit(eventType: GameEventType, data?: any): void {
        const event: GameEvent = {
            type: eventType,
            data: data,
            timestamp: Date.now()
        };

        // 触发普通监听器
        this.listeners.get(eventType)?.forEach(callback => {
            try {
                callback(event);
            } catch (e) {
                console.error(`[EventManager] Error in event callback:`, e);
            }
        });

        // 触发一次性监听器
        const onceCallbacks = this.onceListeners.get(eventType);
        if (onceCallbacks) {
            onceCallbacks.forEach(callback => {
                try {
                    callback(event);
                } catch (e) {
                    console.error(`[EventManager] Error in once event callback:`, e);
                }
            });
            this.onceListeners.delete(eventType);
        }
    }

    /**
     * 清除指定事件的所有监听器
     * @param eventType 事件类型
     */
    clear(eventType: GameEventType): void {
        this.listeners.delete(eventType);
        this.onceListeners.delete(eventType);
    }

    /**
     * 清除所有监听器
     */
    clearAll(): void {
        this.listeners.clear();
        this.onceListeners.clear();
    }

    /**
     * 获取指定事件的监听器数量
     * @param eventType 事件类型
     */
    getListenerCount(eventType: GameEventType): number {
        const normal = this.listeners.get(eventType)?.size || 0;
        const once = this.onceListeners.get(eventType)?.size || 0;
        return normal + once;
    }
}
