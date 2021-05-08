import { APIGatewayProxyHandler } from "aws-lambda"

import { document } from "../utils/dynamodbClient"

export const handle: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters

  const response = await document.query({
    TableName: "users_certificates",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id" :id
    }
  }).promise()

  const userCertificate = response.Items[0]

  if(userCertificate){
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Certificado válido",
        name: userCertificate.name,
        url: `https://serverless-certificates-ignite.s3-sa-east-1.amazonaws.com/${id}.pdf`,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
  }

  return {
    statusCode: 400,
      body: JSON.stringify({
        message: "Certificado inválido",
      }),
      headers: {
        "Content-Type": "application/json"
      }
  }
}