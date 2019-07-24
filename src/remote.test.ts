import '@pefish/js-node-assist'
import Remote from './remote'
import assert from 'assert'

describe('usdtWalletHelper', () => {

  let helper

  before(async () => {
    helper = new Remote({
      "host": "34.80.89.182",
      "port": 8336,
      "username": "omniclient",
      "password": "",
      "ssl": false
    })
  })

  it('getInfo', async () => {
    try {
      const result = await helper.getInfo()
      // global.logger.error(result)
      assert.strictEqual(result[`block`] > 0, true)
    } catch (err) {
      global.logger.error(err)
      assert.throws(() => {
      }, err)
    }
  })

})

