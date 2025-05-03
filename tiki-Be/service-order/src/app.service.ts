import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';



@Injectable()

export class AppService {
  constructor(private prismaService: PrismaService,
     @Inject('SHIPPING_NAME') private shippingService: ClientProxy,
      @Inject('EMAIL_NAME') private emailService: ClientProxy,
   
  ) {}
  private readonly config = {
    appid: '553',
    key1: '9phuAOYhan4urywHTh0ndEXiV3pKHr5Q',
    key2: 'Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3',
    endpoint: 'https://sandbox.zalopay.com.vn/v001/tpe/createorder',
  };

 
 async createOrder(data) {
   

  try {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        status: 400,
        message: 'Dữ liệu không hợp lệ: Mảng không được để trống',
      };
    }
    const res = await this.prismaService.orders.createMany({
      data
    })
    console.log(res)
    return {
      status:200,
      menusage:'success',
      data:data
      
    }
  } catch (error) {
    
    return {
      status:500,
      menusage:'failed to create order',
    }
  }
  
   
  }
  async getOrder(data){
    return this.prismaService.orders.findFirst({
      where:{
        id_user:data
      }
    })
  }

 
}
