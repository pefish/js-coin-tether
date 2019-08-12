import '@pefish/js-node-assist'
import { BtcWallet } from '@pefish/js-coin-btc'
import Remote from './remote'
import ErrorHelper from '@pefish/js-error'
import { BtcRemoteConfig, UtxoInterface } from '@pefish/js-coin-btc'


export default class TetherWalletHelper extends BtcWallet {
  decimals: number = 8
  bitcoinLib: any
  remoteClient: Remote

  constructor () {
    super()
    this.bitcoinLib = require('@pefish/bitcoinjs-lib')
  }

  initRemoteClient (config: BtcRemoteConfig): void {
    this.remoteClient = new Remote(config)
  }

  /**
   * 获取usdt测试币
   * @param utxos
   * @param fee
   * @param changeAddress
   * @param amount {string} 获取多少.单位shatoshi
   * @returns {Promise<*>}
   */
  async getTestnetCoin (utxos, fee, changeAddress, amount) {
    return this.buildTransaction(
      utxos,
      [
        {
          address: 'moneyqMan7uh8FqdCA2BV5yZ8qVrc9ikLP',
          amount: amount.div_(1E2)
        }
      ],
      fee,
      changeAddress,
      'testnet'
    )
  }

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
  async buildSimpleSendTx (
    amount: string, 
    tokenType: number,
    utxos: UtxoInterface[],
    targetAddress: string,
    targetAmount: string,
    changeAddress: string,
    fee: string,
    targets: {address: string, amount: string}[] = [], 
    network: string = 'testnet'
  ): Promise<any> {
    if (!this.remoteClient) {
      throw new ErrorHelper(`please init remote client first`)
    }
    
    if (utxos.length === 0) {
      throw new ErrorHelper(`没有输入`)
    }
    const payload = await this.remoteClient.createSimpleSendPayload(amount, tokenType)
    utxos.forEach((utxo) => {
      const { balance, index } = utxo
      utxo['value'] = balance.unShiftedBy_(this.decimals)
      utxo['vout'] = index
    })
    const unsignedRawTx = await this.remoteClient.client.createRawTransaction(utxos, {})
    const unsignedRawTxWithOpReturn = await this.remoteClient.attachOpReturn(unsignedRawTx, payload)
    let withReference = await this.remoteClient.attachReference(unsignedRawTxWithOpReturn, targetAddress, targetAmount)
    for (const {address, amount} of targets) {
      withReference = await this.remoteClient.attachReference(withReference, address, amount)
    }
    const withChange = await this.remoteClient.attachChangeOutput(withReference, utxos, changeAddress, fee.unShiftedBy_(8))
    const result = await this.signTxHex(withChange, utxos, network)
    let inputAmount = '0'
    utxos.forEach((utxo) => {
      inputAmount = inputAmount.add_(utxo['balance'])
    })

    result[`fee`] = fee.unShiftedBy_(8)
    result[`inputAmount`] = inputAmount.unShiftedBy_(8)
    return result
  }

  getOmniPayload (amount: string, currency: string = `USDT`): string {
    const hexAmount = amount.decimalToHexString_(false).padStart(16, '0').toUpperCase()
    const omniPayload = [
      '6f6d6e69', // omni
      // 31 for Tether, you can modify it depends on your regtest chain
      this.getCurrencyIdByCurrency(currency).toString().decimalToHexString_(false).padStart(16, '0'),
      hexAmount,
    ].join('')
    return omniPayload
  }

  getCurrencyIdByCurrency (currency: string): number {
    if (currency === `USDT`) {
      return 31
    } else {
      throw new ErrorHelper(`not supported`)
    }
  }

  /**
   * 离线构造SimpleSend交易
   * @param utxos {array} utxo
   * @param btcTargets {array} 发送btc的目标
   * @param fee {string} btc手续费，单位satoshi
   * @param changeAddress {string} btc找零地址
   * @param targetAddress {string} 代币目标发送地址
   * @param amount {string} 代币数量，单位最小
   * @param network
   * @param sign
   * @returns 
   */
  buildSimpleSend (
    senderUtxo: UtxoInterface,
    utxos: UtxoInterface[],
    btcTargets: {address: string, amount: string, msg?: string}[], 
    fee: string, 
    changeAddress: string, 
    targetAddress: string, 
    amount: string, 
    network = `testnet`, 
    sign = true
  ): { txHex: string, txId: string, fee: string, inputAmount: string, outputAmount: string, changeAmount: string} {
    const realNetwork = this.parseNetwork(network)
    const txBuilder = new this.bitcoinLib.TransactionBuilder(realNetwork, 3000)
    txBuilder.setVersion(2)
    let totalUtxoBalance = '0'
    utxos.unshift(senderUtxo)  // 把发送者的utxo放第一位
    if (utxos.length === 0) {
      throw new ErrorHelper(`没有输入`)
    }

    if (fee.gt_(`10000000`)) {
      throw new ErrorHelper(`手续费过高，请检查`)
    }

    for (const utxo of utxos) {
      const {txid, index, balance, sequence} = utxo
      if (sequence !== undefined) {
        txBuilder.addInput(txid, index, sequence)
      } else {
        txBuilder.addInput(txid, index)
      }
      totalUtxoBalance = totalUtxoBalance.add_(balance)
    }

    // 添加usdt输出
    const data = [ this.getOmniPayload(amount).hexToBuffer_() ]

    const omniOutput = this.bitcoinLib.payments.embed({ data }).output

    txBuilder.addOutput(omniOutput, 0)

    let targetTotalAmount = '0'
    // 计算要发送出去的总额
    btcTargets.forEach((target) => {
      const {amount} = target
      targetTotalAmount = targetTotalAmount.add_(amount.toString())
    })
    const dustValue = `546`
    targetTotalAmount = targetTotalAmount.add_(dustValue)

    for (const target of btcTargets) {
      const {address, amount, msg} = target
      let outputScript = address
      if (address === null && msg) {
        outputScript = this.bitcoinLib.script.nullData.output.encode(Buffer.from(msg, 'utf8'))
      }
      try {
        txBuilder.addOutput(outputScript, amount.toNumber_())
      } catch (err) {
        throw new ErrorHelper('构造output出错' + err['message'], 0, JSON.stringify(target), err)
      }
    }
    if (fee.lt_(1000)) {
      fee = '1000'
    }
    // 添加找零的输出
    const changeAmount = totalUtxoBalance.sub_(targetTotalAmount).sub_(fee.toString())
    if (changeAmount.lt_(0)) {
      throw new ErrorHelper(`btc balance not enough`)
    }
    if (changeAmount !== '0') {
      const amount = totalUtxoBalance.sub_(targetTotalAmount).sub_(fee.toString())
      txBuilder.addOutput(changeAddress, amount.toNumber_())
    }
    txBuilder.addOutput(targetAddress, dustValue.toNumber_()) // 放到最后
    let buildedTx = null
    if (sign) {
      // 签名
      buildedTx = this._signUtxos(txBuilder, utxos, realNetwork)
    } else {
      buildedTx = txBuilder.buildIncomplete()
    }
    return {
      txHex: buildedTx.toHex(),
      txId: buildedTx.getId(),
      fee,
      inputAmount: totalUtxoBalance.toString(),
      outputAmount: targetTotalAmount.toString(),
      changeAmount: changeAmount.toString(),
    }
  }
}
