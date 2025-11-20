import axios from 'axios';

export const getConfig = async () => {
    const res = await axios.get(`http://localhost:5000/api/payment/config`);
    return res.data;
};

export const createPayment = async (data) => {
    const res = await axios.post(`http://localhost:5000/api/vnpay/vnpayP`, data);
    return res.data;
};

export const getPayment = async (id) => {
    const res = await axios.get(`http://localhost:5000/api/vnpay/vnpay_return?id=${id}`);
    return res.data; // Trả về kết quả thanh toán VNPay
};
