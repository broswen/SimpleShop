'use strict';

const AWS = require('aws-sdk');
var SES = new AWS.SES();

module.exports.handler = async event => {

  //send email to order email with order id and shipping label
  const params = {
    Template: process.env.SHIPPEDTEMPLATE,
    TemplateData: JSON.stringify({id: event.order.id, shippinglabel: event.order.shippinglabel}),
    Destination: {
      ToAddresses: [event.order.email],
    },
    Source: process.env.FROMEMAIL
  };

  const code = await SES.sendTemplatedEmail(params).promise();
  console.log(code);

  return;
};
