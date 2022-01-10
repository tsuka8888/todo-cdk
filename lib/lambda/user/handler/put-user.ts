const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "";

export const handler = async (event: any = {}): Promise<any> => {
  const id = event.pathParameters.id;
  const body = JSON.parse(event.body);
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    Item: {
      name: body.name,
    },
  };

  try {
    const response = await db.put(params).promise();
    
    return {
      statusCode: 200,
      body: JSON.stringify(response.Item),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
};
