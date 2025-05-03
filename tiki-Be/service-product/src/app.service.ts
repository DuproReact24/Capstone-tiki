import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { products } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prismaService: PrismaService) {}
  async processCate(data) {
    try {
      const res = await this.prismaService.cate.create({
        data,
      });

      return {
        status: 201,
        message: 'Category created successfully',
        data: res,
      };
    } catch (error) {
      return {
        status: 500,
        message: error?.message || 'Internal server error',
      };
    }
  }
  async processDeCate(data){
    try {
      const res = await this.prismaService.cate.delete({
      where:{
        id:data
      }
      });

      return {
        status: 204,
        message: 'Category deleted successfully',
      
      };
    } catch (error) {
      return {
        status: 500,
        message: error?.message || 'Internal server error',
      };
    }
  }


  async processDetailCate(data) {
    try {
      const res = await this.prismaService.cate_detail.create({
        data,
      });

      return {
        status: 201,
        message: 'Category detail created successfully',
        data: res,
      };
    } catch (error) {
      return {
        status: 500,
        message: error?.message || 'Internal server error',
      };
    }
  }



  // product
  async proccessProduct(data:products) {
    const processedData = {
      name: data.name,
      id_cate: Number(data.id_cate),
      image_large: data.image_large,
      images: data.images, 
      description: data.description,
      badges_icon: data.badges_icon, 
      support_delivery: Boolean(data.support_delivery), 
      deal: Number(data.deal),
      top_deal: Boolean(data.top_deal), 
      price: Number(data.price), 
      rate: Number(data.rate),
      color: data.color,
      id_manufacturer: Number(data.id_manufacturer),
      guarantee: data.guarantee,
      quantity_buy: Number(data.quantity_buy),
      size_products: data.size_products,
      id_cate_detail:Number(data.id_cate_detail), 
    };
    try {
      const res = await this.prismaService.products.create({
        data:processedData
      });

      return {
        status: 201,
        message: 'Products created successfully',
        data: res,
      };
    } catch (error) {
      console.log(error)
      return {
        status: 500,
        message: error?.message || 'Internal server error',
      };
    }
  }




  async proccessGetCate(data:products) {
    try {
      const res = await this.prismaService.cate.findMany({
      
      });

      return {
        status: 201,
        message: 'Products created successfully',
        data: res,
      };
    } catch (error) {
      console.log(error)
      return {
        status: 500,
        message: error?.message || 'Internal server error',
      };
    }
  }

  async proccessGetProduct(){
    try {
      const res = await this.prismaService.products.findMany({
      
      });

      return {
        status: 201,
        message: 'Products created successfully',
        data: res,
      };
    } catch (error) {
      console.log(error)
      return {
        status: 500,
        message: error?.message || 'Internal server error',
      };
    }
  }
  async proccessGetCateDetail(data){
   
    try {
      const res = await this.prismaService.products.findFirst({
      where:{
        id:data
      }});
      console.log(res)
      return {
        status: 201,
        message: 'Products created successfully',
        data: res,
      };
    } catch (error) {
      console.log(error)
      return {
        status: 500,
        message: error?.message || 'Internal server error',
      };
    }
  }
  async proccessGetProductOrther() {
    try {
      const res = await this.prismaService.products.findMany({
        take: 10, // 👈 Giới hạn chỉ lấy 10 sản phẩm
      });
      console.log(res);
      return {
        status: 201,
        message: 'Products retrieved successfully',
        data: res,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: error?.message || 'Internal server error',
      };
    }
  }
  async proccessCart(data){
    try {
      const res = await this.prismaService.cart.create({
      data
      });
  
      return {
        status: 201,
        message: 'cart  add successfully',
        data: res,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: error?.message || 'Internal server error',
      };
    }
  }
  async proccessGetCart(id){
    try {
      const res = await this.prismaService.cart.findMany({    
        where:{
          id_user:id
        }
      });
       
  
      return {
        status: 201,
        message: 'get cart successfully',
        data: res,
      };
    } catch (error) {
   
      return {
        status: 500,
        message: error?.message || 'Internal server error',
      };
    }
  }
  async proccessDeleteCart(id){
    try {
      const res = await this.prismaService.cart.delete({    
        where:{
          id:id
        }
      });
       
  
      return {
        status: 201,
        message: 'delete cart successfully',
     
      };
    } catch (error) {
   
      return {
        status: 500,
        message: error?.message || 'Internal server error',
      };
    }
  }
  async proccessGetProductCate(id){
   
   try {
   const data = await this.prismaService.products.findMany({
    where:{
      id_cate:id
    }
   })
   if(data.length == 0){
    return {
      status:404,
      message:'Sản phẩm không tồn tại',
      
     }
   }
  
   return {
    status:200,
    message:'success',
    data:data
   }
   } catch (error) {
    console.log(error)
    return {
      status:401,
      message:'Lỗi truyền dữ liệu',
      
     }
   } 
   
  }
  async proccessDetailCate(name){
    console.log(name)

    return this.prismaService.products.findMany({
      where:{
        name:{
          contains:name,
           mode: 'insensitive'
        }
      }
    })

  }

}
