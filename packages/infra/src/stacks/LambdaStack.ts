import { Stack, StackProps, Duration, CfnOutput } from 'aws-cdk-lib'
import { 
    Code, 
    Function as LambdaFunction, 
    DockerImageFunction,
    Runtime, 
    FunctionUrlAuthType, 
    HttpMethod
} from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'
import { join } from 'path'
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';


interface LambdaStackInterface extends StackProps {
    vpc: ec2.IVpc,
    table: ITable
}

export class LambdaStack extends Stack {

    public readonly wsConnectLambda: NodejsFunction 
    public readonly wsDisconnectLambda: NodejsFunction
    public readonly sendMessageLambda: NodejsFunction 

    constructor(scope: Construct, id: string, props: LambdaStackInterface) {
        super(scope, id, props)
        const functionPath = join(__dirname, '..', '..','..', 'functions', 'src' )
        

        // const dfun = new DockerImageFunction(this, 'dockerRunner', {

        //     function_name:"ExampleDockerLambda",
        //     // # Use aws_cdk.aws_lambda.DockerImageCode.from_image_asset to build
        //     // # a docker image on deployment
        //     code: Code.fromAsset(functionPath)
        //     code: _lambda.DockerImageCode.from_image_asset(
        //         # Directory relative to where you execute cdk deploy
        //         # contains a Dockerfile with build instructions
        //         directory="cdk_docker_lambda/ExampleDockerLambda"
        //     ),
        // }
        // )

        // Lambda function to handle new connections
        this.wsConnectLambda = new NodejsFunction(this, 'ws-connect-lambda', {
            entry: `${functionPath}/sockets/connect.ts`,
            handler: 'handler',
            functionName: 'connect-lambda',
            runtime: Runtime.NODEJS_20_X,
        });

        // Lambda function to handle disconnections
        this.wsDisconnectLambda = new NodejsFunction( this, 'ws-disconnect-lambda', {
            entry:  `${functionPath}/sockets/disconnect.ts`,
            handler: 'handler',
            functionName: 'disconnect-lambda',
            runtime: Runtime.NODEJS_20_X,
        });

        // Lambda function to handle sending messages
        this.sendMessageLambda = new NodejsFunction(this, 'send-message-lambda', {
            entry: `${functionPath}/sockets/sendMessage.ts`,
            runtime: Runtime.NODEJS_20_X,
            functionName: 'send-message',
            handler: 'handler',
        });




        const TSCodeRunnerFunc = new NodejsFunction(this, 'CodeRunner-ts', {
            runtime: Runtime.NODEJS_20_X,
            handler: 'handler',
            entry: `${functionPath}/code-runner-ts.ts`,
            timeout: Duration.seconds(5),
            vpc: props.vpc,
            environment: {
                TABLE_NAME: props.table.tableName
            },
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC,
            },
            allowPublicSubnet: true
        })
        TSCodeRunnerFunc.addToRolePolicy( new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.table.tableArn],
            actions: [
               'dynamodb:PutItem',
            //    'dynamodb:Scan',
               'dynamodb:GetItem',
            //    'dynamodb:UpdateItem',
            //    'dynamodb:DeleteItem' 
            ]
        }))

        const lambdaUrlTS = TSCodeRunnerFunc.addFunctionUrl({
            authType: FunctionUrlAuthType.NONE,
            cors: {
                allowedMethods: [HttpMethod.POST],
                allowedOrigins: ["*"]
            }
        });




        // const codeRunnerFunction = new LambdaFunction(this, 'CodeRunner', {
        //     runtime: Runtime.NODEJS_20_X,
        //     handler: 'code-runner.handler',
        //     code: Code.fromAsset(functionPath),
        //     timeout: Duration.seconds(5),
        //     vpc: props.vpc,
        //     environment: {
        //         TABLE_NAME: props.table.tableName
        //     },
        //     vpcSubnets: {
        //         subnetType: ec2.SubnetType.PUBLIC,
        //     },
        //     allowPublicSubnet: true
        // })

        // console.log("the dynamo ARn", props.table.tableArn)

        // codeRunnerFunction.addToRolePolicy( new PolicyStatement({
        //     effect: Effect.ALLOW,
        //     resources: [props.table.tableArn],
        //     actions: [
        //        'dynamodb:PutItem',
        //        'dynamodb:Scan',
        //        'dynamodb:GetItem',
        //        'dynamodb:UpdateItem',
        //        'dynamodb:DeleteItem' 
        //     ]
        // }))

        // const lambdaUrl = codeRunnerFunction.addFunctionUrl({
        //     authType: FunctionUrlAuthType.NONE,
        //     cors: {
        //         allowedMethods: [HttpMethod.POST],
        //         allowedOrigins: ["*"]
        //     }
        // });

        // new CfnOutput(this, 'FunctionUrl ', { value: lambdaUrl.url });
        new CfnOutput(this, 'TSFunctionUrl ', { value: lambdaUrlTS.url });
        new CfnOutput(this, 'Table Arn ', { value: props.table.tableArn });

        // Create an EventBridge event bus
        const eventBus = new events.EventBus(this, 'CodeBus', {
            eventBusName: 'CodeRunnerBus',
        });
      
          // Create an EventBridge rule
        const rule = new events.Rule(this, 'CodeRunnerRule', {
            eventBus: eventBus,
            eventPattern: {
                source: ['my.source'],
                detailType: ['myDetailType'],
            },
        });
      
          // Add the Lambda function as a target of the rule
        rule.addTarget(new targets.LambdaFunction(TSCodeRunnerFunc));
      
          // Output the event bus ARN
        new CfnOutput(this, 'EventBusArn', {
            value: eventBus.eventBusArn,
        });

    }
}