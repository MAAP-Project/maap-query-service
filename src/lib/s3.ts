import { S3 } from "aws-sdk";
import { PutObjectRequest } from "aws-sdk/clients/s3";

const s3 = new S3();

export const saveResults = ({
  ContentType,
  Body,
  ...s3Options
}: WriteOptionsWithData) =>
  s3
    .putObject({
      ...s3Options,
      Body,
      ContentType,
    })
    .promise();

// Higher-order function is useful for creating a handler for a promise result.
export const saveAsyncResults = (opts: WriteOptions) => (
  Body: RequiredBody["Body"],
) =>
  saveResults({
    ...opts,
    Body,
  });

interface RequiredContentType {
  ContentType: Required<PutObjectRequest>["ContentType"];
}
interface RequiredBody {
  Body: Required<PutObjectRequest>["Body"];
}
type WriteOptions = PutObjectRequest & RequiredContentType;
type WriteOptionsWithData = WriteOptions & RequiredBody;
