interface Metadata {
  minTemp: number
  maxTemp: number
  inputLines: number
  validPoints: number
}

interface Point {
  temperature: number
  date: string
}

// @CleanUp: make makePoints use makePoint.

export const makePoint = (line: string): Point => ({
  date: line.split(',')[0],
  temperature: parseFloat(line.split(',')[1]),
})

export const makePoints = (
  lines: string[],
  withIndex: boolean = false
): {
  metadata: Metadata
  points: Point[]
  indexedPoints: { x: number; y: number }[]
  dateIndex: { [index: number]: number }
} => {
  let minTemp = 50000
  let maxTemp = -50000

  let dateIndex = {}
  const indexedPoints: { x: number; y: number }[] = []

  const points = lines.reduce((acc, current, index) => {
    const temp = parseFloat(current.split(',')[1])

    if (temp === null || isNaN(temp)) {
      return acc
    }

    minTemp = Math.min(minTemp, temp)
    maxTemp = Math.max(maxTemp, temp)

    const date = current.split(',')[0]

    if (withIndex) {
      dateIndex[index] = date
      indexedPoints.push({ x: index, y: temp })
    }

    acc.push({
      date,
      temperature: temp,
    })

    return acc
  }, [] as Point[])

  return {
    metadata: {
      minTemp,
      maxTemp,
      inputLines: lines.length,
      validPoints: points.length,
    },
    points,
    indexedPoints,
    dateIndex,
  }
}

interface GenericMetadata {
  min: number
  max: number
  inputLinesCount: number
  validPointsCount: number
}

interface GravityPoint {
  gravity: number
  date: string
}

export const makeGravityPoints = (
  lines: string[],
  withIndex: boolean = false
): {
  metadata: GenericMetadata
  points: GravityPoint[]
  indexedPoints: { x: number; y: number }[]
  dateIndex: { [index: number]: number }
} => {
  let min = 50000
  let max = -50000

  let dateIndex = {}
  const indexedPoints: { x: number; y: number }[] = []

  const points = lines.reduce((acc, current, index) => {
    const gravity = parseFloat(current.split(',')[1])

    if (gravity === null || isNaN(gravity)) {
      return acc
    }

    min = Math.min(min, gravity)
    max = Math.max(max, gravity)

    const date = current.split(',')[0]

    if (withIndex) {
      dateIndex[index] = date
      indexedPoints.push({ x: index, y: gravity })
    }

    acc.push({
      date,
      gravity: gravity,
    })

    return acc
  }, [] as GravityPoint[])

  return {
    metadata: {
      min,
      max,
      inputLinesCount: lines.length,
      validPointsCount: points.length,
    },
    points,
    indexedPoints,
    dateIndex,
  }
}

export const validatePathParam = (name, event): string => {
  if (event.pathParameters && event.pathParameters[name]) {
    return event.pathParameters[name]
  } else {
    throw new Error('Missing path param: ' + name)
  }
}
