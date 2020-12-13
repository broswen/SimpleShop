'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const DDB = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async event => {

  const now = new Date();
  const date = now.toISOString().substring(0,10);

  //collect all orders from today
  // {id, shippinglabel, total}
  const params = {
    TableName: process.env.DATATABLE,
    IndexName: 'GSI1',
    KeyConditionExpression: '#k = :k',
    ExpressionAttributeNames: {'#k': `PK1`},
    ExpressionAttributeValues: {':k': `ORDER#${date}`},
  }
  let orders = [];
  let data;

  //TODO loop until next token is null to get all items
  // do {
    data = await DDB.query(params).promise();

    console.log(JSON.stringify(data));

    data.Items.forEach(item => {
      orders.push({id: item.PK, shippinglabel: item.shippinglabel, total: item.total});
    });
    
  // } while (data.LastEvaluatedKey);

  console.log(JSON.stringify(orders));

  //sum price
  const grandtotal = calculateTotal(orders);

  //generate report of items and total
  let report = `Daily Orders
${now}
-----------------------------------------------------------------------
`;

  orders.forEach(order => {
    report += `${order.id}, ${order.shippinglabel}, ${order.total}\n`
  });

  report += `GRAND TOTAL = ${grandtotal}`

  const key = `daily-report-${date}.txt`;

  const params2 = {
    Body: Buffer.from(report),
    Bucket: process.env.REPORTSBUCKET,
    Key: key
  }

  //upload to s3

  try {
    const response = await S3.putObject(params2).promise();
    console.log(`Upload complete: ${key}`);
  } catch (error) {
    throw error;
  }
  //pass name/key to next step

  return {date, key, emails: event.emails};
};

function calculateTotal(items) {
  const total = items.reduce((acc, curr) => acc + curr.total, 0);
  if(isNaN(total)) throw new Error("Total is NaN");
  return total;
}

module.exports.calculateTotal = calculateTotal;

