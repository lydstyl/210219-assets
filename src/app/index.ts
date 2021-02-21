'use strict'

require('dotenv').config()

import { removeNullValues, toFetchingObjects, toPromises } from './exchange'
import { sumSelectedCurrencies, addUsdValues } from './crypto'
import { toGoogleCalc } from './calc'
import { exchanges } from './settings'
console.log('🚀 ~ exchanges', exchanges)

function toBalance(exchanges) {
  Promise.all(exchanges).then(async (balances: any) => {
    balances = balances.map((balance) => {
      return removeNullValues(balance.total)
    })

    balances = sumSelectedCurrencies(balances)

    balances = await addUsdValues(balances)

    toGoogleCalc(balances)
  })
}

function fetchAll(exchanges) {
  exchanges = toFetchingObjects(exchanges)

  exchanges = toPromises(exchanges)

  toBalance(exchanges)
}

fetchAll(exchanges)
