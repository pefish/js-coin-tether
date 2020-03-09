import '@pefish/js-node-assist'
import TetherWalletHelper from './wallet'
import assert from 'assert'

describe('usdtWalletHelper', () => {

  let walletHelper: TetherWalletHelper

  before(async () => {
    walletHelper = new TetherWalletHelper()
    walletHelper.initRemoteClient({
      "host": "34.80.229.37",
      "port": 18332,
      "username": "usdt",
      "password": "usdt",
      "ssl": false
    })
  })

  it('getOmniPayload', async () => {
    try {
      const result = walletHelper.getOmniPayload(`1000000000`)
      // logger.error(result)
      assert.strictEqual(result, '6f6d6e69000000000000001f000000003B9ACA00')
    } catch (err) {
      console.error(err)
      assert.throws(() => {
      }, err)
    }
  })

  it('buildSimpleSendTx', async () => {
    try {
      const tx = walletHelper.buildSimpleSendTx(
        {
          'txid': 'f71885c81df375b17491269c583cb8a1837412d19460880485a5362a53822921',
          'index': 0,
          'balance': '4000000',
          'type': 'p2sh(p2wpkh)',
          'wif': 'cRWu81dLiLXqnwhZjU2UGBjpPR2ERQpXQQrFjJWkPW1jn9pM2QiW'
        },
        [
          {
            'txid': '88f7bb3f720259b2590bc21fb0271dd5caf20c15a3afc371670287e63b1e98d9',
            'index': 0,
            'balance': '6600000',
            'type': 'p2sh(p2wpkh)',
            'wif': 'cW2Tvn1E9JQsP2BQVAZ42CPdDEtae5fGceobzVpUgoWt4NoMakq9'
          },
          {
            'txid': '23412e59fd3b2a7f6b2cf91dbf56fac06f740bbec8cf25ce7648a6e1a8284e2b',
            'index': 0,
            'balance': '3400000',
            'type': 'p2sh(p2wpkh)',
            'wif': 'cW2Tvn1E9JQsP2BQVAZ42CPdDEtae5fGceobzVpUgoWt4NoMakq9'
          }
        ],
        [],
        `10000`,
        `2My1UpKsy9ZTRxEac9B5NC3BrUKqx5CCppp`,
        `2My1UpKsy9ZTRxEac9B5NC3BrUKqx5CCppp`,
        `10000000`,
        `testnet`
      )
      // console.error(JSON.stringify(tx))
      assert.strictEqual(tx[`txId`], '466244e7345f30339312b38af4b0690cac8f6e5187190b42e18f629aaba43459')
    } catch (err) {
      console.error(err)
      assert.throws(() => {
      }, err)
    }
  })
})

