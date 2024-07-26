import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib'
import { AttributeType, ITable, Table } from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs'
import { getSuffixFromStack } from '../utils'


export class DataStack extends Stack {

    public readonly table: ITable

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        const suffix = getSuffixFromStack(this)

        this.table = new Table(this, 'repetition', {
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },
            tableName: `Repetition-${suffix}`
        })


        new CfnOutput(this, 'Table Arn ', { value: this.table.tableArn });

    }
}