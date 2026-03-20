import { Buffer } from 'node:buffer';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";

/**
 * event-horizon-timer-stop-timer
 * @param {Object} event event
 * @returns {Object} response
 */
export async function handler(event) {
  const id = event.pathParameters.id;
  const token = event.headers?.Authorization || event.headers?.authorization;
  const tableName = process.env.TIMERS_TABLE_NAME; // eslint-disable-line no-undef -- process
  const dynamoDBClient = new DynamoDBClient({});
  const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);
  const endpoint = process.env.WEBSOCKET_API_ENDPOINT; // eslint-disable-line no-undef -- process
  const apiGw = new ApiGatewayManagementApiClient({
    endpoint,
  });

  try {
    const timerResult = await dynamoDB.send(new GetCommand({
      TableName: tableName,
      Key: { id }
    }));

    if (!timerResult.Item) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ message: "Timer not found" })
      };
    }

    if (!token) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ message: "Authorization header is required" })
      };
    }

    if (token !== `Bearer ${timerResult.Item.token}`) {
      return {
        statusCode: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ message: "Invalid token" })
      };
    }

    const clientIds = Array.from(timerResult.Item.client_ids || new Set());

    const result = await dynamoDB.send(new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": "stopped",
      },
      ReturnValues: "ALL_NEW"
    }));

    const timerResponse = {
      id: result.Attributes.id,
      status: result.Attributes.status,
      target_time: result.Attributes.target_time, // eslint-disable-line camelcase -- target_time
      duration: result.Attributes.duration,
    };

    await Promise.all(clientIds.map(async (clientId) => {
      if (clientId === "sentinel") { return; }
      try {
        await apiGw.send(new PostToConnectionCommand({
          ConnectionId: clientId,
          Data: Buffer.from(JSON.stringify({ action: "stop_timer", timer: timerResponse }))
        }));
      } catch (err) {
        console.warn(`Failed to send message to client ${clientId}:`, err); // eslint-disable-line no-console, no-undef -- console
      }
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: "Timer stopped successfully",
        timer: timerResponse
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: `Failed to stop timer ${error}` })
    };
  }
}
