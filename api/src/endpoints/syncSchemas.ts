import * as db from '../lib/db'

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
    console.error(error)
    throw error
  }
}
