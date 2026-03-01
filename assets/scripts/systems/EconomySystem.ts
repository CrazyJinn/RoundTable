/**
 * 经济系统
 * @brief 货币管理与交易系统
 */

import { GameEventType } from '../data/types';
import { ECONOMY_CONFIG } from '../data/constants';
import { EventManager } from '../data/EventManager';

/**
 * 交易结果
 */
export interface TradeResult {
    success: boolean;
    message: string;
    remainingCurrency?: number;
    quantity?: number;
}

/**
 * 经济系统 - 单例
 * 管理游戏货币、交易逻辑
 */
export class EconomySystem {
    public static readonly instance: EconomySystem = new EconomySystem();

    /** 当前货币数量 */
    private _currency: number = ECONOMY_CONFIG.INITIAL_CURRENCY;
    public get currency(): number { return this._currency; }

    /** 怪物精粹数量 */
    private _essence: Map<string, number> = new Map();
    public get essence(): Map<string, number> { return this._essence; }

    private constructor() {}

    /**
     * 初始化
     */
    init(): void {
        this._currency = ECONOMY_CONFIG.INITIAL_CURRENCY;
        this._essence.clear();
    }

    /**
     * 获取货币数量
     */
    getCurrency(): number {
        return this._currency;
    }

    /**
     * 增加货币
     * @param amount 数量
     * @param source 来源
     */
    addCurrency(amount: number, source?: string): void {
        const oldAmount = this._currency;
        this._currency = Math.min(ECONOMY_CONFIG.MAX_CURRENCY, this._currency + amount);

        if (source) {
            console.log(`[EconomySystem] +${this._currency - oldAmount} currency from ${source}`);
        }

        EventManager.instance.emit(GameEventType.CurrencyChanged, {
            amount: this._currency - oldAmount,
            total: this._currency,
            source
        });
    }

    /**
     * 消费货币
     * @param amount 数量
     * @returns 是否成功
     */
    spendCurrency(amount: number): boolean {
        if (!this.canAfford(amount)) {
            return false;
        }

        this._currency -= amount;

        EventManager.instance.emit(GameEventType.CurrencyChanged, {
            amount: -amount,
            total: this._currency
        });

        return true;
    }

    /**
     * 检查是否足够
     * @param amount 需要的数量
     */
    canAfford(amount: number): boolean {
        return this._currency >= amount;
    }

    /**
     * 交易（购买物品）
     * @param itemId 物品ID
     * @param price 价格
     * @param quantity 数量
     */
    trade(itemId: string, price: number, quantity: number = 1): TradeResult {
        const totalCost = price * quantity;

        if (!this.canAfford(totalCost)) {
            return {
                success: false,
                message: '货币不足',
                remainingCurrency: this._currency
            };
        }

        this.spendCurrency(totalCost);

        return {
            success: true,
            message: '购买成功',
            remainingCurrency: this._currency,
            quantity
        };
    }

    /**
     * 出售物品
     * @param itemId 物品ID
     * @param price 价格
     * @param quantity 数量
     */
    sell(itemId: string, price: number, quantity: number = 1): TradeResult {
        const totalValue = price * quantity;
        this.addCurrency(totalValue, 'sell_' + itemId);

        return {
            success: true,
            message: '出售成功',
            remainingCurrency: this._currency,
            quantity
        };
    }

    // === 精粹系统 ===

    /**
     * 添加精粹
     * @param essenceId 精粹ID
     * @param quantity 数量
     */
    addEssence(essenceId: string, quantity: number): void {
        const current = this._essence.get(essenceId) || 0;
        this._essence.set(essenceId, current + quantity);
    }

    /**
     * 获取精粹数量
     * @param essenceId 精粹ID
     */
    getEssence(essenceId: string): number {
        return this._essence.get(essenceId) || 0;
    }

    /**
     * 兑换精粹为货币
     * @param essenceId 精粹ID
     * @param quantity 数量
     */
    exchangeEssence(essenceId: string, quantity: number): TradeResult {
        const available = this.getEssence(essenceId);

        if (available < quantity) {
            return {
                success: false,
                message: '精粹数量不足'
            };
        }

        // 计算兑换金额
        const baseValue = this.getEssenceValue(essenceId);
        const totalValue = Math.floor(baseValue * quantity * ECONOMY_CONFIG.ESSENCE_TO_CURRENCY_RATIO);

        // 扣除精粹
        this._essence.set(essenceId, available - quantity);

        // 增加货币
        this.addCurrency(totalValue, 'essence_exchange');

        return {
            success: true,
            message: `成功兑换 ${totalValue} 货币`,
            remainingCurrency: this._currency,
            quantity
        };
    }

    /**
     * 获取精粹基础价值
     */
    private getEssenceValue(essenceId: string): number {
        const values: Record<string, number> = {
            'essence_common': 100,
            'essence_plant': 150,
            'essence_human': 250,
            'essence_rare': 500,
            'essence_boss': 2000
        };
        return values[essenceId] || 100;
    }

    /**
     * 兑换所有精粹
     */
    exchangeAllEssence(): { essenceId: string; quantity: number; value: number }[] {
        const results: { essenceId: string; quantity: number; value: number }[] = [];

        this._essence.forEach((quantity, essenceId) => {
            if (quantity > 0) {
                const baseValue = this.getEssenceValue(essenceId);
                const value = Math.floor(baseValue * quantity * ECONOMY_CONFIG.ESSENCE_TO_CURRENCY_RATIO);

                results.push({
                    essenceId,
                    quantity,
                    value
                });

                this._essence.set(essenceId, 0);
                this.addCurrency(value, 'essence_exchange_all');
            }
        });

        return results;
    }

    /**
     * 获取总精粹价值
     */
    getTotalEssenceValue(): number {
        let total = 0;

        this._essence.forEach((quantity, essenceId) => {
            const baseValue = this.getEssenceValue(essenceId);
            total += Math.floor(baseValue * quantity * ECONOMY_CONFIG.ESSENCE_TO_CURRENCY_RATIO);
        });

        return total;
    }

    /**
     * 重置经济
     */
    reset(): void {
        this._currency = ECONOMY_CONFIG.INITIAL_CURRENCY;
        this._essence.clear();
    }
}
