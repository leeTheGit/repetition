import { Stack, StackProps, CfnOutput, Duration, RemovalPolicy, Fn } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';



export class S3Stack extends Stack {

    public readonly bucket: s3.Bucket
    private stackSuffix: string;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        this.intializeSuffix()

        const s3Bucket = new s3.Bucket(this, 'repetition-uploads', {
            bucketName: `repetition-uploads-${this.stackSuffix}`,
            // removalPolicy: RemovalPolicy.DESTROY,
            // autoDeleteObjects: true,
            publicReadAccess: true,
            blockPublicAccess: {
                blockPublicAcls: false,
                blockPublicPolicy: false,
                ignorePublicAcls: false,
                restrictPublicBuckets: false,
            },
            // encryption: s3.BucketEncryption.S3_MANAGED,
            cors: [
              {
                allowedMethods: [
                  s3.HttpMethods.GET,
                  s3.HttpMethods.POST,
                  s3.HttpMethods.PUT,
                  s3.HttpMethods.HEAD
                ],
                allowedOrigins: ['*'],
                allowedHeaders: ['*'],
              },
            ],
            // lifecycleRules: [
            //   {
            //     abortIncompleteMultipartUploadAfter: Duration.days(90),
            //     expiration: Duration.days(365),
            //     transitions: [
            //       {
            //         storageClass: s3.StorageClass.INFREQUENT_ACCESS,
            //         transitionAfter: Duration.days(30),
            //       },
            //     ],
            //   },
            // ],
        });
      
          // 👇 grant access to bucket
        s3Bucket.grantRead(new iam.AccountRootPrincipal());
        new CfnOutput(this, 's3BucketArn ', { value: s3Bucket.bucketArn });

    }

    private intializeSuffix() {
        const shortStackId = Fn.select(2, Fn.split('/', this.stackId))
        this.stackSuffix = Fn.select(4, Fn.split('-', shortStackId))
    }

}