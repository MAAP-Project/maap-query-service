# MAAP API Query Service

## Query Steps

1. Lookup Granule/Collection in CMR [lambda]
1. Detect backend [lambda]
1. Route to appropriate handler for that backend [step function choice state]
1. Run query [lambda]
1. Write output to S3 bucket
   - If failure, write error to S3 bucket

## Development

### SSM

In effort to avoid requiring that developers maintain a local copy of parameters for a Query Service environment, this project utilizes [AWS SSM Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) to manage such parameters.

To add a non-secret parameter:

```sh
aws ssm put-parameter --name /my/parameter --description "A parameter descripton" --type String --value "1234"
```

At time of writing, CloudFormation does not support `SecureString` SSM Parameters to be used as an environment variable.

To add a URL as a parameter:

```sh
aws ssm put-parameter --cli-input-json '{
  "Name": "/my/parameter",
  "Value": "http://myUrl.com",
  "Type": "String",
  "Description": "url"
}'
```

Alternatively, the web UI also supports URL values. See https://github.com/aws/aws-cli/issues/2507 for more information.

## Questions

- Should it be the Query Service or the MAAP API that accesses the CMR?
  - Query Service: This simplifies the complexity of message that the MAAP API needs to send
  - **MAAP API**: Can give realtime errors if Granule UR / Collection details are incorrect
    - Let's go with expecting full Granule or Collection arguments to be sent to the Step Function.
    - Gains:
      - Simplifies deployment requirements.
      - Avoids need to rebuild CMR client etc.
- If a query fails but the Step Function properly handles that failure, should the Step Function execution be marked as a failure?
