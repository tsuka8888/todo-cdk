const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "";

export const handler = async (event: any = {}): Promise<any> => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id: event.pathParameters.id },
  };

  try {
    const response = await db.get(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(response.Item),
      headers: { "Access-Control-Allow-Origin": "*" },
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
};
