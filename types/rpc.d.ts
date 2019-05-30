/** @module */
import '@pefish/js-node-assist';
/**
 * usdt rpc调用工具
 */
export default class TetherRpcUtil {
    /**
     * 获取调用器
     * @param rpcConfig
     */
    static getRpcHelper(rpcConfig: any): any;
    /**
     * 发送rpc请求
     * @param rpcClient
     * @param method {string} 方法名
     * @param params {array} 参数
     * @returns {Promise<void>}
     */
    static request(rpcClient: any, method: any, params: any): Promise<any>;
    /**
     * 创建SimpleSend类型交易的payload
     * @param rpcClient
     * @param amount {string} 发送数量，单位是最小
     * @param tokenType {number} 币种类型
     * @returns {Promise<void>}
     */
    static createSimpleSendPayload(rpcClient: any, amount: any, tokenType?: number): Promise<any>;
    /**
     * 给原生交易附加opreturn
     * @param rpcClient
     * @param txHex
     * @param payload
     * @returns {Promise<void>}
     */
    static attachOpReturn(rpcClient: any, txHex: any, payload: any): Promise<any>;
    /**
     * 给原生交易附加接收者
     * @param rpcClient
     * @param txHex
     * @param targetAddress
     * @param amount {string} 单位最小
     * @returns {Promise<void>}
     */
    static attachReference(rpcClient: any, txHex: any, targetAddress: any, amount?: any): Promise<any>;
    /**
     * 给原生交易附加找零
     * @param rpcClient
     * @param txHex
     * @param utxos {array} {txid, vout, scriptPubKey, value}
     * @param changeAddress
     * @param fee
     * @returns {Promise<void>}
     */
    static attachChangeOutput(rpcClient: any, txHex: any, utxos: any, changeAddress: any, fee: any): Promise<any>;
    /**
     * 列出块中所有的交易
     * @param rpcClient
     * @param blockHeight {string | number}
     * @returns {Promise<void>}
     */
    static listBlockTransactions(rpcClient: any, blockHeight: number): Promise<any>;
    /**
     * 根据txId获取交易
     * @param rpcClient
     * @param txId
     * @returns {Promise<void>}
     */
    static getTransaction(rpcClient: any, txId: any): Promise<any>;
    static getInfo(rpcClient: any): Promise<any>;
    static listPendingTxs(rpcClient: any, address?: any): Promise<any>;
    /**
     * 获取某种货币的余额
     * @param rpcClient
     * @param address {string}
     * @param currencyId {number}
     * @returns {Promise<void>}
     */
    static getBalance(rpcClient: any, address: any, currencyId: any): Promise<any>;
}
