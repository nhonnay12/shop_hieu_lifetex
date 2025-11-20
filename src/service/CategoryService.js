import axios from 'axios';
import { axiosJWT } from './UserService';

export const createCategory = async (data) => {
    const res = await axios.post(`http://localhost:5000/api/category/create`, data);
    return res.data;
};
export const getAllCategory = async () => {
    const res = await axios.get(`http://localhost:5000/api/category/getall`);
    return res.data;
};
export const deleteCategory = async (id, access_token) => {
    const res = await axiosJWT.delete(`http://localhost:5000/api/category/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });
    return res.data;
};
