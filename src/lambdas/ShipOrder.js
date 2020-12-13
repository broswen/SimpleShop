'use strict';

const KSUID = require('ksuid');
const AWS = require('aws-sdk');
const DDB = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async event => {

  //generate shipping label
  const shippinglabel = await KSUID.random();

  const params = {
    TableName: process.env.DATATABLE,
    Key: { PK: `ORDER#${event.order.id}`, SK: `ORDER#${event.order.id}`},
    UpdateExpression: 'set #s = :s',
    ConditionExpression: 'attribute_not_exists(#s)',
    ExpressionAttributeNames: {'#s': 'shippinglabel'},
    ExpressionAttributeValues: {':s': shippinglabel.string},
  };

  //update order item
  try {
    let result = await DDB.update(params).promise();
  } catch (error) {
    throw error;
  }

  event.order.shippinglabel = shippinglabel.string;

  return {order: event.order};
};
