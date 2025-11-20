import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: 0,
};

export const productSlide = createSlice({
    name: 'product',
    initialState,
    reducers: {
        searchProduct: (state, action) => {
            state.search = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { searchProduct } = productSlide.actions;

export default productSlide.reducer;
