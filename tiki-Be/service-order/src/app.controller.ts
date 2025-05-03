import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import {  MessagePattern, Payload } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
  
   
  ) {}

  @MessagePattern('create-order')
  createOrder(@Payload() data) {


    return this.appService.createOrder(data);
  }
  @MessagePattern('get-order')
  getOrder(@Payload() data) {


    return this.appService.getOrder(data);
  }

}
