// convert format XX to ISO string without using moment (too much resources)

// input: 20200517_09-39-59
// output: 2019-01-01T00:00:00.000

// really this needs to be fixed in the backend - need to return ISO Strings

export const dateStringToISOString = (inputDate: string): string => {
  const a = inputDate.replace(/-/g, ':')
  return (
    a.slice(0, 4) +
    '-' +
    a.slice(4, 6) +
    '-' +
    a
      .slice(6, a.length)
      .replace('_', 'T')
      .concat('.000')
  )
}
