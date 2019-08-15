import "source-map-support/register";

import Pgp from "pg-promise";
import { envPick } from "./lib/env";
import { saveAsyncResults } from "./lib/s3";

const {
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASS,
  QUERY_BUCKET,
  TABLE,
  GEOM_COL,
} = envPick(
  process.env,
  "DB_HOST",
  "DB_NAME",
  "DB_USER",
  "DB_PASS",
  "QUERY_BUCKET",
  "TABLE",
  "GEOM_COL",
);
const pgp = Pgp();
const db = pgp({
  database: DB_NAME,
  host: DB_HOST,
  password: DB_PASS,
  user: DB_USER,
});

export default async ({ id, query }: payload.ExecutionInput) => {
  const { fields = [], bbox = [], where = {} } = query;

  let [whereStatements, whereValues] = Object.entries(where).reduce(
    ([statements, values], [k, v]) => [statements.concat(k), values.concat(v)],
    [[] as string[], [] as Array<string | number | boolean>],
  );
  whereStatements = whereStatements.map(field => `${field} = ?`);

  if (bbox.length) {
    whereStatements = [
      ...whereStatements,
      `ST_Intersects(ST_MakeEnvelope(?, ?, ?, ?, 4326), ${GEOM_COL})`,
    ];
    whereValues = [...whereValues, ...bbox];
  }

  let i = 1; // offset by 1 due to the the 'fields' parameter
  const sql = pgp.as.format(
    `
      SELECT ${
        fields.length
          ? "$1:name" /* Using :name should protect us from SQL-injection */
          : "*"
      }
      FROM ${TABLE}
      ${
        whereStatements.length
          ? `WHERE ${whereStatements
              .join(" AND ")
              .replace(/\?/g, m => `$${++i}`)}`
          : ""
      }
    `,
    [fields, ...whereValues],
  );

  console.log(sql);
  return db
    .any(sql)
    .then(JSON.stringify)
    .then(
      saveAsyncResults({
        Bucket: QUERY_BUCKET,
        ContentType: "application/json",
        Key: id,
      }),
    );
};
