import * as db from '../../lib/db'
import { validatePathParam, validateQueryParam } from '../helpers'
import { handleLambdaError } from '../../lib/requests'
const { Sequelize } = require('sequelize')
const Op = Sequelize.Op

export default async (event, context) => {
  try {
    const requestedProject = validatePathParam('projectName', event)
    const requestedReadingType = validateQueryParam('type', event)

    const project = await db.models.Project.findOne({
      where: { name: requestedProject },
    })

    if (!project) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
      }
    }

    const availableSensors = await db.models.ProjectSensorReading.findAll({
      where: {
        project_id: project.id,
      },
    })

    const requestedProjectSensorReading = availableSensors.find(
      (s) => s.readingType === requestedReadingType
    )

    if (!requestedProjectSensorReading) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `${requestedReadingType} is not available for this project.`,
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
      }
    }

    const readings = await db.models.Reading.findAll({
      where: {
        type: requestedProjectSensorReading.readingType,
        sensor_id: requestedProjectSensorReading.SensorId,
        createdAt:
          requestedProjectSensorReading.endDate !== null
            ? {
                [Op.between]: [
                  requestedProjectSensorReading.startDate,
                  requestedProjectSensorReading.endDate,
                ],
              }
            : {
                [Op.gte]: requestedProjectSensorReading.startDate,
              },
      },
      order: [['createdAt', 'ASC']],
      attributes: ['type', 'value', 'createdAt'],
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        readings,
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    }
  } catch (error) {
    return handleLambdaError(error)
  }
}
