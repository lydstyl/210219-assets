'use strict'
const ccxt = require('ccxt')
require('dotenv').config()

const exchanges = ['bitstamp', 'bittrex', 'poloniex', 'binance']

function toFetchingObjects(exchanges) {
  exchanges = exchanges.map((exchangeId) => {
    const exchangeName = exchangeId.toUpperCase()

    let KEY = exchangeName + '_KEY'
    KEY = process.env[KEY]

    let SECRET = exchangeName + '_SECRET'
    SECRET = process.env[SECRET]

    const exchange = {
      exchangeId,
      KEY,
      SECRET,
      uid: '',
    }

    if (exchangeId === 'bitstamp') {
      exchange.uid = process.env.BITSTAMP_UID
    }

    return exchange
  })

  return exchanges
}

function toPromises(exchanges) {
  exchanges = exchanges.map((ex) => {
    const exchangeClass = ccxt[ex.exchangeId]
    return new exchangeClass({
      apiKey: ex.KEY,
      secret: ex.SECRET,
      uid: ex.uid,
      timeout: 30000,
    }).fetchBalance()
  })

  return exchanges
}

function removeNullValues(object) {
  const newObject = {}

  for (const property in object) {
    if (object[property] != 0) {
      newObject[property] = object[property]
    }
  }

  return newObject
}

function toBalance(exchanges) {
  Promise.all(exchanges).then((balances: any) => {
    balances = balances.map((balance) => {
      return removeNullValues(balance.total)
    })
    console.log('🚀 ~ balances=balances.map ~ balances', balances)
  })
}

function fetchAll(exchanges) {
  exchanges = toFetchingObjects(exchanges)

  exchanges = toPromises(exchanges)

  toBalance(exchanges)
}

fetchAll(exchanges)
