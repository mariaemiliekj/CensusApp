// dynamodbOperations.js

const dynamoDB = require('./dynamoDBConfig');

const getAllParticipants = async () => {
    const params = {
        TableName: process.env.CYCLIC_DB
    };

    try {
        const data = await dynamoDB.scan(params);
        return data.Items;
    } catch (error) {
        console.error('Error fetching participants from DynamoDB:', error);
        throw error;
    }
};

module.exports = {getAllParticipants};

