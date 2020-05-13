export const round = (nbr: number, decimal: number) => {
  return (
    Math.round((nbr + Number.EPSILON) * Math.pow(10, decimal)) /
    Math.pow(10, decimal)
  )
}
