import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(  private prismaService: PrismaService,){}
  createShipping(data) {
    return this.prismaService.shipping.create({
      data
  })
  }
}

//nayu cgwj shvb zmkh