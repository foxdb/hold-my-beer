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

interface BucketFile {
  path: string
  lastModified: any
}

export const lsDirectory = async (
  bucket: string,
  path: string
): Promise<BucketFile[]> =>
  new Promise<BucketFile[]>((resolve, reject) => {
    s3.listObjects({ Bucket: bucket, Prefix: path }, (err, data) => {
      if (err || !data || !data.Contents) {
        console.log(err, err.stack)
        reject(err)
      } else {
        if (!data.Contents || data.Contents.length === 0) {
          resolve([])
        } else {
          const files = data.Contents.filter(
            item => item && item.Key && item.LastModified
          ).map(item => {
            return {
              path: item.Key,
              lastModified: item.LastModified
            }
          })
          resolve(files as BucketFile[])
        }
      }
    })
  })
