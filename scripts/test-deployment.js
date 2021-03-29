const AWS = require('aws-sdk');

async function test() {
  const region = process.argv[4].split(':')[3];
  console.log(region);
  const stepfunctions = new AWS.StepFunctions({
    region: region
  });
  const s3 = new AWS.S3();
  const currentDateTime = new Date().toISOString();
  const uniqueId = `testdeployment-${currentDateTime}`.replace(/[^a-zA-Z0-9]/g, "")
  const params = {
    stateMachineArn: process.argv[4],
    name: uniqueId,
    input: JSON.stringify(process.argv[5]),
  }
  
  const success = await stepfunctions.startExecution(params).promise();
  console.log(`Successfully executed stepfunction: ${success.executionArn}`);
  
  const npm_package_name = process.argv[2];
  const stage = process.argv[3];
  var param = {
    Bucket: `${npm_package_name}-${stage}-query-results`,
    Key: uniqueId
  };
  
  console.log("Waiting to get result of the query");
  await new Promise(resolve => setTimeout(resolve, 9000));

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
