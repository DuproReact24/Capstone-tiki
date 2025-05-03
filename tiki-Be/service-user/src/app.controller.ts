import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

    @MessagePattern('login-service') 
    async login(@Payload() data) {
    const {phone}= data
    return  await this.appService.hanldeLogin(phone)

  }
  @MessagePattern('register-service') 
 async register(@Payload() data:{phone:string}) {
  
   return await this.appService.hanldeRegister(data)

  }
  @MessagePattern('verify-service') 
  async hanldeOtp(@Payload() data:{phone:string, code:string}) {
   
    return await this.appService.handleOtp(data)
 
   }
}
