export const round = (nbr: number, decimal: number): number => {
  return (
    Math.round((nbr + Number.EPSILON) * Math.pow(10, decimal)) /
    Math.pow(10, decimal)
  )
}

export const roundAndFormat = (nbr: number, decimal: number) => {
  return round(nbr, decimal).toFixed(decimal)
}
