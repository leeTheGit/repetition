import {
    PutObjectCommand,
    S3Client,
    ListBucketsCommand,
    S3ClientConfig,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Resource } from 'sst'

type s3Params = {
    Bucket: string
    Key: string
    Expires: number
    ContentType?: string

    // This ACL makes the uploaded object publicly readable. You must also uncomment
    // the extra permission for the Lambda function in the SAM template.
    ACL: string
}

export default class S3Component {
    private client: S3Client
    private s3Bucket: string

    constructor() {
        const secretAccessKey = Resource.AwsSecretAccessKey.value
        const awsAccessKeyId = Resource.AwsKeyId.value
        const awsRegion = Resource.AwsRegion.value

        this.s3Bucket = Resource.StoreUploads.name || ''
        const AWS_KEY_ID = awsAccessKeyId
        const AWS_SECRET_ACCESS_KEY = secretAccessKey
        const AWS_REGION = awsRegion

        if (!AWS_KEY_ID) throw new Error('AWS_KEY_ID is not set')
        if (!AWS_SECRET_ACCESS_KEY)
            throw new Error('AWS_SECRET_ACCESS_KEY is not set')

        const s3Configuration: S3ClientConfig = {
            credentials: {
                accessKeyId: AWS_KEY_ID,
                secretAccessKey: AWS_SECRET_ACCESS_KEY,
            },
            region: AWS_REGION || 'ap-southeast-2',
        }

        this.client = new S3Client(s3Configuration)
    }

    public async listBuckets() {
        const command = new ListBucketsCommand({})
        const response = await this.client.send(command)
    }

    public async createBucket(bucketName: string) {}

    public async upload(bucketName: string, file: string, key: string) {}

    public async getSignedUrlPromise(s3Params: s3Params): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: s3Params.Bucket,
            Key: s3Params.Key,
        })
        const url = await getSignedUrl(this.client, command, {
            expiresIn: 15 * 60,
        }) // expires in seconds
        return url
    }

    public async deleteFile(Key: string) {
        const command = new DeleteObjectCommand({
            Bucket: this.s3Bucket,
            Key,
        })

        try {
            const response = await this.client.send(command)
        } catch (err) {
            console.error(err)
        }
    }
}
