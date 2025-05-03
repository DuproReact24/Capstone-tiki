import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

 @MessagePattern('login-service') 
  login() {
    return  
  }
  @MessagePattern('register-service') 
  register() {
    return 'Hello World!';
  }
}
