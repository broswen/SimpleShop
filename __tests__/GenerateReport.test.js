const { TestScheduler } = require('jest');
const GenerateReport = require('../src/lambdas/GenerateReport');


test('calculates total', async () => {
  const items = [
      {total: 100},
      {total: 100},
      {total: 100},
  ];
  const result = await GenerateReport.calculateTotal(items);
  expect(result).toEqual(300);
});

test('subtracts negatives for coupon', async () => {
  const items = [
      {total: 100},
      {total: 100},
      {total: -100},
  ];
  const result = await GenerateReport.calculateTotal(items);
  expect(result).toEqual(100);
});

test('item must have total', async () => {
  const items = [
      {price: 100},
      {total: 100},
      {total: -100},
  ];
  const result  = () => { GenerateReport.calculateTotal(items) };
  expect(result).toThrow();
});

