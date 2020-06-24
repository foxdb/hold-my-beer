import * as db from '../../lib/db'
import { handleLambdaError } from '../../lib/requests'

export default async (event, context) => {
  try {
    const projects = await db.models.Project.findAll({
      order: [['createdAt', 'DESC']],
    })
    return {
      statusCode: 200,
      body: JSON.stringify({
        projects,
      }),
      headers: { 'Access-Control-Allow-Origin': '*' },
    }
  } catch (error) {
    return handleLambdaError(error)
  }
}
