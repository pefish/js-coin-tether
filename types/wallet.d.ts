import '@pefish/js-node-assist';
import BaseBitcoinWalletHelper from '@pefish/js-coin-btc/lib/base/base_bitcoinjs_lib';
import Remote from './remote';
import { BtcRemoteConfig } from '@pefish/js-coin-btc';
export default class TetherWalletHelper extends BaseBitcoinWalletHelper {
    [x: string]: any;
    decimals: number;
    bitcoinLib: any;
    remoteClient: Remote;
    constructor();
    initRemoteClient(config: BtcRemoteConfig): void;
    /**
     * 获取usdt测试币
     * @param utxos
     * @param fee
     * @param changeAddress
     * @param amount {string} 获取多少.单位shatoshi
     * @returns {Promise<*>}
     */
    getTestnetCoin(utxos: any, fee: any, changeAddress: any, amount: any): Promise<any>;
    /**
     * 发送tether货币(在线)
     * @param amount {string} 单位最小
     * @param tokenType {number} 货币类型
     * @param utxos {array} 输入
     * @param targetAddress {string} usdt打给谁
     * @param targetAmount {string} 目标地址btc，单位shatoxi，null是取最小数值
     * @param changeAddress {string} btc找零给谁
     * @param fee {string} 支付的BTC手续费. 单位最小
     * @param targets {array} btc还要打给谁
     * @param network
     * @returns {Promise<*>}
     */
    buildSimpleSendTx(amount: any, tokenType: any, utxos: any, targetAddress: any, targetAmount: any, changeAddress: any, fee: any, targets?: any[], network?: string): Promise<any>;
    getOmniPayload(amount: any, currency?: string): string;
    getCurrencyIdByCurrency(currency: any): number;
    /**
     * 离线构造SimpleSend交易
     * @param utxos {array} txid, wif {string|array}, index, balance, [sequence], [type], [pubkeys], [m]
     * @param targets {array} 发送btc的目标
     * @param fee {string} btc手续费，单位satoshi
     * @param changeAddress {string} btc找零地址
     * @param targetAddress {string} 代币目标发送地址
     * @param amount {string} 代币数量，单位最小
     * @param network
     * @param sign
     * @returns {{txHex: *|string, txId: *|string, fee: *, inputAmount: string, outputAmount: string, changeAmount: string, outputWithIndex: Array}}
     */
    buildSimpleSend(utxos: any, targets: any, fee: any, changeAddress: any, targetAddress: any, amount: any, network?: string, sign?: boolean): {
        txHex: any;
        txId: any;
        fee: any;
        inputAmount: string;
        outputAmount: string;
        changeAmount: string;
        outputWithIndex: any[];
    };
}
