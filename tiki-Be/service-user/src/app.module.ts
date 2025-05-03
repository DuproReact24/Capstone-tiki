import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { readFileSync } from 'fs';
const privateKey = readFileSync('E:\\private.pem', 'utf8');
const publicKey = readFileSync('E:\\public.pem', 'utf8');
@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      useFactory: async () => ({
        privateKey,
        publicKey,
        signOptions: {
          algorithm: 'RS256',
          expiresIn: '8h',
        },
      }),
    }),
  ],

  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
