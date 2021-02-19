'use strict'
const ccxt = require('ccxt')
require('dotenv').config()

function removeNullValues(object) {
  const newObject = {}

  for (const property in object) {
    if (object[property] != 0) {
      newObject[property] = object[property]
    }
  }

  return newObject
}

;(async function () {
  const bitstamp = new ccxt.bitstamp({
    apiKey: process.env.BITS_KEY,
    secret: process.env.BITS_SECRET,
    uid: process.env.BITS_UID,
  })

  let bitstampBalance = await bitstamp.fetchBalance()
  bitstampBalance = bitstampBalance.total
  bitstampBalance = removeNullValues(bitstampBalance)
  console.log('🚀 ~ bitstampBalance', bitstampBalance)

  const binance = new ccxt.binance({
    apiKey: process.env.BINA_KEY,
    secret: process.env.BINA_SECRET,
  })

  let binanceBalance = await binance.fetchBalance()

  binanceBalance = binanceBalance.total
  binanceBalance = removeNullValues(binanceBalance)

  console.log('🚀 ~ binanceBalance', binanceBalance)

  const bittrex = new ccxt.bittrex({
    apiKey: process.env.BITT_KEY,
    secret: process.env.BITT_SECRET,
  })

  let bittrexBalance = await bittrex.fetchBalance()

  bittrexBalance = bittrexBalance.total
  bittrexBalance = removeNullValues(bittrexBalance)

  console.log('🚀 ~ bittrexBalance', bittrexBalance)

  const poloniex = new ccxt.poloniex({
    apiKey: process.env.POLO_KEY,
    secret: process.env.POLO_SECRET,
  })

  let poloniexBalance = await poloniex.fetchBalance()

  poloniexBalance = poloniexBalance.total
  poloniexBalance = removeNullValues(poloniexBalance)

  console.log('🚀 ~ poloniexBalance', poloniexBalance)
})()
