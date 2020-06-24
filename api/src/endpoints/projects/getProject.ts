import * as db from '../../lib/db'
import { validatePathParam } from '../helpers'
import { handleLambdaError } from '../../lib/requests'
import { lsDirectory, getS3 } from '../../lib/s3'

export default async (event, context) => {
  try {
    const requestedProject = validatePathParam('projectName', event)

    const project = await db.models.Project.findOne({
      where: { name: requestedProject },
    })

    const s3 = getS3()
    const logsDirContent = await lsDirectory(
      s3,
      process.env.logsBucketName as string,
      process.env.logsPath as string
    )

    // refactor, add s3 helper to do that
    const projectLogs = logsDirContent
      .filter(
        (file) =>
          file.path &&
          file.path.includes(requestedProject) &&
          !file.path.includes('.bak')
      )
      .map((file) => {
        const parts = file.path.split('/')
        return parts[parts.length - 1]
      })

    return {
      statusCode: 200,
      body: JSON.stringify({
        project: {
          id: project.id,
          name: project.name,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          logs: projectLogs,
        },
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
