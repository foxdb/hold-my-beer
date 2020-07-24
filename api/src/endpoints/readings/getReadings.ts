import * as db from '../../lib/db'
import { handleLambdaError } from '../../lib/requests'
import { validateQueryParam } from '../helpers'
const { Sequelize } = require('sequelize')
const Op = Sequelize.Op

export default async (event, context) => {
  try {
    let type
    let startDateISO
    let endDateISO
    try {
      type = validateQueryParam('type', event)
      startDateISO = validateQueryParam('startDate', event)
      endDateISO = validateQueryParam('endDate', event)
      // TODO: more validation
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: err.toString(),
        }),
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    }

    const readings = await db.models.Reading.findAll({
      where: {
        type,
        sensor_id: '4697a334-8beb-47f6-be64-ff1d14aba693',
        createdAt: {
          [Op.between]: [startDateISO, endDateISO],
        },
      },
      order: [['createdAt', 'DESC']],
      attributes: ['type', 'value', 'createdAt'],
    })
    return {
      statusCode: 200,
      body: JSON.stringify({
        readings,
      }),
      headers: { 'Access-Control-Allow-Origin': '*' },
    }
  } catch (error) {
    return handleLambdaError(error)
  }
}
