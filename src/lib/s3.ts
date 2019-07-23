import { S3 } from "aws-sdk";
import { PutObjectRequest } from "aws-sdk/clients/s3";

const s3 = new S3();

export const saveResults = ({
  json = true,
  data,
  ...s3Options
}: WriteOptionsWithData) =>
  s3
    .putObject({
      Body: json ? JSON.stringify(data) : data,
      ContentType: json ? "application/json" : "text/plain",
      ...s3Options,
    })
    .promise();

export const saveAsyncResults = ({ ...opts }: WriteOptions) => (data: any) =>
  saveResults({
    data,
    ...opts,
  });

interface Json {
  json?: boolean;
}
type WriteOptions = Json & PutObjectRequest;
type WriteOptionsWithData = WriteOptions & { data: any };
