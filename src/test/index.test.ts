import { hello } from '../app/index'

describe('Main index test suite', () => {
  it('show hello world', () => {
    expect(hello('world')).toBe('Hello world')
  })
})
