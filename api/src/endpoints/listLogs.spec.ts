import { listLogFiles } from './listLogs'
import { mockS3, clearMocks } from '../../test/helpers/s3'
import { listObjectsMock } from '../../test/data/listObjects'

const logsBucketName = process.env.logsBucketName
const projectsFileName = process.env.projectsFileName
const logsPath = process.env.logsPath

describe('listLogfiles', () => {
  beforeAll(() => {
    process.env.logsBucketName = 'testBucket'
    process.env.projectsFileName = 'testProjectFilename'
    process.env.logsPath = 'testLogsPath'
    mockS3({
      listObjects: listObjectsMock,
      getObject: undefined
    })
  })

  afterAll(() => {
    clearMocks()
    process.env.logsBucketName = logsBucketName
    process.env.projectsFileName = projectsFileName
    process.env.logsPath = logsPath
  })

  it('throws when type param not provided', async () => {
    await expect(listLogFiles({}, {})).rejects.toThrow(
      'Missing path param: type'
    )
  })

  it('returns a list of logFiles matching the requested type', async () => {
    const result = await listLogFiles(
      { pathParameters: { type: 'externalTemperature' } },
      {}
    )
    expect(result.statusCode).toEqual(200)
    expect(JSON.parse(result.body).logFiles.length).toEqual(3)
    expect(JSON.parse(result.body).logFiles[0].fileName).toEqual(
      'logs/20190413_15-55-03-external-temperature.log'
    )
    expect(JSON.parse(result.body).logFiles[0].lastModified).toEqual(
      '2019-04-13T05:55:05.000Z'
    )
  })
})
