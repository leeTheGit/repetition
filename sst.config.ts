/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
    app(input) {
        return {
            name: 'repetition',
            removal: input?.stage === 'production' ? 'retain' : 'remove',
            home: 'aws',
        }
    },

    async run() {
        const name = $app.name
        const stage = $app.stage

        const databaseDSN = new sst.Secret('DatabaseDSN')
        const awsAccessSecret = new sst.Secret('AwsSecretAccessKey')
        const awsKeyId = new sst.Secret('AwsKeyId')
        const awsReggion = new sst.Secret('AwsRegion')
        const resendApiKey = new sst.Secret('ResendApiKey')
        const AppKey = new sst.Secret('AppKey')
        const GithubClientId = new sst.Secret('GithubClientId')
        const GithubClientSecret = new sst.Secret('GithubClientSecret')
        const GoogleClientId = new sst.Secret('GoogleClientId')
        const GoogleClientSecret = new sst.Secret('GoogleClientSecret') 
        
        const bucket = new sst.aws.Bucket(`StoreUploads`, {
            public: true,
        })

        // // Configure ownership controls for the new S3 bucket
        // const ownershipControls = new aws.s3.BucketOwnershipControls("OwnershipControls", {
        //     bucket: sbucket.bucket,
        //     rule: {
        //         objectOwnership: "ObjectWriter",
        //     },
        // });

        // // Configure public ACL block on the new S3 bucket
        // const publicAccessBlock = new aws.s3.BucketPublicAccessBlock("PublicAccessBlock", {
        //     bucket: sbucket.bucket,
        //     blockPublicAcls: false,
        // });

        new sst.aws.Nextjs('Repetition', {
            // openNextVersion: "3.0.0-rc.16",
            openNextVersion: '3.0.1',
            link: [
                AppKey,
                GoogleClientSecret,
                GoogleClientId,
                GithubClientId,
                GithubClientSecret,
                databaseDSN,
                bucket,
                awsAccessSecret,
                awsKeyId,
                awsReggion,
                resendApiKey,
            ],
            environment: {
                PLATFORM_DOMAIN: process.env.PLATFORM_DOMAIN || 'elcyen.com',

                // DATABASE_URL: process.env.DATABASE_URL || '',
                // AWS_S3_UPLOAD_BUCKET: process.env.AWS_S3_UPLOAD_BUCKET || "",
                // AWS_KEY_ID: process.env.AWS_KEY_ID || "",
                // zAWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || process.env.zAWS_SECRET_ACCESS_KEY || "",
                // zAWS_REGION: process.env.AWS_REGION || process.env.zAWS_REGION || "",

                // RESEND_API_KEY: process.env.RESEND_API_KEY || '',
                // STRIPE_API_KEY: process.env.STRIPE_API_KEY || '',

                // Accessible in the browser
                // VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_123',
            },
        })
    },
})
