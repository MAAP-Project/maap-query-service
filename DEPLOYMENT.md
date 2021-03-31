# MAAP API Query Service Deployment
### Steps
1. Clone the repo
2. Install `aws sam cli`:
    ``` 
    brew tap aws/tap
    brew install aws-sam-cli
    ```
3. Install the dependencies:
    ```
    npm install
4. Create `ssm` parameters for the database credentials (`host`, `name`, `username`, `password`). Read: [readme](https://github.com/MAAP-Project/maap-api-query-service#ssm).
5. Set the environment variables
    ```
    `STAGE` (default: `dev`)
    `NODE_ENV` (default: `production`)
    `SSM_GEDI_DB_HOST` (default: `/dev/gedi-cal-val-db/host`)
    `SSM_GEDI_DB_NAME` (default: `/dev/gedi-cal-val-db/name`)
    `SSM_GEDI_DB_USER` (default: `/dev/gedi-cal-val-db/user`)
    `SSM_GEDI_DB_PASS` (default: `/dev/gedi-cal-val-db/pass`)
    ```
6. Run full deployment (builds, packages and deploys)
    ```
    npm run full-deploy
    ```

### Testing the deployment
1. Copy the `QueryStateMachineArn Value` from the above step. Looks like 
   ```
   arn:aws:states:us-east-1:XXXXXXXXXXXX:stateMachine:maap-api-query-service-dev-RunQuery
   ```
2. Run:
   ```
    npm run test-deployment <QueryStateMachineArn>
    ```

#### Note:
The test script `/scripts/test-deployment.js` uses the following input for the step function:
```
{
  "id": <Programatically generated uniqueId>,
  "src": {
    "Collection": {
      "ShortName": "GEDI Cal/Val Field Data_1",
      "VersionId": "001"
    }
  },
  "query": {
    "where": {
      "project": "usa_sonoma"
    },
    "bbox": [
      -122.6,
      38.4,
      -122.5,
      38.5
    ],
    "fields": ["project", "latitude", "longitude"],
    "table":"tree"
  }
}
```
The output looks something like:
```
[
  {
    project: 'usa_sonoma',
    latitude: 38.4673410250767,
    longitude: -122.560555589317
  },
  {
    project: 'usa_sonoma',
    latitude: 38.4643964460817,
    longitude: -122.570924053867
  },
  ...
]
```
