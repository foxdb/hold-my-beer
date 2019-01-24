import * as AWS from 'aws-sdk'
const s3 = new AWS.S3()

export const getFile = async (bucket: string, path: string): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    s3.getObject(
      {
        Bucket: bucket, //'raspi-chill',
        Key: path // 'logs/' + logFile
      },
      (err, data) => {
        if (err || !data || !data.Body) {
          console.log(err, err.stack)
          reject(err)
        } else {
          resolve(data.Body.toString())
        }
      }
    )
  })
