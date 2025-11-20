import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    city: '',
    access_token: '',
    isAdmin: false,
    refreshToken: '',
};

export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            // ❌ LỖI CŨ: isAdmin ? isAdmin : state.isAdmin
            // Nếu isAdmin = false, sẽ lấy state.isAdmin (sai logic)
            
            // ✅ SỬA: Kiểm tra undefined thay vì falsy
            const { 
                _id, 
                name, 
                email, 
                address, 
                phone, 
                avatar, 
                access_token, 
                city, 
                isAdmin, 
                refreshToken 
            } = action.payload;
            
            if (_id !== undefined) state.id = _id;
            if (name !== undefined) state.name = name;
            if (email !== undefined) state.email = email;
            if (address !== undefined) state.address = address;
            if (phone !== undefined) state.phone = phone;
            if (avatar !== undefined) state.avatar = avatar;
            if (access_token !== undefined) state.access_token = access_token;
            if (city !== undefined) state.city = city;
            if (isAdmin !== undefined) state.isAdmin = isAdmin;
            if (refreshToken !== undefined) state.refreshToken = refreshToken;
        },
        resetUser: (state) => {
            state.id = '';
            state.name = '';
            state.email = '';
            state.phone = '';
            state.address = '';
            state.avatar = '';
            state.access_token = '';
            state.city = '';
            state.isAdmin = false;
            state.refreshToken = '';
        },
    },
});

export const { updateUser, resetUser } = userSlide.actions;
export default userSlide.reducer;