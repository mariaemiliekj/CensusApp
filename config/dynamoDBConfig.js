// dynamoDBConfig.js

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const REGION = process.env.AWS_REGION;

const ddbClient = new DynamoDBClient({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN 
    }
});

const dynamoDB = DynamoDBDocumentClient.from(ddbClient);

module.exports = dynamoDB;
