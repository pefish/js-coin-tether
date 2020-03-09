/** @module */
import '@pefish/js-node-assist'
import { BtcRemote } from '@pefish/js-coin-btc'

export interface RemoteConfig {
  host: string
  port: number,
  username?: string,
  password?: string,
  ssl?: boolean
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
  async createSimpleSendPayload (amount, tokenType = 31) {
    return this.request('omni_createpayload_simplesend', [
      tokenType,
      amount.unShiftedBy_(8)
    ])
  }

  /**
   * 给原生交易附加opreturn
   * @param txHex
   * @param payload
   * @returns {Promise<void>}
   */
  async attachOpReturn (txHex, payload) {
    return this.request('omni_createrawtx_opreturn', [
      txHex,
      payload
    ])
  }

  /**
   * 给原生交易附加接收者
   * @param txHex
   * @param targetAddress
   * @param amount {string} 单位最小
   * @returns {Promise<void>}
   */
  async attachReference (txHex, targetAddress, amount = null) {
    const params = [
      txHex,
      targetAddress
    ]
    amount && params.push(amount.unShiftedBy_(8))
    return this.request('omni_createrawtx_reference', params)
  }

  /**
   * 给原生交易附加找零
   * @param txHex
   * @param utxos {array} {txid, vout, scriptPubKey, value}
   * @param changeAddress
   * @param fee
   * @returns {Promise<void>}
   */
  async attachChangeOutput (txHex, utxos, changeAddress, fee) {
    return this.request('omni_createrawtx_change', [
      txHex,
      utxos,
      changeAddress,
      fee
    ])
  }

  /**
   * 列出块中所有的交易
   * @param blockHeight {string | number}
   * @returns {Promise<void>}
   */
  async listBlockTransactions (blockHeight: number) {
    return this.request('omni_listblocktransactions', [
      blockHeight
    ])
  }

  /**
   * 根据txId获取交易
   * @param rpcClient
   * @param txId
   * @returns {Promise<void>}
   */
  async getTransaction (txId) {
    return this.request('omni_gettransaction', [
      txId
    ])
  }

  async getInfo () {
    return this.request('omni_getinfo', [])
  }

  async listPendingTxs (address = null) {
    const params = []
    address && params.push(address)
    return this.request('omni_listpendingtransactions', params)
  }

  /**
   * 获取某种货币的余额
   * @param rpcClient
   * @param address {string}
   * @param currencyId {number}
   * @returns {Promise<void>}
   */
  async getBalance (address, currencyId) {
    return this.request('omni_getbalance', [address, currencyId])
  }
}
