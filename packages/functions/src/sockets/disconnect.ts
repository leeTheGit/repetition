
import { Context, APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb"


export const handler = async function(event: APIGatewayProxyEvent, context: Context) {
      
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);
    const command = new DeleteCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
            connectionId: event.requestContext.connectionId,
        },
    });
      
    try {
        await docClient.send(command)
    } catch (err) {
        console.log(err)
        return {
            statusCode: 500
        };
    }
    
    return {
        statusCode: 200,
    };
}