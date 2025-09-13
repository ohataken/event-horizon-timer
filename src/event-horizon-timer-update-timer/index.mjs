import { Buffer } from 'node:buffer';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";

/**
 * event-horizon-timer-update-timer
 * @param {Object} event event
 * @returns {Object} response
 */
export async function handler(event) {
  const id = event.pathParameters.id;
  const body = JSON.parse(event.body);
  const tableName = process.env.TIMERS_TABLE_NAME; // eslint-disable-line no-undef -- process
  const dynamoDBClient = new DynamoDBClient({});
  const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);
  const endpoint = process.env.WEBSOCKET_API_ENDPOINT; // eslint-disable-line no-undef -- process

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

    if (body?.token && body.token !== timerResult.Item.token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid token" })
      };
    }

    const clientIds = Array.from(timerResult.Item.client_ids || new Set());

    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.entries(body).forEach(([key, value]) => {
      if (key !== 'id') { // idは更新しない
        updateExpression.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      }
    });

    if (updateExpression.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No valid attributes to update" })
      };
    }

    const result = await dynamoDB.send(new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW"
    }));

    await Promise.all(clientIds.map(async (clientId) => {
      if (clientId === "sentinel") { return; }
      try {
        const apiGw = new ApiGatewayManagementApiClient({
          endpoint,
        });

        await apiGw.send(new PostToConnectionCommand({
          ConnectionId: clientId,
          Data: Buffer.from(JSON.stringify({ action: "update_timer", timer: body }))
        }));
      } catch (err) {
        console.warn(`Failed to send message to client ${clientId}:`, err); // eslint-disable-line no-console, no-undef -- console
      }
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Timer updated successfully",
        timer: result.Attributes
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Failed to update timer ${error}` })
    };
  }
}
