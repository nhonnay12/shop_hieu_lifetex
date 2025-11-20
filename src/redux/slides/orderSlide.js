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
            const { idProduct } = action.payload;

            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct);
            const itemOrderSelected = state?.orderItemSelected?.find((item) => item?.product === idProduct);
            itemOrder.amount++;
            if (itemOrderSelected) {
                itemOrderSelected.amount++;
            }
        },
        decreaseAmount: (state, action) => {
            const { idProduct } = action.payload;
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct);
            const itemOrderSelected = state?.orderItemSelected?.find((item) => item?.product === idProduct);
            itemOrder.amount--;
            if (itemOrderSelected) {
                itemOrderSelected.amount--;
            }
        },
        removeOrderProduct: (state, action) => {
            const { id } = action.payload;

            const itemOrder = state?.orderItems?.filter((item) => item?.product !== id);
            const itemOrderSelected = state?.orderItemSelected?.filter((item) => item?.product !== id);
            state.orderItems = itemOrder;
            state.orderItemSelected = itemOrderSelected;
        },
        removeAllOrderProduct: (state, action) => {
            const { listChecked } = action.payload;
            const itemOrder = state?.orderItems?.filter((item) => !listChecked.includes(item.product));
            const itemOrderSelected = state?.orderItemSelected?.filter((item) => !listChecked.includes(item.product));
            state.orderItemSelected = itemOrderSelected;
            state.orderItems = itemOrder;
        },
        selectedOrder: (state, action) => {
            const { listChecked } = action.payload;
            const orderSelected = [];
            state.orderItems.forEach((order) => {
                if (listChecked.includes(order.product)) {
                    orderSelected.push(order);
                }
            });
            state.orderItemSelected = orderSelected;
        },
    },
});

// Action creators are generated for each case reducer function
export const { addOrderProduct, removeOrderProduct, removeAllOrderProduct, increaseAmount, decreaseAmount, selectedOrder } = orderSlide.actions;

export default orderSlide.reducer;
