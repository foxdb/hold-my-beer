import * as db from '../../lib/db'
import { handleLambdaError } from '../../lib/requests'

export default async (event, context) => {
  try {
    console.log('attempting to sync DB schemas...')
    await db.syncSchemas()
    console.log('schemas are now in sync...')
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
    }
  } catch (error) {
    return handleLambdaError(error)
  }
}
