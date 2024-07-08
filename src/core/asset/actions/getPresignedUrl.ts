import * as path from 'path';
import S3Component from '@/lib/aws/S3Component'
import { Resource } from "sst";

export const getUploadURL = async function(filename: string, prefix: string, contentType:string) {
    const randomID = Math.random() * 10000000;
    const ext = path.extname(filename);
    const name = path.parse(filename).name;
    const Key = `${prefix}/${name}-${randomID}${ext}`;
    // const Bucket = process.env.AWS_S3_UPLOAD_BUCKET;
    const Bucket = Resource.StoreUploads.name;
    
    if (!Bucket) {
        throw new Error("AWS_S3_UPLOAD_BUCKET is not set");
    }
    // const Bucket = Config.AWS_S3_UPLOAD_BUCKET;


    // Get signed URL from S3
    const s3Params = {
        Bucket,
        Key,
        Expires: 300,
        ContentType: contentType,
    
        // This ACL makes the uploaded object publicly readable. You must also uncomment
        // the extra permission for the Lambda function in the SAM template.
        ACL: 'public-read'
    }

    const S3 = new S3Component;


    let uploadUrl;
    try {
        uploadUrl = await S3.getSignedUrlPromise(s3Params);

    } catch(e:any) {
        console.error(e);
        throw new Error("Could not get signed URL from S3");
    }
    
    
    const signedData = {
        uploadUrl,
        Key: `https://${Bucket}.s3.ap-southeast-2.amazonaws.com/${Key}`
    }

    return signedData;
}
