const { TestScheduler } = require('jest');
const ValidateOrder = require('../src/lambdas/ValidateOrder');

test('valid order', async () => {
  const order = {
    email: "test@test.com",
    items: [
      {id: "123", name: "test", price: 120.00, count: 2},
      {id: "123", name: "test", price: 120.00, count: 2},
      {id: "123", name: "test", price: 120.00, count: 2}
    ]
  };

  const order2 = {
    order: {
      email: "test@test.com",
      items: [
        {id: "123", name: "test", price: 120.00, count: 2},
        {id: "123", name: "test", price: 120.00, count: 2},
        {id: "123", name: "test", price: 120.00, count: 2}
      ]
    },
    isValid: true
  };
  const result = await ValidateOrder.handler(order);
  expect(result).toEqual(order2);
});

test('email is required', async () => {
  const order = {
    items: [
      {id: "123", name: "test", price: 120.00, count: 2},
      {id: "123", name: "test", price: 120.00, count: 2},
      {id: "123", name: "test", price: 120.00, count: 2}
    ]
  };

  const order2 = {
    order: {
      items: [
        {id: "123", name: "test", price: 120.00, count: 2},
        {id: "123", name: "test", price: 120.00, count: 2},
        {id: "123", name: "test", price: 120.00, count: 2}
      ]
    },
    isValid: false
  };
  const result = await ValidateOrder.handler(order);
  expect(result).toEqual(order2);
});

test('count is required', async () => {
  const order = {
    email: "test@test.com",
    items: [
      {id: "123", name: "test", price: 120.00},
      {id: "123", name: "test", price: 120.00, count: 2},
      {id: "123", name: "test", price: 120.00, count: 2}
    ]
  };

  const order2 = {
    order: {
      email: "test@test.com",
      items: [
        {id: "123", name: "test", price: 120.00},
        {id: "123", name: "test", price: 120.00, count: 2},
        {id: "123", name: "test", price: 120.00, count: 2}
      ]
    },
    isValid: false
  };
  const result = await ValidateOrder.handler(order);
  expect(result).toEqual(order2);
});