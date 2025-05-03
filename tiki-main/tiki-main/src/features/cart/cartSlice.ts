import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductItem {
  id: number;
  address: string;
  description: string;
  guarantee: boolean;
  id_user: number;
  image_large: string;
  price: number;
  support_delivery: boolean;
  top_deal: boolean;
  amount: number;
}

interface CartState {
  items: ProductItem[];
  successCart:[]
}

const initialState: CartState = {
  items: [],
  successCart:[]
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleCartItem: (state, action: PayloadAction<ProductItem>) => {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);

      if (existingIndex >= 0) {
    
        state.items.splice(existingIndex, 1);
      } else {
        
        const newItem = {
          ...action.payload,
          price: action.payload.price * action.payload.amount, // nhân amount lúc thêm
        };
        state.items.push(newItem);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    successCart:(state, action)=>{
      
      state.successCart = action.payload;
    }
  },
});

export const { toggleCartItem, removeFromCart,successCart } = cartSlice.actions;
export default cartSlice.reducer;
