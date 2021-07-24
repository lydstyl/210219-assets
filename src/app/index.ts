'use strict'

require('dotenv').config()

import { removeNullValues, toFetchingObjects, toPromises } from './exchange'
import { sumSelectedCurrencies, addUsdValues } from './crypto'
import { toGoogleCalc, exchangesBalanceToCalc } from './calc'
import { exchanges, CURRENCIES } from './settings'

const exchangesNames = exchanges

function toBalance(exchanges) {
  Promise.all(exchanges).then(async (balances: any) => {
    balances = balances.map((balance) => {
      return removeNullValues(balance.total)
    })

    // console.log('🚀 ~ Promise.all ~ balances', balances)

    exchangesBalanceToCalc(exchangesNames, balances, CURRENCIES)

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
