import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orderItems: [],
    orderItemSelected: [],
    shippingAddress: {},
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
    isSuccessOrder: false,
    id: '',
};

export const orderSlide = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrderProduct: (state, action) => {
            const { orderItem } = action.payload;
            const itemOrder = state?.orderItems?.find((item) => {
                return item?.story === orderItem.story;
            });

            if (itemOrder) {
                itemOrder.amount += orderItem?.amount;
            } else {
                state.orderItems.push(orderItem);
            }
        },
        increaseAmount: (state, action) => {
            const { index } = action.payload;

            const itemToUpdate = state.orderItems[index];
            if (itemToUpdate) {
                itemToUpdate.amount++;
                // Cập nhật luôn trong orderItemSelected nếu có
                const selectedItem = state.orderItemSelected.find((item) => item.product === itemToUpdate.product);
                if (selectedItem) {
                    selectedItem.amount++;
                }
            }
        },
        decreaseAmount: (state, action) => {
            const { index } = action.payload;
            const itemToUpdate = state.orderItems[index];
            if (itemToUpdate && itemToUpdate.amount > 1) {
                itemToUpdate.amount--;
                // Cập nhật luôn trong orderItemSelected nếu có
                const selectedItem = state.orderItemSelected.find((item) => item.product === itemToUpdate.product);
                if (selectedItem) {
                    selectedItem.amount--;
                }
            }
        },
        removeOrderProduct: (state, action) => {
            const { index: indexToRemove } = action.payload;
            console.log('--- Redux: removeOrderProduct ---');
            console.log('Payload (index to remove):', indexToRemove);
            console.log('State BEFORE removal:', JSON.parse(JSON.stringify(state.orderItems)));

            if (typeof indexToRemove === 'number' && indexToRemove >= 0 && indexToRemove < state.orderItems.length) {
                state.orderItems.splice(indexToRemove, 1);
                console.log('Item at index', indexToRemove, 'has been removed.');
            } else {
                console.error('Invalid index provided to removeOrderProduct:', indexToRemove);
            }
            console.log('State AFTER removal:', JSON.parse(JSON.stringify(state.orderItems)));
            console.log('---------------------------------');
        },
        removeAllOrderProduct: (state, action) => {
            const { listRemovedProductIds } = action.payload;

            // console.log('--- Redux: removeAllOrderProduct ---');
            // console.log('Product IDs to remove:', listRemovedProductIds);
            // console.log('State BEFORE removal:', JSON.parse(JSON.stringify(state.orderItems)));

            // Lọc ra những sản phẩm không có trong danh sách cần xóa
            state.orderItems = state.orderItems.filter((item) => !listRemovedProductIds.includes(item.story));
            // Reset lại danh sách sản phẩm đã chọn
            state.orderItemSelected = [];
            // console.log('State AFTER removal:', JSON.parse(JSON.stringify(state.orderItems)));
            // console.log('------------------------------------');
        },
        selectedOrder: (state, action) => {
            const { listChecked } = action.payload;
            const orderSelected = [];
            state.orderItems.forEach((item, index) => {
                if (listChecked.includes(index)) {
                    orderSelected.push(item);
                }
            });
            state.orderItemSelected = orderSelected;
        },
    },
});

// Action creators are generated for each case reducer function
export const { addOrderProduct, removeOrderProduct, removeAllOrderProduct, increaseAmount, decreaseAmount, selectedOrder } = orderSlide.actions;

export default orderSlide.reducer;
