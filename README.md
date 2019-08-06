# MAAP API Query Service

## Query Steps

1. Detect backend [lambda]
1. Route to appropriate handler for that backend [step function choice state]
1. Run query [lambda]
1. Write output to S3 bucket
   - If failure, write error to S3 bucket

## Message Format

In [JSON Schema]();

```json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "src": {
      "type": "object",
      "Collection": {
        "description": "Collection object",
        "type": "object",
        "properties": {
          "ShortName": { "type": "string" },
          "Version": { "type": "string" }
        }
      }
    },
    "query": {
      "type": "object",
      "properties": {
        "fields": {
          "description": "Fields to be returned from dataset. If omitted, all fields will be returned",
          "type": "array",
          "items": { "type": "array" }
        },
        "bbox": {
          "description": "A GeoJSON-compliant 2D bounding box (https://tools.ietf.org/html/rfc7946#section-5)",
          "type": "array",
          "items": [
            { "type": "number", "description": "X Min" },
            { "type": "number", "description": "Y Min" },
            { "type": "number", "description": "X Max" },
            { "type": "number", "description": "Y Max" }
          ]
        }
      }
    }
  },
  "required": ["id", "src", "query"]
}
```

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
