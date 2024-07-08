import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'
import { Resource } from 'sst'

export class SnsComponent {
    private client: SNSClient
    private topicArn: string

    constructor() {
        const secretAccessKey = Resource.AwsSecretAccessKey.value
        const awsAccessKeyId = Resource.AwsKeyId.value
        // const awsRegion = Resource.AwsRegion.value

        // const AWS_KEY_ID = process.env.AWS_KEY_ID;
        // const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

        if (!awsAccessKeyId || !secretAccessKey) {
            throw new Error(
                'AWS_KEY_ID or AWS_SECRET_ACCESS_KEY not found in environment'
            )
        }

        this.client = new SNSClient({
            region: 'ap-southeast-2',
            credentials: {
                accessKeyId: awsAccessKeyId,
                secretAccessKey: secretAccessKey,
            },
        })

        this.topicArn = process.env.AWS_SNS_TOPIC as string
    }

    public setTopicArn(topic: string): void {
        this.topicArn = topic
    }

    sendSuccess = async (success: any) => {
        return await this.publish(JSON.stringify(success))
    }

    sendError = async (error: any) => {
        return await this.publish(JSON.stringify(error))
    }

    private async publish(message: string) {
        const command = new PublishCommand({
            TopicArn: this.topicArn,
            Message: message,
        })
        const response = await this.client.send(command)
    }
}
