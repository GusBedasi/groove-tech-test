import { CustomerPayload } from './customerPayload';

describe('Customer', () => {
  it('should be defined', () => {
    expect(new CustomerPayload()).toBeDefined();
  });
});
