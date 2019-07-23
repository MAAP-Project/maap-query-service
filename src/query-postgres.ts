import "source-map-support/register";

import pgp from "pg-promise";
import { envPick } from "./lib/env";
import { saveAsyncResults } from "./lib/s3";

export default async ({ id, query }: payload.ExecutionInput) => {
  const { DB_HOST, DB_NAME, DB_USER, DB_PASS, QUERY_BUCKET } = envPick(
    process.env,
    "DB_HOST",
    "DB_NAME",
    "DB_USER",
    "DB_PASS",
    "QUERY_BUCKET",
  );
  const db = pgp()({
    database: DB_NAME,
    host: DB_HOST,
    password: DB_PASS,
    user: DB_USER,
  });

  const { fields = [], bbox = [] } = query;

  const sql = pgp.as.format(
    `SELECT ${fields.length ? "$1:name" : "*"}
      FROM gedi_insitu.usa_sonoma_treedata as tree
      JOIN gedi_insitu.usa_sonoma_plotdata as plot
      ON tree.plot = plot.plot
  ${
    bbox.length
      ? // TODO: Support bbox values crossing 180th meridian
        `WHERE
          longitude >= $2 AND
          latitude >= $3 AND
          longitude <= $4 AND
          latitude <= $5`
      : ""
  }
  `,
    [fields, ...bbox],
  );

  console.log(sql);
  return db.any(sql).then(saveAsyncResults({ Bucket: QUERY_BUCKET, Key: id }));
};
