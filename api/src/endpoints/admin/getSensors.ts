import * as db from '../../lib/db'
import { handleLambdaError } from '../../lib/requests'

export default async (event, context) => {
  try {
    const sensors = await db.models.Sensor.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: db.models.Reading,
          as: 'readings',
          where: {
            type: 'BATTERY',
          },
          order: [['createdAt', 'DESC']],
          limit: 1,
        },
      ],
    })
    return {
      statusCode: 200,
      body: JSON.stringify({
        sensors,
      }),
      headers: { 'Access-Control-Allow-Origin': '*' },
    }
  } catch (error) {
    return handleLambdaError(error)
  }
}
