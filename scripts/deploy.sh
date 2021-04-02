#!/bin/bash

if [ -z "$1" ]; then
  echo 'API query service name must be provided as first argument to this script'
  exit 1
fi

SERVICE_NAME=$1

sam deploy --template-file template.packaged.yaml \
  --stack-name "$SERVICE_NAME-${STAGE:-dev}" \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides Stage="${STAGE:-dev}" \
  GediDatabaseSnapshotIdentifier="$GEDI_DB_SNAPSHOT_ARN" \
  PermissionsBoundaryArn="$PERMISSIONS_BOUNDARY_ARN" \
  GediDatabaseHost="${SSM_GEDI_DB_HOST:-/dev/gedi-cal-val-db/host}" \
  GediDatabaseName="${SSM_GEDI_DB_NAME:-/dev/gedi-cal-val-db/name}" \
  GediDatabaseUser="${SSM_GEDI_DB_USER:-/dev/gedi-cal-val-db/user}" \
  GediDatabasePass="${SSM_GEDI_DB_PASS:-/dev/gedi-cal-val-db/pass}" \
  --no-fail-on-empty-changeset \
  --s3-bucket "$SERVICE_NAME-${STAGE:-dev}-deploy"
