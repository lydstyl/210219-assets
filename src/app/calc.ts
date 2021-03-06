import { GoogleSpreadsheet } from 'google-spreadsheet'
import { LEDGER_BTC_AMOUNT } from './settings'
const creds = require('../../client_secret.json')

export async function toGoogleCalc(balances) {
  const doc = new GoogleSpreadsheet(
    '1QerSxiIVrG5h8hlJT94OaMeo1KJfNlJQOgsDEsF-MIg',
  )

  try {
    await doc.useServiceAccountAuth(creds)

    await doc.loadInfo() // loads document properties and worksheets

    const sheet = doc.sheetsByTitle['portefeuille'] // the first sheet

    await sheet.loadCells('A1:C20') // loads a range of cells

    // clear previews data
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 3; col++) {
        sheet.getCell(row, col).value = ''
      }
    }

    console.log('🚀 ~ toGoogleCalc ~ balances', balances)

    // const a1 = (sheet.getCell(9, 4).value = 44)
    sheet.getCell(0, 0).value = 'SYMBOL'
    sheet.getCell(0, 1).value = 'QUANTITY'
    sheet.getCell(0, 2).value = 'PRICE'

    // addLedgerAssets

    balances = balances
      .map((row, index) => {
        return { ...row, total: row.quantity * row.priceUsd } // add total
      })
      .sort((a, b) => {
        // sort by total
        if (a.total < b.total) {
          return 1
        }
        if (a.total > b.total) {
          return -1
        }
        return 0
      })

    balances.forEach((row, index) => {
      if (row.symbol === 'BTC') {
        row.quantity += LEDGER_BTC_AMOUNT // add ledgers sum BTC
      }

      sheet.getCell(index + 1, 0).value = row.symbol
      sheet.getCell(index + 1, 1).value = row.quantity
      sheet.getCell(index + 1, 2).value = row.priceUsd
      // sheet.getCell(index + 1, 3).formula = '=A1'
    })

    await sheet.saveUpdatedCells()

    console.log(
      'https://docs.google.com/spreadsheets/d/1QerSxiIVrG5h8hlJT94OaMeo1KJfNlJQOgsDEsF-MIg/edit#gid=2144089454',
    )
  } catch (error) {
    console.log('🚀 ~ accessSpreadsheet ~ error', error.message)
  }
}
