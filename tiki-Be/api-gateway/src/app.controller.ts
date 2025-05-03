import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Inject, Param, Post, Put, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import e from 'express';

@Controller()
export class AppController {
  constructor(
    @Inject('USER_NAME') private  userService:ClientProxy,
    @Inject('PRODUCT_NAME') private  productService:ClientProxy,
    @Inject('ORDER_NAME') private  orderService:ClientProxy,
  ) {}
  @UseGuards(AuthGuard('jwt'))
  @Post('login')
 async login(@Body() body) {
  
  const res = await lastValueFrom(this.userService.send('login-service', body));
  return res
  }

  @Post('send-otp')
  async register(@Body() body:{phone:string, name:string,password:string}) {
    console.log(body.phone)
   const res = await lastValueFrom(this.userService.send('register-service', body));
    if(res?.statusCode == 200){
      return true
    }
    return false

   }
   @Post('verify-otp')
   async verifyOtp(@Body() body:{phone:string,code:string}) {
    
    const res = await lastValueFrom(this.userService.send('verify-service', body));

     if(res?.status == 200){
       return res
     }
     return false
 
    }



   //cate loại sản phẩm
   @Post('create-cate')
   async createCate(@Body() body){
    const res = await lastValueFrom(this.productService.send('create-cate', body));
    return res
   }
   @Post('create-cate-detail')
   async createDetailCate(@Body() body){
    const res = await lastValueFrom(this.productService.send('create-cate-detail', body));
    return res
   }
   @Get('get-cate')
   async getCate(){
    const res = await lastValueFrom(this.productService.send('get-cate', ""));
    return res
   }
   @Delete('delete-cate/:id')
   async deleteCate(@Param('id') id:string){
    const res = await lastValueFrom(this.productService.send('delete-cate', +id));
    return res
   }
   // product
   @Post('create-product')
   @UseInterceptors(
    FileFieldsInterceptor( [
      { name: 'image_large_file', maxCount: 1 },
      { name: 'images_files', maxCount: 2},
    ], {
      storage: diskStorage({
        destination: './img',
        filename: (req, file, cb) => {
      
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const filename = `${uniqueSuffix}${extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
    }),
  )
   async createProduct( @UploadedFiles()  files: {
    image_large_file?: any;
    images_files?: any;
  },
   @Body() body: any,){
    console.log(files)
    body.image_large = files?.image_large_file?.[0].filename;
    body.images = JSON.stringify(files?.images_files?.map(file => file.filename)) || '';
  
    const res = await lastValueFrom(this.productService.send('create-product', body));
    return res
   }
   @Get('get-products')
   async getProduct(){
    const res = await lastValueFrom(this.productService.send('get-product',""));
    return res
   }
   @Get('get-products/:id')
   async getProductDetail(@Param('id') id){
console.log(id)
   
    const res = await lastValueFrom(this.productService.send('get-product-detail',id));
    return res
   }
   // api sanphamLienquan
   @Get('get-products-orthers')
   async getProductOrthers(){

   
    const res = await lastValueFrom(this.productService.send('get-product-orthers',""));
    return res
   }
   @Get('get-products-cate/:id')
   async getProductCate(@Param('id') id){


   
    const res = await lastValueFrom(this.productService.send('get-product-cate',+id));

    if(res.status == 200){
      return {
        status:200,
        message:'success',
        data:res.data
      }
    }else if(res.status == 404){
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: res.message,
          
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        message: res.message,
        
      },
      HttpStatus.BAD_REQUEST,
    );
   }
   @Get('get-products-cate-detail/:id')
   async getProductCateDetail(@Param('id') id){
    const res = await lastValueFrom(this.productService.send('get-product-cateDetail',+id));
    return res
   }
   @Get('search-product')
   async searchProduct(@Query('name') name){
   
    const res = await lastValueFrom(this.productService.send('search-product',name));
    return res
   }


   //order
   @Post('create-order')
    async createOrder(@Body() body){
   
      const res = await lastValueFrom(this.orderService.send('create-order', body.products));
 
      if(res?.status == 200){
        return {
          status:200,
          message:'success',
          data:res.data
          
        }
      }else if(res?.status == 400){
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: 'Sản phẩm chưa được chọn',
            
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Đã có lỗi xảy ra khi tạo đơn hàng',
        },
        HttpStatus.BAD_REQUEST,
      );
      
    }
    @Get('get-order/:id')
    async getOrder(@Param('id') id:string){
    
      const res = await lastValueFrom(this.orderService.send('get-order', +id));
      return res
    }





    @Post('callback')
    async callback( @Body('data') dataStr: string,
    @Body('mac') reqMac: string,){
      console.log(dataStr,reqMac)
      const res = await lastValueFrom(this.orderService.send('get-callback',{dataStr,reqMac} ));
      return res
    }


   // thêm giỏ hàng
    @Post('add-cart')
    async addCart( @Body() body 
    ){

      const res = await lastValueFrom(this.productService.send('add-cart',body ));
      return res
    }
    @Get('get-cart/:id')
    async getCart( @Param('id') id 
    ){

      const res = await lastValueFrom(this.productService.send('get-cart',+id ));
      return res
    }
    @Delete('delete-cart/:id')
    async deletedCart( @Param('id') id 
    ){

      const res = await lastValueFrom(this.productService.send('delete-cart',+id ));
      return res
    }
   


   

  }


