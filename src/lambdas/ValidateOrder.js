'use strict';

const yup = require('yup');
const { array } = require('yup/lib/locale');

const orderSchema = yup.object().shape({
  email: yup.string().required().matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
  items: yup.array().of(
    yup.object({
      id: yup.string().required(),
      count: yup.number().integer().required(),
      price: yup.number().required(),
      name: yup.string().required()
    })
  )
});

module.exports.handler = async event => {

  /**
   * email : string
   * items : [ {id: string, count: int, price: float, name: string} ]
   */

  //validate email format
  //validate items format

  const isValid = await orderSchema.isValid(event)

  return {isValid, order: event};
};
