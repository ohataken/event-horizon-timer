import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

/**
 * event-horizon-timer-get-timer
 * @param {Object} event event
 * @returns {Object} response
 */
export async function handler(event) {
  const id = event.pathParameters.id;
  const tableName = process.env.TIMERS_TABLE_NAME; // eslint-disable-line no-undef
  const dynamoDBClient = new DynamoDBClient({});
  const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

  try {
    const timerResult = await dynamoDB.send(new GetCommand({
      TableName: tableName,
      Key: { id }
    }));

    if (!timerResult.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Timer not found" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        timer: {
          id: timerResult.Item.id,
          // client_ids: Array.from(timerResult.Item.client_ids || new Set()), // do not response.
          status: timerResult.Item.status,
          target_time: timerResult.Item.target_time,
          duration: timerResult.Item.duration,
          // token: timerResult.Item.token, // do not response.
        },
      }),
    };
  } catch (error) { // eslint-disable-line no-unused-vars
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to update timer" }),
    };
  }
}
