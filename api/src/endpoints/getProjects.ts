import { getFile, lsDirectory, getS3 } from '../lib/s3'
import { validatePathParam } from './helpers'

export const getProjects = async (event, context) => {
  try {
    const projects = await getProjectsList()
    return {
      statusCode: 200,
      body: JSON.stringify({
        projects
      }),
      headers: { 'Access-Control-Allow-Origin': '*' }
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getProject = async (event, context) => {
  try {
    const requestedProject = validatePathParam('projectName', event)
    const projectLogs = await getProjectLogs(requestedProject)

    return {
      statusCode: 200,
      body: JSON.stringify({
        project: {
          name: requestedProject,
          logs: projectLogs
        }
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      }
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getProjectLogs = async (name: string): Promise<string[]> => {
  const s3 = getS3()

  const logsDirContent = await lsDirectory(
    s3,
    process.env.logsBucketName as string,
    process.env.logsPath as string
  )

  // refactor, add s3 helper to do that
  return logsDirContent
    .filter(
      file =>
        file.path && file.path.includes(name) && !file.path.includes('.bak')
    )
    .map(file => file.path.replace(process.env.logsPath + '/', ''))
}

export const getProjectsList = async () => {
  const s3 = getS3()
  const rawProjects = await getFile(
    s3,
    process.env.logsBucketName as string,
    process.env.projectsFileName as string
  )

  return rawProjects.split('\n')
}
