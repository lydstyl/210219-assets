export const exchanges = ['bitstamp', 'bittrex', 'poloniex', 'binance']
export const CURRENCIES = ['BTC', 'USD', 'USDC', 'DAI', 'XRP']
export const LEDGER_BTC_AMOUNT = 0

function setLedgers(CURRENCIES) {
  const ledgers = { ledger1: {}, ledger2: {} }

  CURRENCIES.forEach((c) => {
    ledgers.ledger1[c] = 0
    ledgers.ledger2[c] = 0
  })

  // add here manual ledgerValue exemple ledgers.ledger2.BTC = 0.49

  return ledgers
}

export const LEDGERS_BALANCES = setLedgers(CURRENCIES)
