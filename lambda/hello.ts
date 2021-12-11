exports.handler = async function (event: any) {
  const path = event.path;

  const query = event.queryStringParameters;
  console.log('request:', JSON.stringify(event, undefined, 2));
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, CDK! You've hit ${path}`,
      query,
    }),
  };
};
