import '@pefish/js-node-assist';
import { BtcWallet } from '@pefish/js-coin-btc';
import Remote from './remote';
import { BtcRemoteConfig, UtxoInterface } from '@pefish/js-coin-btc';
export default class TetherWalletHelper extends BtcWallet {
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
    getTestnetCoin(utxos: any, fee: any, changeAddress: any, amount: any): Promise<{
        txHex: string;
        txId: string;
        fee: string;
        inputAmount: string;
        outputAmount: string;
        changeAmount: string;
    }>;
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
    buildSimpleSendTx(amount: string, tokenType: number, utxos: UtxoInterface[], targetAddress: string, targetAmount: string, changeAddress: string, fee: string, targets?: {
        address: string;
        amount: string;
    }[], network?: string): Promise<any>;
    getOmniPayload(amount: string, currency?: string): string;
    getCurrencyIdByCurrency(currency: string): number;
    /**
     * 离线构造SimpleSend交易
     * @param senderUtxo {object} usdt发送者的utxo
     * @param otherUtxos {array} 其他utxo
     * @param btcTargets {array} 发送btc的目标
     * @param fee {string} btc手续费，单位satoshi
     * @param changeAddress {string} btc找零地址
     * @param targetAddress {string} 代币目标发送地址
     * @param amount {string} 代币数量，单位最小
     * @param network
     * @param sign
     * @returns
     */
    buildSimpleSend(senderUtxo: UtxoInterface, otherUtxos: UtxoInterface[], btcTargets: {
        address: string;
        amount: string;
        msg?: string;
    }[], fee: string, changeAddress: string, targetAddress: string, amount: string, network?: string, sign?: boolean): {
        txHex: string;
        txId: string;
        fee: string;
        inputAmount: string;
        outputAmount: string;
        changeAmount: string;
    };
}
