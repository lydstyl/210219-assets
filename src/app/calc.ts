import { GoogleSpreadsheet } from 'google-spreadsheet'
import { CURRENCIES, LEDGERS_BTC_AMOUNT, LEDGERS_BALANCES } from './settings'
const creds = require('../../client_secret.json')
import { fetchUsdPrices } from './crypto'

export async function toGoogleCalc(balances) {
  const doc = new GoogleSpreadsheet(
    // '1QerSxiIVrG5h8hlJT94OaMeo1KJfNlJQOgsDEsF-MIg',
    '1rrYVxvKNLXrD-eiQLOD4hc0Clpp4xPAINc5d70VOv5c',
  )

  try {
    await doc.useServiceAccountAuth(creds)

    await doc.loadInfo() // loads document properties and worksheets

    const sheet = doc.sheetsByTitle['crypto']

    const rows = CURRENCIES.length + 1

    await sheet.loadCells(`J1:L${rows}`) // loads a range of cells

    const offset = 9
    sheet.getCell(0, 0 + offset).value = 'TEST'

    // clear previews data
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < 3; col++) {
        sheet.getCell(row, col + offset).value = ''
      }
    }

    // const a1 = (sheet.getCell(9, 4).value = 44)
    sheet.getCell(0, 0 + offset).value = 'SYMBOL'
    sheet.getCell(0, 1 + offset).value = 'QUANTITY'
    sheet.getCell(0, 2 + offset).value = 'PRICE'

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
        row.quantity += LEDGERS_BTC_AMOUNT // add ledgers sum BTC
      }

      sheet.getCell(index + 1, 0 + offset).value = row.symbol
      sheet.getCell(index + 1, 1 + offset).value = row.quantity
      sheet.getCell(index + 1, 2 + offset).value = row.priceUsd
      // sheet.getCell(index + 1, 3).formula = '=A1'
    })

    await sheet.saveUpdatedCells()

    console.log(
      'https://docs.google.com/spreadsheets/d/1rrYVxvKNLXrD-eiQLOD4hc0Clpp4xPAINc5d70VOv5c/edit#gid=1877330140',
    )
  } catch (error) {
    console.log('🚀 ~ accessSpreadsheet ~ error', error.message)
  }
}

export async function exchangesBalanceToCalc(
  exchangesNames,
  balances,
  CURRENCIES,
) {
  let exchangesBalances = createExchangesBalances(
    exchangesNames,
    balances,
    CURRENCIES,
  )

  exchangesBalances = await addUSDValues(exchangesBalances)

  toCalc(exchangesBalances)
}

function createExchangesBalances(exchangesNames, balances, CURRENCIES) {
  let exchangesBalances = {}
  for (let i = 0; i < exchangesNames.length; i++) {
    const exchangesName = exchangesNames[i]
    const balance = balances[i]

    exchangesBalances[exchangesName] = {}
    CURRENCIES.forEach((currency) => {
      exchangesBalances[exchangesName][currency] = balance?.[currency]
        ? balance?.[currency]
        : 0
    })
  }

  exchangesBalances = { ...exchangesBalances, ...LEDGERS_BALANCES }

  return exchangesBalances
}

async function toCalc(exchangesBalances) {
  const doc = new GoogleSpreadsheet(
    // '1QerSxiIVrG5h8hlJT94OaMeo1KJfNlJQOgsDEsF-MIg',
    '1rrYVxvKNLXrD-eiQLOD4hc0Clpp4xPAINc5d70VOv5c',
  )

  try {
    await doc.useServiceAccountAuth(creds)
    await doc.loadInfo()

    // const sheet = doc.sheetsByTitle['exchanges']
    const sheet = doc.sheetsByTitle['crypto']

    const rows = CURRENCIES.length + 1,
      cols = 8

    await sheet.loadCells(`A1:M${rows}`) // loads a range of cells + 5

    // clear previews data
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        sheet.getCell(row, col).value = '' // clear previews data
      }
    }

    Object.keys(exchangesBalances).forEach((exchangeName, index) => {
      // add first title row
      sheet.getCell(0, index + 1).value = exchangeName

      // add data
      const exchange = exchangesBalances[exchangeName]

      Object.keys(exchange).forEach((currency, i) => {
        sheet.getCell(i + 1, 0).value = currency
        sheet.getCell(i + 1, index + 1).value = exchange[currency]
      })
    })

    await sheet.saveUpdatedCells()
    console.log(
      'https://docs.google.com/spreadsheets/d/1rrYVxvKNLXrD-eiQLOD4hc0Clpp4xPAINc5d70VOv5c/edit#gid=1877330140',
    )
  } catch (error) {
    console.log('🚀 ~ accessSpreadsheet ~ error', error.message)
  }
}

async function addUSDValues(exchangesBalances) {
  const usdPricesAsExchange = {}

  CURRENCIES.forEach((cur) => {
    usdPricesAsExchange[cur] = 0
  })

  let usdPrices: any = await fetchUsdPrices()

  usdPrices = usdPrices
    .filter((crypto) => {
      return CURRENCIES.includes(crypto.symbol)
    })
    .map((c) => ({ ...c, priceUsd: parseFloat(c.priceUsd) }))

  usdPrices.forEach((c) => {
    usdPricesAsExchange[c.symbol] = c.priceUsd
  })

  usdPricesAsExchange['USD'] = 1

  exchangesBalances.usePrices = usdPricesAsExchange
  return exchangesBalances
}
