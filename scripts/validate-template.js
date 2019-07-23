const { readFileSync } = require('fs');
const { yamlParse } = require('yaml-cfn');
const { parse } = require('jsonlint');

const cfn = yamlParse(readFileSync('./template.yaml'));
let exitCode = 0;

// Validate Step Functions
Object
  .entries(cfn.Resources)
  .filter(([, r]) => r.Type === 'AWS::StepFunctions::StateMachine')
  .map(([n, r]) => [n, r.Properties.DefinitionString['Fn::Sub'][0]])
  .map(([name, resource]) => {
    try {
      // Ensure that SF definition JSON object is valid
      parse(resource)
    } catch (err) {
      console.error(`Validation failed for '${name}':`);
      console.error(err.message);
      exitCode++;
    }
  })
;

process.exit(exitCode);
