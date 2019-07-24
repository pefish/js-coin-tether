/** @module */
import '@pefish/js-node-assist';
import { BtcRemote } from '@pefish/js-coin-btc';
export interface RemoteConfig {
    host: string;
    port: number;
    username?: string;
    password?: string;
    ssl?: boolean;
}
/**
 * usdt rpc调用工具
 */
export default class Remote extends BtcRemote {
    /**
     * 创建SimpleSend类型交易的payload
     * @param amount {string} 发送数量，单位是最小
     * @param tokenType {number} 币种类型
     * @returns {Promise<void>}
     */
    createSimpleSendPayload(amount: any, tokenType?: number): Promise<any>;
    /**
     * 给原生交易附加opreturn
     * @param txHex
     * @param payload
     * @returns {Promise<void>}
     */
    attachOpReturn(txHex: any, payload: any): Promise<any>;
    /**
     * 给原生交易附加接收者
     * @param txHex
     * @param targetAddress
     * @param amount {string} 单位最小
     * @returns {Promise<void>}
     */
    attachReference(txHex: any, targetAddress: any, amount?: any): Promise<any>;
    /**
     * 给原生交易附加找零
     * @param txHex
     * @param utxos {array} {txid, vout, scriptPubKey, value}
     * @param changeAddress
     * @param fee
     * @returns {Promise<void>}
     */
    attachChangeOutput(txHex: any, utxos: any, changeAddress: any, fee: any): Promise<any>;
    /**
     * 列出块中所有的交易
     * @param blockHeight {string | number}
     * @returns {Promise<void>}
     */
    listBlockTransactions(blockHeight: number): Promise<any>;
    /**
     * 根据txId获取交易
     * @param rpcClient
     * @param txId
     * @returns {Promise<void>}
     */
    getTransaction(txId: any): Promise<any>;
    getInfo(): Promise<any>;
    listPendingTxs(address?: any): Promise<any>;
    /**
     * 获取某种货币的余额
     * @param rpcClient
     * @param address {string}
     * @param currencyId {number}
     * @returns {Promise<void>}
     */
    getBalance(address: any, currencyId: any): Promise<any>;
}
