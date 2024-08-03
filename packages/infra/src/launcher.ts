import { App } from "aws-cdk-lib"
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { VpcStack } from "./stacks/VpcStack";
import { S3Stack } from "./stacks/S3Stack";

const app = new App();

const dataTable = new DataStack(app, 'DataStack')
const veepStack = new VpcStack(app, 'VpcStack')
const s3Stack = new S3Stack(app, 's3Stack')

new LambdaStack(app, 'LambdaStack', {
    vpc: veepStack.vpc,
    table: dataTable.table
})