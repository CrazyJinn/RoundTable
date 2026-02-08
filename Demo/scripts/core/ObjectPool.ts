/**
 * 对象池
 * 用于复用游戏对象，减少实例化开销
 */
export class ObjectPool<T> {
    private _pool: T[] = [];
    private _factory: () => T;
    private _reset: (obj: T) => void;
    private _initialSize: number;

    /**
     * 创建对象池
     * @param factory 对象创建函数
     * @param reset 对象重置函数
     * @param initialSize 初始大小
     */
    constructor(factory: () => T, reset: (obj: T) => void, initialSize: number = 10) {
        this._factory = factory;
        this._reset = reset;
        this._initialSize = initialSize;

        // 预创建对象
        for (let i = 0; i < initialSize; i++) {
            this._pool.push(factory());
        }
    }

    /**
     * 获取对象
     */
    public acquire(): T {
        if (this._pool.length > 0) {
            return this._pool.pop()!;
        }
        return this._factory();
    }

    /**
     * 释放对象
     */
    public release(obj: T) {
        this._reset(obj);
        this._pool.push(obj);
    }

    /**
     * 获取池中对象数量
     */
    public get size(): number {
        return this._pool.length;
    }

    /**
     * 清空对象池
     */
    public clear() {
        this._pool = [];
    }
}
