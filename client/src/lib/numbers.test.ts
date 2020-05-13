import { round } from './numbers'

describe('round', () => {
  it('should round to 1 decimal properly', () => {
    const result = round(20.152, 1)
    expect(result).toEqual(20.2)
  })
  it('should round to 3 decimals properly', () => {
    const result = round(1.051694, 3)
    expect(result).toEqual(1.052)
  })
})
