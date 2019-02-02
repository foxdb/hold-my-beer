const api = {
  baseUrl: process.env.API_BASE_URL,
  getLogs: 'temperatureLogs',
  defaultGetOverallLogs: 'LTTB',
  selectGetOverallLogs: ['LTD', 'LTOB', 'LTTB', 'raw'],
  recentLogs: 'recentTemperatureLogs',
  logFiles: 'logFiles',
  getMetadata: 'getMetadata'
}

const RAW_DATE_FORMAT = 'YYYYMMDD_HH-mm-ss'

export { api, RAW_DATE_FORMAT }
