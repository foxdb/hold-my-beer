import { round, roundAndFormat } from './numbers'

describe('numbers helpers', () => {
  describe('round', () => {
    it('should round to 1 decimal properly', () => {
      const result = round(20.152, 1)
      expect(result).toEqual(20.2)
    })
    it('should round to 3 decimals properly', () => {
      const result = round(1.051694, 3)
      expect(result).toEqual(1.052)
    })
    it('should preserve trailing 0', () => {
      const result = round(1.05, 3)
      expect(result).toEqual(1.05)
    })
  })
  describe('roundAndFormat', () => {
    it('should round to 1 decimal properly', () => {
      const result = roundAndFormat(20.152, 1)
      expect(result).toEqual('20.2')
    })
    it('should round to 3 decimals properly', () => {
      const result = roundAndFormat(1.051694, 3)
      expect(result).toEqual('1.052')
    })
    it('should preserve trailing 0', () => {
      const result = roundAndFormat(1.05, 3)
      expect(result).toEqual('1.050')
    })
  })
})
