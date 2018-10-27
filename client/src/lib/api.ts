import { api } from '../config'
import rp from 'request-promise'

export const getTemperatureLogs = () => rp(api.baseUrl + api.getLogs)
