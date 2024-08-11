import { 
    ApiGatewayManagementApiClient, 
    PostToConnectionCommand, 
    GetConnectionCommand
} from "@aws-sdk/client-apigatewaymanagementapi"

import { Context, APIGatewayProxyEvent } from "aws-lambda";


export const handler = async function(event: APIGatewayProxyEvent, context: Context) {  

    let connectionInfo;
    let connectionId = event.requestContext.connectionId;
    
    const callbackAPI = new ApiGatewayManagementApiClient({
        apiVersion: '2018-11-29',
        endpoint: 'https://' + event.requestContext.domainName + '/' + event.requestContext.stage
    }); 

    try {
        connectionInfo = await callbackAPI.send(new GetConnectionCommand(
            {ConnectionId: event.requestContext.connectionId }
        ));
    } catch (e) {
        console.log(e);
    }
    
    connectionInfo.connectionID = connectionId;
    
    await callbackAPI.send(new PostToConnectionCommand(
        {ConnectionId: event.requestContext.connectionId,
        Data:
            'Use the sendmessage route to send a message. Your info:' +
            JSON.stringify(connectionInfo)}
    ));

    return {
        statusCode: 200,
    };
};