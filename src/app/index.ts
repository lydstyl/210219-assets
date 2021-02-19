'use strict'

require('dotenv').config()

import { removeNullValues, toFetchingObjects, toPromises } from './exchange'

const exchanges = ['bitstamp', 'bittrex', 'poloniex', 'binance']

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
