interface Metadata {
  minTemp: number
  maxTemp: number
}

interface Point {
  temperature: number
  date: string
}

export const makePoints = (
  lines: string[]
): { metadata: Metadata; points: Point[] } => {
  let minTemp = 50000
  let maxTemp = -50000

  const points = lines.reduce(
    (acc, current) => {
      const temp = parseFloat(current.split(',')[1])

      if (temp === null || isNaN(temp)) {
        return acc
      }

      minTemp = Math.min(minTemp, temp)
      maxTemp = Math.max(maxTemp, temp)

      acc.push({
        date: current.split(',')[0],
        temperature: temp
      })

      return acc
    },
    [] as Point[]
  )

  return {
    metadata: {
      minTemp,
      maxTemp
    },
    points
  }
}
