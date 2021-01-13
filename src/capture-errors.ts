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
    Body: JSON.stringify({
      error: Error,
      failed: true,
      msg: Cause,
    }),
    Bucket: envPick(process.env, "QUERY_BUCKET").QUERY_BUCKET,
    ContentType: 'application/json',
    Key: id,
    Metadata: {
      failed: "1",
    },
  });
