import { Context, APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {ApiGatewayManagementApiClient, PostToConnectionCommand} from "@aws-sdk/client-apigatewaymanagementapi"
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb"
// const {DynamoDBClient} = require("@aws-sdk/client-dynamodb")
// const {DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb")

// const {ApiGatewayManagementApiClient, PostToConnectionCommand} = require("@aws-sdk/client-apigatewaymanagementapi")


export const handler = async function(event: APIGatewayProxyEvent, context: Context) {  
    
    if (!event.body) { 
        return {
            statusCode: 500,
        };
    }

    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);
    const ddbcommand = new ScanCommand({
        TableName: process.env.TABLE_NAME
    })

    let connections;
    try { 
        connections = await docClient.send(ddbcommand);
    } catch (err) {
        console.log(err)
        return {
            statusCode: 500,
        };
    }

    const callbackAPI = new ApiGatewayManagementApiClient({
        apiVersion: '2018-11-29',
        endpoint: 'https://' + event.requestContext.domainName + '/' + event.requestContext.stage,
    });

 
    const message = JSON.parse(event.body).message;

    const sendMessages = connections.Items.map(async ({connectionId}:{connectionId: string}) => {
        if (connectionId !== event.requestContext.connectionId) {
            try {
                await callbackAPI.send(new PostToConnectionCommand(
                    { ConnectionId: connectionId, Data: message, }
                ));
            } catch (e) {
                console.log(e);
            }
        }
    });

    try {
        await Promise.all(sendMessages)
    } catch (e) {
        console.log(e);
        return {
            statusCode: 500,
        };
    }

    return{statusCode: 200};
};