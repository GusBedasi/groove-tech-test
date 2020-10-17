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

  private async setToCache(id: string, payload: CustomerPayload): Promise<string> {
    const redis = new Redis({ showFriendlyErrorStack: true })
    const cache = await redis.set(id, JSON.stringify(payload))
    return cache
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
    const cache = await this.setToCache(customerPayload.id, customerPayload)

    if(cache != 'OK'){
      throw new HttpException('No cache available', HttpStatus.INTERNAL_SERVER_ERROR)
    }

    //Return customer Payload and status code 201
    return customerPayload
  }

  async updateCustomer(id: string, customerPayload: CustomerPayload) {
    const token = await this.getToken()

    await this.showCustomer(id)

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
    
    await this.setToCache(customer.id, customer)

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
