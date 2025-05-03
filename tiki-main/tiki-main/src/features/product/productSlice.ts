// lib/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface Product {
    id:number,
    name:string,
    id_cate:string,
    image_large:string,
    images:string,
    description:string,
    babadges_icon:string,
    support_delivery:boolean,
    deal:number,
    top_deal:number,
    price:number,
    rate:number,
    color:string,
    id_manufacturer:number,
    guarantee:string,
    quantity_buy:number,
    size_products:number,
    madein:string


}

interface Products {
 product:Product[]
 }

const initialState: Products = {
  product: [],

};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProduct: (state, action: PayloadAction<{ product: Products['product'] }>) => {
       
 
      state.product = action.payload.product
      
    
    },
  
  },
});

export const { setProduct } = productSlice.actions;
export default productSlice.reducer;
