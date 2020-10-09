import { round } from './numbers'

// https://www.brewersfriend.com/2011/06/16/alcohol-by-volume-calculator-updated/

export const calculateAbv = (og: number, sg: number): number => {
  return round((og - sg) * 131.25, 1)
}

export const calculateAbvAlternate = (og: number, sg: number): number => {
  return round(((76.08 * (og - sg)) / (1.775 - og)) * (sg / 0.794), 1)
}
