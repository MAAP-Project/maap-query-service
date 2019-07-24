import "source-map-support/register";

import pgp from "pg-promise";
import { envPick } from "./lib/env";
import { saveAsyncResults } from "./lib/s3";

export default async ({ id, query }: payload.ExecutionInput) => {
  const {
    DB_HOST,
    DB_NAME,
    DB_USER,
    DB_PASS,
    QUERY_BUCKET,
    TABLE,
    X_FIELD,
    Y_FIELD,
  } = envPick(
    process.env,
    "DB_HOST",
    "DB_NAME",
    "DB_USER",
    "DB_PASS",
    "QUERY_BUCKET",
    "TABLE",
    "X_FIELD",
    "Y_FIELD",
  );
  const db = pgp()({
    database: DB_NAME,
    host: DB_HOST,
    password: DB_PASS,
    user: DB_USER,
  });

  const { fields = [], bbox = [] } = query;

  const sql = pgp.as.format(
    `SELECT ${
      fields.length
        ? "$1:name" /* Using :name should protect us from SQL-injection */
        : "*"
    }
      FROM ${TABLE}
  ${
    bbox.length
      ? // TODO: Support bbox values crossing 180th meridian
        `WHERE
          ${X_FIELD} >= $2 AND
          ${Y_FIELD} >= $3 AND
          ${X_FIELD} <= $4 AND
          ${Y_FIELD} <= $5`
      : ""
  }
  `,
    [fields, ...bbox],
  );

  console.log(sql);
  return db.any(sql).then(saveAsyncResults({ Bucket: QUERY_BUCKET, Key: id }));
};
