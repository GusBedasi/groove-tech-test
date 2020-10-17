import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from '../shared/customer.service';

describe('CustomerService', () => {
  let customerService: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerService]
    }).compile();

    customerService = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(customerService).toBeDefined();
  });
});
