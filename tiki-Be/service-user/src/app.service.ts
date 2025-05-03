import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Twilio } from 'twilio';
@Injectable()

export class AppService {
  constructor(private prismaService:PrismaService,
    private jwtService:JwtService
  ){}
async hanldeLogin(data) {
   const result = await this.prismaService.users.findFirst({
    where:{
      phone:data.phone,
    }
    })
    if(!result?.phone){
     
      return "Số điện thoại không tồn tại"
    }
    

   

   
    const payload = { phone: data.phone };
    return {
      
      access_token: await this.jwtService.signAsync(payload),
    };

  }
 
async hanldeRegister(data:{phone:string}) {
  console.log(data.phone)
    const otp = await this.sendSms(data.phone)
    if(!otp){
      return "Gửi OTP không thành công"
    }
  
    return {
      status: 200,
      message: 'Gửi OTP thành công',

    }
  }
  async handleOtp(data:{phone:string, code:string}) {
   
    try {
     
    
      const res = await this.prismaService.users.create({
        data: {
          phone: data.phone,
        },
      });
      
      
      const customer = await this.prismaService.customer.create({
        data: {
          id_user: res.id, 
        },
      });
     
      const payload = { phone: data.phone };
      return {
        status: 200,
        message: 'Register thành công',
        data:{ res,access_token: await this.jwtService.signAsync(payload),},
  
      }
    } catch (error) {
      console.log(error)
      
    }
  }
async sendSms(phone:string) {

const accountSid = 'ACcb7faff29658f8f2cc3f62a04365';
const authToken = '939aaf69df7d7561b747e3068b0467';
const client = new Twilio(accountSid, authToken);
try {
  const verification = await client.verify.v2
    .services("VA07d1224ec8803e5e0ce88b28263f")
    .verifications.create({ to: `+84${phone}`, channel: 'sms' });

  return verification.status === 'pending'; // true nếu gửi thành công
} catch (error) {
 
  return false;
}

}

async verifyOtp(phone: string, code: string): Promise<boolean> {
  const accountSid = 'ACcb7faff29658f8f2f62a0ed224365';
  const authToken = '939aaf69df7d7561be306808b0467';
  const client = new Twilio(accountSid, authToken);

  try {
    const verificationCheck = await client.verify.v2
      .services('VA07d1224ec880c7950ce88b28263f')
      .verificationChecks
      .create({ to: `+84${phone}`, code });

    console.log('Kết quả xác minh OTP:', verificationCheck.status);

    return verificationCheck.status === 'approved'; // true nếu OTP đúng
  } catch (error) {
    console.log(error)
    console.error('Lỗi xác minh OTP:', error.message);
    return false;
  }
}

}


