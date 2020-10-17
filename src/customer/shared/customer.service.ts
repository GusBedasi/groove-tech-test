import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CustomerPayload } from './customerPayload'

import Redis from 'ioredis'
import axios from 'axios'
import { v4 as uuid } from 'uuid'

@Injectable()
export class CustomerService {
  
  private async getToken(): Promise<string>{

    const tokenResponse = await axios.post(process.env.GROOVE_API_URL + '/auth/login', {
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
    })

    return tokenResponse.data.token
  }

  async createCustomer(customerPayload: CustomerPayload) {
    //Request Validation
    if(!customerPayload.customer_key){
      throw new HttpException('No customer_key was provided', HttpStatus.BAD_REQUEST)
    }

    if(!customerPayload.customer_name){
      throw new HttpException('No customer_name was provided', HttpStatus.BAD_REQUEST)
    }

    //Get token
    const token = await this.getToken()

    //Create UUIDv4
    customerPayload.id = uuid()

    //Assing with Groove API
    const signatureResponse = await (await axios.post(`${process.env.GROOVE_API_URL}/sign`, {
      entity: {
        customer_key: customerPayload.customer_key,
        customer_name: customerPayload.customer_name
      }
    } ,{
      headers: { 'Authorization': `Bearer ${token}`}
    })).data.signature
    
    //Set signature to the object
    customerPayload.signature = signatureResponse;

    //SET in redis cache
    const redis = new Redis({ showFriendlyErrorStack: true })
    const cache = await redis.set(customerPayload.id, JSON.stringify(customerPayload))
    .then((response) => {
      return response
    })

    if(cache != 'OK'){
      throw new HttpException('No cache available', HttpStatus.INTERNAL_SERVER_ERROR)
    }

    //Return customer Payload and status code 201
    return customerPayload
  }

  async updateCustomer(id: string, customerPayload: CustomerPayload) {
    const redis = new Redis({ showFriendlyErrorStack: true })
    
    const token = await this.getToken()

    const signature = await ( await axios.post(`${process.env.GROOVE_API_URL}/sign`, {
      entity: {
        customer_key: customerPayload.customer_key,
        customer_name: customerPayload.customer_name
      }
    } ,{
      headers: { 'Authorization': `Bearer ${token}`}
    })).data.signature

    const customer = {
      id,
      customer_key: customerPayload.customer_key,
      customer_name: customerPayload.customer_name,
      signature
    }
    
    await redis.set(customer.id, JSON.stringify(customer))

    return customer;

  }

  async showCustomer(id: string): Promise<any>{
    const redis = new Redis({ showFriendlyErrorStack: true });
    const customerPayload = await redis.get(id);

    if(!customerPayload){
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    }

    return customerPayload;
  }
 
}
