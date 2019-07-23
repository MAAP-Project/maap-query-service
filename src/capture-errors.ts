import "source-map-support/register";
import { envPick } from "./lib/env";
import { saveResults } from "./lib/s3";

export interface Input {
  id: string;
  error: {
    Error: string;
    Cause: string;
  };
}
export default async ({ id, error: { Error, Cause } }: Input) =>
  saveResults({
    Bucket: envPick(process.env, "QUERY_BUCKET").QUERY_BUCKET,
    Key: id,
    Metadata: {
      failed: "1",
    },
    data: {
      error: Error,
      failed: true,
      msg: Cause,
    },
  });
