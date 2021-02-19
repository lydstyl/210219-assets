'use strict'

require('dotenv').config()

import { GoogleSpreadsheet } from 'google-spreadsheet'
const creds = require('../../client_secret.json')

import { removeNullValues, toFetchingObjects, toPromises } from './exchange'
import { sumSelectedCurrencies, addUsdValues } from './crypto'

const exchanges = ['bitstamp', 'bittrex', 'poloniex']

///////////////////////////////////////////////////////
function toBalance(exchanges) {
  Promise.all(exchanges).then(async (balances: any) => {
    balances = balances.map((balance) => {
      return removeNullValues(balance.total)
    })

    balances = sumSelectedCurrencies(balances)

    balances = await addUsdValues(balances) ///////////////////////////
    console.log('🚀 ~ Promise.all ~ balances', balances)

    // toGoogleCalc

    // console.log('🚀 ~ balances=balances.map ~ balances', balances)
  })
}

function fetchAll(exchanges) {
  exchanges = toFetchingObjects(exchanges)

  exchanges = toPromises(exchanges)

  toBalance(exchanges)
}

fetchAll(exchanges)
///////////////////////////////////////////////////////

// async function accessSpreadsheet() {
//   const doc = new GoogleSpreadsheet(
//     '1QerSxiIVrG5h8hlJT94OaMeo1KJfNlJQOgsDEsF-MIg',
//   )

//   try {
//     await doc.useServiceAccountAuth(creds)

//     await doc.loadInfo() // loads document properties and worksheets

//     const sheet = doc.sheetsByTitle['Feuille 3'] // the first sheet

//     await sheet.loadCells('A1:E10') // loads a range of cells

//     const a1 = (sheet.getCell(9, 4).value = 44)

//     await sheet.saveUpdatedCells()
//   } catch (error) {
//     console.log('🚀 ~ accessSpreadsheet ~ error', error.message)
//   }
// }

// accessSpreadsheet()
