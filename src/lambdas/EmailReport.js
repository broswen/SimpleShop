'use strict';

const AWS = require('aws-sdk');
const SES = new AWS.SES();

module.exports.handler = async event => {

  const params = {
    Template: process.env.REPORTTEMPLATE,
    TemplateData: JSON.stringify({date: event.date, key: event.key}),
    Destination: {
      ToAddresses: event.emails,
    },
    Source: process.env.FROMEMAIL
  };

  const code = await SES.sendTemplatedEmail(params).promise();
  console.log(code);

  return event;
};

