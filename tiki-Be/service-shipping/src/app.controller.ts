import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('create-shipping')
  createShipping(data) {
    console.log(data)
   return this.appService.createShipping(data);
  }
}
