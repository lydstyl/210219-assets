const fetch = require('node-fetch')
import { CURRENCIES } from './settings'

export function sumSelectedCurrencies(balances) {
  const newBalances = {}

  CURRENCIES.forEach((currency) => {
    balances.forEach((balance) => {
      for (const key in balance) {
        if (key === currency) {
          if (!newBalances[currency]) {
            newBalances[currency] = 0
          }

          newBalances[currency] += balance[key]
        }
      }
    })
  })

  return newBalances
}

interface Crypto {
  symbol: string
  priceUsd: number
}

function fetchUsdPrices() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('http://api.coincap.io/v2/assets?limit=100')
      const data = await response.json()

      const cryptos: Array<Crypto> = data.data.map((crypto) => ({
        symbol: crypto.symbol,
        priceUsd: crypto.priceUsd,
      }))

      resolve(cryptos)
    } catch (error) {
      reject(error)
    }
  })
}

export function addUsdValues(balances) {
  return new Promise(async (resolve, reject) => {
    try {
      const usdPrices: any = await fetchUsdPrices()

      usdPrices.push({
        symbol: 'USD',
        priceUsd: 1,
        quantity: balances.USD,
      })

      console.log(
        'usdPrices.map',
        usdPrices.map((c) => c.symbol),
      )

      balances = usdPrices
        .map((crypto) => {
          for (const key in balances) {
            if (key === crypto.symbol) {
              crypto.quantity = balances[key]
            }
          }
          return crypto
        })
        .filter((crypto) => crypto.quantity > 0)
        .map((crypto) => {
          crypto.priceUsd = parseFloat(crypto.priceUsd)

          return crypto
        })

      resolve(balances)
    } catch (error) {
      console.log('🚀 ~ addUsdValues ~ error', error)

      reject(error)
    }
  })
}
