import { S3 } from "aws-sdk";
import { PutObjectRequest } from "aws-sdk/clients/s3";

const s3 = new S3();

export const saveResults = (
  props: PutObjectRequest & Required<Pick<PutObjectRequest, "Body">>,
) => s3.putObject(props).promise();
