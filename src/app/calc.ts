import { GoogleSpreadsheet } from 'google-spreadsheet'
import { resolve } from 'path'
const creds = require('../../client_secret.json')

export async function toGoogleCalc(balances) {
  const doc = new GoogleSpreadsheet(
    '1QerSxiIVrG5h8hlJT94OaMeo1KJfNlJQOgsDEsF-MIg',
  )

  try {
    await doc.useServiceAccountAuth(creds)

    await doc.loadInfo() // loads document properties and worksheets

    const sheet = doc.sheetsByTitle['portefeuille'] // the first sheet

    await sheet.loadCells('A1:M20') // loads a range of cells

    console.log('🚀 ~ toGoogleCalc ~ balances', balances)
    // const a1 = (sheet.getCell(9, 4).value = 44)
    sheet.getCell(0, 0).value = 'SYMBOL'
    sheet.getCell(0, 1).value = 'QUANTITY'
    sheet.getCell(0, 2).value = 'PRICE'

    balances.forEach((row, index) => {
      sheet.getCell(index + 1, 0).value = row.symbol
      sheet.getCell(index + 1, 1).value = row.quantity
      sheet.getCell(index + 1, 2).value = row.priceUsd
    })

    await sheet.saveUpdatedCells()
  } catch (error) {
    console.log('🚀 ~ accessSpreadsheet ~ error', error.message)
  }
}
