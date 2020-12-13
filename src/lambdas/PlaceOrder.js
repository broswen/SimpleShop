'use strict';

const KSUID = require('ksuid');
const AWS = require('aws-sdk');
const DDB = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async event => {

  const id = await KSUID.random();
  const now = new Date();
  const date = now.toISOString().substring(0,10);
  const total = event.order.items.reduce((acc, cur) => acc + (cur.price * cur.count), 0)
  //TODO send out of stock email and cancel order?
  try {

    const params = {
      TableName: process.env.DATATABLE,
      Item: {
        PK: `ORDER#${id.string}`,
        SK: `ORDER#${id.string}`,
        PK1: `ORDER#${date}`,
        SK1: `ORDER#${id.string}`,
        id: id.string,
        email: event.email,
        total: total
      }
    };

    await DDB.put(params).promise();


    for(let item of event.order.items) {
      const params2 = {
        TransactItems: [{
          Update: {
            TableName: process.env.DATATABLE,
            Key: {
              PK: `ITEM#${item.id}`,
              SK: `ITEM#${item.id}`
            },
            UpdateExpression: 'set #c = #c - :c',
            ConditionExpression: '#c >= :c',
            ExpressionAttributeNames: {'#c': 'count'},
            ExpressionAttributeValues: {
              ':c': item.count
            }
          }
        }, {
          Put: {
            TableName: process.env.DATATABLE,
            Item: {
              PK: `ORDER#${id.string}`,
              SK: `ITEM#${item.id}`,
              price: item.price,
              count: item.count,
              name: item.name
            }
          }
        }]
      };

      await DDB.transactWrite(params2).promise();
    }
    
  } catch (error) {
    throw error;
  }

  event.order.id = id.string;

  return {order: event.order};
};
