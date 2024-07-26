
import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as ec2 from 'aws-cdk-lib/aws-ec2';


export class VpcStack extends Stack {

    public readonly vpc: ec2.IVpc

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        this.vpc = new ec2.Vpc(this, 'repetitionVPC', {
            ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
            // natGateways: 1,
            maxAzs: 1,
            subnetConfiguration: [
              {
                name: 'isolated-subnet-1',
                subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                cidrMask: 24,
              },
              {
                name: 'public-subnet-1',
                subnetType: ec2.SubnetType.PUBLIC,
                cidrMask: 24,
              },
            ],
        });

        const dynamoGatewayEndpoint = this.vpc.addGatewayEndpoint('dynamo-endpoint', {
          service: ec2.GatewayVpcEndpointAwsService.DYNAMODB

        });
    
        new CfnOutput(this, 'DynamoGatewayEndpoint ', { value: dynamoGatewayEndpoint.vpcEndpointId });
    
    }
}
