const AWS = require('aws-sdk');

// Command: node test-deployment [npm_package_name] [stage] [state_machine_arn]
/*
  Tests the deployment by running the created statemachine with a arbitrary input
  The input is: 
  {
    "id": <programatically generated uniqueId>,
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
*/
async function test() {
  const region = process.argv[4].split(':')[3]; // Extracts the region from the stepfunction arn
  const stepfunctions = new AWS.StepFunctions({
    region: region
  });
  const s3 = new AWS.S3();
  const currentDateTime = new Date().toISOString();
  const uniqueId = `testdeployment-${currentDateTime}`.replace(/[^a-zA-Z0-9]/g, "")
  const params = {
    stateMachineArn: process.argv[4],
    name: uniqueId,
    input: JSON.stringify({
      "id": uniqueId,
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
    }),
  }
  
  const success = await stepfunctions.startExecution(params).promise();
  console.log(`Successfully executed stepfunction: ${success.executionArn}`);
  
  const npm_package_name = process.argv[2];
  const stage = process.argv[3];
  var param = {
    Bucket: `${npm_package_name}-${stage}-query-results`,
    Key: uniqueId
  };
  
  // Waits some time to allow the result to be written to the s3 bucket
  console.log("Waiting to get result of the query");
  await new Promise(resolve => setTimeout(resolve, 9000));

  // Reads the result from the QueryResults s3 bucket
  s3.getObject(param, function(err, data)
  {
    if (!err)
      console.log(JSON.parse(data.Body.toString()));
    else {
      console.log('Error while reading output')
    }
  });
}

try {
  test();
} catch (e) {
  console.log(e.message);
}
