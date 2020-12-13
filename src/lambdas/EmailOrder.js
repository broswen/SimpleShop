'use strict';

const AWS = require('aws-sdk');
const SES = new AWS.SES();

module.exports.handler = async event => {
  //send email to order email with order id

  const params = {
    Template: process.env.ORDERTEMPLATE,
    TemplateData: JSON.stringify({id: event.order.id}),
    Destination: {
      ToAddresses: [event.order.email],
    },
    Source: process.env.FROMEMAIL
  };

  const code = await SES.sendTemplatedEmail(params).promise();
  console.log(code);

  return {order: event.order};
};
