import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [ClientsModule.register([{
  name: 'USER_NAME',
  transport: Transport.RMQ,
  options: {

  urls: ['amqp://admin:1234@localhost:5672'],

  queue: 'user_queue',
  queueOptions: {

  durable: false
  }
  }
  },
  {
    name: 'ORDER_NAME',
    transport: Transport.RMQ,
    options: {
  
    urls: ['amqp://admin:1234@localhost:5672'],
  
    queue: 'order_queue',
    queueOptions: {
  
    durable: false
    }
    }
    },
{
  name: 'PRODUCT_NAME',
  transport: Transport.RMQ,
  options: {

  urls: ['amqp://admin:1234@localhost:5672'],

  queue: 'product_queue',
  queueOptions: {

  durable: false
  }
  }
  }]),
  ConfigModule.forRoot({
    isGlobal: true, })
, ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // trỏ tới thư mục public
      exclude: ['/api*'], // bỏ qua route API nếu cần
    }),
  ],
 
  controllers: [AppController],
  providers: [JwtStrategy],
  })
  export class GatewayModule { }
