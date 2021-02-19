'use strict'

require('dotenv').config()

const { GoogleSpreadsheet } = require('google-spreadsheet')
const creds = require('../../client_secret.json')

import { removeNullValues, toFetchingObjects, toPromises } from './exchange'

const exchanges = ['bitstamp', 'bittrex', 'poloniex']

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

async function accessSpreadsheet() {
  const doc = new GoogleSpreadsheet(
    '1QerSxiIVrG5h8hlJT94OaMeo1KJfNlJQOgsDEsF-MIg',
  )

  console.log('🚀 ~ accessSpreadsheet ~ creds', creds)

  try {
    await doc.useServiceAccountAuth(creds)

    await doc.loadInfo() // loads document properties and worksheets
    console.log(doc.title)
  } catch (error) {
    console.log('🚀 ~ accessSpreadsheet ~ error', error.message)
  }
}

accessSpreadsheet()
