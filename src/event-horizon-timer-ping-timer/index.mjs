import { Buffer } from 'node:buffer';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";

/**
 * event-horizon-timer-ping-timer
 * @param {Object} event event
 * @returns {Object} response
 */
export async function handler(event) {
  const id = event.pathParameters.id;
  const tableName = process.env.TIMERS_TABLE_NAME; // eslint-disable-line no-undef -- process
  const dynamoDBClient = new DynamoDBClient({});
  const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);
  const endpoint = process.env.WEBSOCKET_API_ENDPOINT; // eslint-disable-line no-undef -- process

  try {
    const timerResult = await dynamoDB.send(new GetCommand({
      TableName: tableName,
      Key: { id },
    }));

    if (!timerResult.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Timer not found" })
      };
    }

    const clientIds = Array.from(timerResult.Item.client_ids || new Set());

    await Promise.all(clientIds.map(async (clientId) => {
      if (clientId === "sentinel") { return; }
      try {
        const apiGw = new ApiGatewayManagementApiClient({
          endpoint: endpoint,
        });

        await apiGw.send(new PostToConnectionCommand({
          ConnectionId: clientId,
          Data: Buffer.from(JSON.stringify({ action: "ping", timestamp: new Date().getTime() }))
        }));
      } catch (err) {
        console.warn(`Failed to send message to client ${clientId}:`, err); // eslint-disable-line no-console, no-undef -- console
      }
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "ping",
        timestamp: new Date().getTime(),
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Failed to ping timer ${error}` })
    };
  }
}
