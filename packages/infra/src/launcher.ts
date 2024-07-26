import { App } from "aws-cdk-lib"
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { VpcStack } from "./stacks/VpcStack";

const app = new App();

const dataTable = new DataStack(app, 'DataStack')
const veepStack = new VpcStack(app, 'VpcStack')

new LambdaStack(app, 'LambdaStack', {
    vpc: veepStack.vpc,
    table: dataTable.table
})