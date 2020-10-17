import { CustomerService } from './customer.service';
import { CustomerPayload } from '../shared/customerPayload';
import Redis from 'ioredis'

describe('Should create a new User', () => {
  it('It must return a customer', () => {
    const customerService = new CustomerService(); 

    const customer = {
      customer_key: 1114,
      customer_name: 'John'
    }

    expect(customerService.createCustomer(customer as CustomerPayload)).toBeTruthy();
  })
});
