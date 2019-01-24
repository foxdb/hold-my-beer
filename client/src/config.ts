const api = {
  //     'https://8lcv9lzvgk.execute-api.ap-southeast-2.amazonaws.com/default/',
  baseUrl: process.env.API_BASE_URL,
  getLogs: 'temperatureLogs',
  listLogs: 'listLogs-js',
}

const RAW_DATE_FORMAT = 'YYYYMMDD_HH-mm-ss'

export { api, RAW_DATE_FORMAT }
