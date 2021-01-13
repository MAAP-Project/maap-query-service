import Pgp from "pg-promise";
import "source-map-support/register";
import { envPick } from "./lib/env";
import { saveResults } from "./lib/s3";

const {
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASS,
  QUERY_BUCKET,
  TREE_TABLE,
  PLOT_TABLE,
  GEOM_COL,
} = envPick(
  process.env,
  "DB_HOST",
  "DB_NAME",
  "DB_USER",
  "DB_PASS",
  "QUERY_BUCKET",
  "TREE_TABLE",
  "PLOT_TABLE",
  "GEOM_COL",
);
const pgp = Pgp();
const db = pgp({
  database: DB_NAME,
  host: DB_HOST,
  password: DB_PASS,
  user: DB_USER,
});

const tableLookup: Record<string, string> = {
  plot: PLOT_TABLE,
  tree: TREE_TABLE,
};

export default async ({ id, query }: payload.ExecutionInput) => {
  const { fields = [], bbox = [], where = {}, table = "" } = query;

  const queryTable = tableLookup[table];
  if (!queryTable) {
    throw new Error(`Unsupported table: ${table || "null"}`);
  }

  let [whereStatements, whereValues] = Object.entries(where).reduce(
    ([statements, values], [k, v]) => [statements.concat(k), values.concat(v)],
    [[] as string[], [] as Array<string | number | boolean>],
  );
  whereStatements = whereStatements.map((field) => `${field} = ?`);

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
      FROM ${queryTable}
      ${
        whereStatements.length
          ? `WHERE ${whereStatements
              .join(" AND ")
              .replace(/\?/g, (m) => `$${++i}`)}`
          : ""
      }
    `,
    [fields, ...whereValues],
  );
  console.log(sql);
  const results = await db.any(sql);
  return saveResults({
    Body: JSON.stringify(results),
    Bucket: QUERY_BUCKET,
    Key: id,
  });
};
