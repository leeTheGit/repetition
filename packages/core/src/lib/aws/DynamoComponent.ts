import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand} from '@aws-sdk/lib-dynamodb'

export default class DynamoComponent {

    private client;
    private docClient;
    private tableName;

    constructor() {
        this.client = new DynamoDBClient({ region: "ap-southeast-2" });
        this.docClient = DynamoDBDocumentClient.from(this.client)
        this.tableName = process.env.TABLE_NAME
    }

    async getItem(id: string) {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: {
                'id': id 
            }
        })
        const response = await this.docClient.send(command)
        if (!response.Item) {
            return {
                error: "Item missing"
            }
        }

        return response.Item
    }


    async putItem(data:any) {
        const saveData = {
            TableName: this.tableName,
            Item: data
        }
        const saveCommand = new PutCommand(saveData)
        const save = await this.docClient.send( saveCommand )
        return save;
    }
}