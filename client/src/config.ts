const api = {
  baseUrl:
    'https://8lcv9lzvgk.execute-api.ap-southeast-2.amazonaws.com/default/',
  getLogs: 'getTemperature-js',
  listLogs: 'listLogs-js',
}

const RAW_DATE_FORMAT = 'YYYYMMDD_HH-mm-ss'

export { api, RAW_DATE_FORMAT }
