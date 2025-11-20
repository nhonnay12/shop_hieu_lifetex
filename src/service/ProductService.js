import axios from 'axios';
import { axiosJWT } from './UserService';

export const getAllProducts = async (search, page, limit) => {
    const res = await axios.get(`http://localhost:5000/api/story/stories?limit=${limit}&page=${page}`);

    return res.data;
};

export const getProductType = async (type, page, limit) => {
    if (type) {
        const res = await axios.get(`http://localhost:5000/api/product/getall?filter=type&filter=${type}&limit=${limit}&page=${page}`);
        return res.data;
    }
};
export const createProduct = async (data) => {
    const res = await axios.post(`http://localhost:5000/api/story/stories`, data);
    return res.data;
};
export const getDetailProduct = async (id) => {
    const res = await axios.get(`http://localhost:5000/api/story/stories/${id}`);
    return res.data;
};

export const updateProduct = async (id, access_token, data) => {
    const res = await axiosJWT.put(`http://localhost:5000/api/story/stories/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });
    return res.data;
};
export const deleteProduct = async (id, access_token) => {
    const res = await axiosJWT.delete(`http://localhost:5000/api/story/stories/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });
    return res.data;
};
export const deleteManyProduct = async (data, access_token) => {
    const res = await axiosJWT.post(`http://localhost:5000/api/product/delete-many`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    });
    return res.data;
};

export const getAllTypeProduct = async () => {
    const res = await axios.get(`http://localhost:5000/api/product/get-all-type`);
    return res.data;
};

export const getHotNews = async () => {
    const res = await axios.get(`http://localhost:5000/api/story/hotnews`);
    return res.data;
};
