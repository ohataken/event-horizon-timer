import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export async function handler(event) {
  const id = event.queryStringParameters?.timer_id;
  const connectionId = event.requestContext.connectionId;
  const tableName = process.env.TIMERS_TABLE_NAME; // eslint-disable-line no-undef
  const dynamoDBClient = new DynamoDBClient({});
  const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

  if (!id) {
    return {
      statusCode: 400,
      body: "Missing timer_id",
    };
  }

  try {
    await dynamoDB.send(new UpdateCommand({
      TableName: tableName,
      Key: { id: id },
      UpdateExpression: "ADD client_ids :c",
      ExpressionAttributeValues: {
        ":c": new Set([connectionId])
      }
    }));

    return {
      statusCode: 200,
      body: "Connected"
    };
  } catch (error) { // eslint-disable-line no-unused-vars
    return {
      statusCode: 500,
      body: "Failed to connect"
    };
  }
}
