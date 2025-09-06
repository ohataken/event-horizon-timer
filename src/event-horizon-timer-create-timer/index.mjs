import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import crypto from 'crypto';

/**
 * event-horizon-timer-create-timer
 */
export async function handler(event) { // eslint-disable-line no-unused-vars
  const tableName = process.env.TIMERS_TABLE_NAME; // eslint-disable-line no-undef
  const dynamoDBClient = new DynamoDBClient({});
  const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

  try {
    const timerObject = {
      id: crypto.randomUUID(),
      client_ids: new Set(["sentinel"]),
      status: "stopped",
      target_time: 0,
      duration: 0,
      token: crypto.randomBytes(32).toString('hex'),
    };

    await dynamoDB.send(new PutCommand({
      TableName: tableName,
      Item: timerObject,
    }));

    return {
      statusCode: 201,
      body: JSON.stringify(timerObject),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Failed to create timer: ${error}` }),
    };
  }
}
