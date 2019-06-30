// import { validatePathParam, makePoint, makePoints } from './helpers'
import { validatePathParam, makePoint, makePoints } from './helpers'

describe('validatePathParam', () => {
  it('throws when event has no pathParameters', () => {
    expect(() => validatePathParam('param1', {})).toThrow(
      'Missing path param: param1'
    )
  })

  it('throws when param is missing from pathParameters', () => {
    expect(() =>
      validatePathParam('param1', { pathParameters: { notParam1: 123 } })
    ).toThrow('Missing path param: param1')
  })

  it('returns given path param when available', () => {
    expect(
      validatePathParam('param1', { pathParameters: { param1: 123 } })
    ).toBe(123)
  })
})

describe('makePoint', () => {
  it('parses a line into an object of date and temperature', () => {
    const line = '2018-06-05,18'
    expect(makePoint(line)).toEqual({
      date: '2018-06-05',
      temperature: 18
    })
  })
})

describe('makePoints', () => {
  const inputLines = [
    '2018-06-05,18',
    '2018-06-06,17',
    '2018-06-07,16',
    '2018-06-08,15',
    '2018-06-08,asd15' // this lines is not valid
  ]

  const validLinesCount = 4

  const result = makePoints(inputLines)
  const resultWithIndex = makePoints(inputLines, true)

  it('extracts the min/max temperature', () => {
    expect(result.metadata.minTemp).toEqual(15)
    expect(result.metadata.maxTemp).toEqual(18)
  })

  it('counts the number of inputs and valid inputs', () => {
    expect(result.metadata.inputLines).toEqual(inputLines.length)
    expect(result.metadata.validPoints).toEqual(validLinesCount)
  })

  it('creates an array of valid data points', () => {
    expect(result.points.length).toEqual(validLinesCount)
    expect(result.points[0]).toHaveProperty('temperature')
    expect(result.points[0].temperature).toEqual(18)
    expect(result.points[0]).toHaveProperty('date')
  })

  it('does not create an index if not required', () => {
    expect(result.indexedPoints.length).toEqual(0)
    expect(Object.keys(result.dateIndex).length).toEqual(0)
  })

  it('creates an index if required', () => {
    expect(resultWithIndex.indexedPoints.length).toEqual(validLinesCount)
    expect(Object.keys(resultWithIndex.dateIndex).length).toEqual(
      validLinesCount
    )
  })
})
