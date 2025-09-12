import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

/**
 * event-horizon-timer-delete-connection
 * @param {Object} event event
 * @returns {Object} response
 */
export async function handler(event) {
  const connectionId = event.requestContext.connectionId;
  const tableName = process.env.TIMERS_TABLE_NAME; // eslint-disable-line no-undef
  const connectionTableName = process.env.CONNECTIONS_TABLE_NAME; // eslint-disable-line no-undef
  const dynamoDBClient = new DynamoDBClient({});
  const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

  try {
    const connectionResult = await dynamoDB.send(new GetCommand({
      TableName: connectionTableName,
      Key: { id: connectionId },
    }));

    await dynamoDB.send(new UpdateCommand({
      TableName: tableName,
      Key: { id: connectionResult.Item.timer_id },
      UpdateExpression: "DELETE client_ids :c",
      ExpressionAttributeValues: {
        ":c": new Set([connectionId])
      }
    }));

    await dynamoDB.send(new DeleteCommand({
      TableName: connectionTableName,
      Key: { id: connectionId },
    }));

    return {
      statusCode: 200,
      body: "Connected",
    };
  } catch (error) { // eslint-disable-line no-unused-vars
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Failed to delete connection ${error}` })
    };
  }
}
