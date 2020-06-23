import * as db from '../lib/db'

export default async (event, context) => {
  try {
    await db.syncSchemas()
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
