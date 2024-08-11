import { Stack, StackProps, Duration, CfnOutput } from 'aws-cdk-lib'
import * as apigw2 from 'aws-cdk-lib/aws-apigatewayv2'
import { WebSocketLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

import { Construct } from 'constructs'

interface ApiInterface extends StackProps {
    wsConnectLambda: NodejsFunction 
    wsDisconnectLambda: NodejsFunction
    sendMessageLambda: NodejsFunction
}


export class ApiStack extends Stack {

    constructor(scope: Construct, id: string, props?: ApiInterface ) {
        super(scope, id, props)
    
        // Create WebSocket API with connection/disconnection route integrations
        const webSocketApi = new apigw2.WebSocketApi(
            this,
            'repetition-websocket-api',
            {
                connectRouteOptions: {
                    integration: new WebSocketLambdaIntegration(
                        'ws-connect-integration',
                        props.wsConnectLambda
                    ),
                },
                disconnectRouteOptions: {
                    integration: new WebSocketLambdaIntegration(
                        'ws-disconnect-integration',
                        props.wsDisconnectLambda
                    ),
                },
            }
        );

        // Create API stage
        const apiStage = new apigw2.WebSocketStage(this, 'dev', {
            webSocketApi,
            stageName: 'dev',
            autoDeploy: true,
        });

        // Add the custom sendMessage route
        webSocketApi.addRoute('sendMessage', {
            integration: new WebSocketLambdaIntegration(
                'send-message-integration',
                props.sendMessageLambda
            ),
        });
    }

}


