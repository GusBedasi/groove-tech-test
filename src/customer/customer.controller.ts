import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CustomerService } from './shared/customer.service';
import { CustomerPayload } from './shared/customerPayload';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {

  }

  @Post()
  async createCustomer(@Body() customer: CustomerPayload): Promise<CustomerPayload> {
    return this.customerService.createCustomer(customer)
  }

  @Put(':id')
  async updateCustomer(@Param('id') id: string, @Body() customer: CustomerPayload): Promise<CustomerPayload>{
    return this.customerService.updateCustomer(id, customer)
  }

  @Get(':id')
  async showCustomer(@Param('id') id: string): Promise<CustomerPayload> {
    return this.customerService.showCustomer(id);
  }

}
