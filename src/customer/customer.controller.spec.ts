import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './shared/customer.service';

describe('CustomerController', () => {
  let customerController: CustomerController;
  let customerService: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [CustomerService],
    }).compile();

    customerService = module.get<CustomerService>(CustomerService);
    customerController = module.get<CustomerController>(CustomerController);

  });

  it('should be defined', () => {
    expect(customerController).toBeDefined();
  });
});
