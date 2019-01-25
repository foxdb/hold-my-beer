const api = {
  baseUrl: process.env.API_BASE_URL,
  getLogs: 'temperatureLogs',
  defaultGetOverallLogs: 'overallTemperatureLTTB',
  selectGetOverallLogs: [
    'overallTemperatureLTD',
    'overallTemperatureLTOB',
    'overallTemperatureLTTB',
  ],
  recentLogs: 'recentTemperatureLogs',
  listLogs: 'listLogs-js',
}

const RAW_DATE_FORMAT = 'YYYYMMDD_HH-mm-ss'

export { api, RAW_DATE_FORMAT }
