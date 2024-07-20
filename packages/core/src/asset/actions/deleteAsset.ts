"use server";

import S3Component from "@repetition/core/lib/aws/S3Component";

export const deleteAsset = async (key: string) => {
  const s3 = new S3Component();
  const result = await s3.deleteFile(key);

  return result;
};
