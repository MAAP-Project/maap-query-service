import "source-map-support/register";

import { envPick } from "./lib/env";
import { saveResults } from "./lib/s3";

export interface Input {
  id: string;
}
export default async ({ id, ...metadata }: Input) =>
  saveResults({
    Bucket: envPick(process.env, "QUERY_BUCKET").QUERY_BUCKET,
    Key: `${id}.meta`,
    data: {
      ...metadata,
      id,
    },
  });
