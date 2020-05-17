import { dateStringToISOString } from './dates'

describe('dateStringToISOString', () => {
  it('should format my weird date format to ISO string', () => {
    const weirdDate = '20200517_09-39-59'
    const expectedDate = '2020-05-17T09:39:59.000'
    expect(dateStringToISOString(weirdDate)).toEqual(expectedDate)
  })
})
