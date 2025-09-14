import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import crypto from 'crypto';

/**
 * event-horizon-timer-create-timer
 * @param {Object} event event
 * @returns {Object} response
 */
export async function handler(event) { // eslint-disable-line no-unused-vars -- event
  const tableName = process.env.TIMERS_TABLE_NAME; // eslint-disable-line no-undef -- process
  const dynamoDBClient = new DynamoDBClient({});
  const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

  try {
    const timerObject = {
      id: crypto.randomUUID(),
      client_ids: new Set(["sentinel"]), // eslint-disable-line camelcase -- client_ids
      status: "stopped",
      target_time: 0, // eslint-disable-line camelcase -- target_time
      duration: 0,
      token: crypto.randomBytes(32).toString('hex'),
    };

    await dynamoDB.send(new PutCommand({
      TableName: tableName,
      Item: timerObject,
    }));

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        timer: {
          id: timerObject.id,
          status: timerObject.status,
          target_time: timerObject.target_time, // eslint-disable-line camelcase -- target_time
          duration: timerObject.duration,
          token: timerObject.token,
        },
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: `Failed to create timer: ${error}` }),
    };
  }
}
