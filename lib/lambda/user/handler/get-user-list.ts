const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "";

export const handler = async (event: any = {}): Promise<any> => {
  const params = {
    TableName: TABLE_NAME,
  };

  try {
    const response = await db.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(response.Items),
      headers: { "Access-Control-Allow-Origin": "*" },
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
};
