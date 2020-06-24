import * as db from '../../lib/db'
import { handleLambdaError } from '../../lib/requests'

export default async (event, context) => {
  try {
    const requestBody = JSON.parse(event.body)

    if (
      !requestBody ||
      !requestBody.name ||
      typeof requestBody.name !== 'string'
    ) {
      console.error('body.name name must be a valid string')
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'body.name name must be a valid string',
        }),
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    }

    const projectName = requestBody.name
    const project = await db.models.Project.create({ name: projectName })

    return {
      statusCode: 200,
      body: JSON.stringify({
        project,
      }),
      headers: { 'Access-Control-Allow-Origin': '*' },
    }
  } catch (error) {
    return handleLambdaError(error)
  }
}
