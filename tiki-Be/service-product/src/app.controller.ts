import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { products } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create-cate')
  createCate(@Payload() data) {
    return this.appService.processCate(data);
  }
  @MessagePattern('delete-cate')
  deletedCate(@Payload() data) {
    return this.appService.processDeCate(data);
  }
  @MessagePattern('create-cate-detail')
  createCateDetail(@Payload() data) {
    return this.appService.processDetailCate(data);
  }
  @MessagePattern('create-product')
  createProduct(@Payload() data:products) {
    console.log(data)
    return this.appService.proccessProduct(data);
  }
  @MessagePattern('get-product')
  getProducts() {

    return this.appService.proccessGetProduct();
  }
  //get-products
  //get-cate
  @MessagePattern('get-cate')
  getCate(@Payload() data:products) {

    return this.appService.proccessGetCate(data);
  }
  @MessagePattern('get-product-detail')
  getCateDetail(@Payload() data) {
   
    return this.appService.proccessGetCateDetail(+data);
  }
  @MessagePattern('get-product-orthers')
  getProductOrthers() {
    
    return this.appService.proccessGetProductOrther();
  }
  @MessagePattern('get-product-cate')
  getProductCate(id:number) {
    
    return this.appService.proccessGetProductCate(id);
  }
  @MessagePattern('add-cart')
  createCart(@Body() data) {

    
    return this.appService.proccessCart(data);
  }
  @MessagePattern('get-cart')
  getCart(id:number) {
    
    
    return this.appService.proccessGetCart(id);
  }
  @MessagePattern('delete-cart')
  deleteCart(id:number) {
    
    
    return this.appService.proccessDeleteCart(id);
  }
  @MessagePattern('get-product-cateDetail')
  getDetailCate(id:number){
    return this.appService.proccessDetailCate(id);
  }
  @MessagePattern('search-product')
  searchProduct(name:string){
    return this.appService.proccessDetailCate(name);
  }

}
