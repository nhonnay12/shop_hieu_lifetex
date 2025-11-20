import { WrapperForm, WrapperInput, WrapperRadio, BuyWayRadio } from './styles';
import classNames from 'classnames/bind';
import style from './CheckoutPage.module.scss';
import { Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Radio } from 'antd';
import { FaMoneyBill, FaCcPaypal } from 'react-icons/fa';
import { AiFillBackward } from 'react-icons/ai';

import { useMemo } from 'react';
import { convertPrice } from '~/ultil';
import Button from '~/components/Button';
import { useMutationHooks } from '~/hooks/useMutationHook';
import * as OrderService from '~/service/OrderSevice';
import Loading from '~/components/LoadingComponent';
import * as messages from '~/components/Message';
import { useNavigate } from 'react-router-dom';
import * as PaymentService from '~/service/PaymentService';
import { removeAllOrderProduct } from '~/redux/slides/orderSlide';
import { PayPalButton } from 'react-paypal-button-v2';
const cx = classNames.bind(style);

function CheckoutPage() {
    const order = useSelector((state) => state?.order);

    const [delivery, setDelivery] = useState('good');
    const [payment, setPayment] = useState('later_money');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const user = useSelector((state) => state.user);
    const [sdkReady, setSdkReady] = useState(false);
    const [stateUserDetail, setStateUserDetail] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        email: '',
    });
    const handleOnChangeDetail = (e) => {
        setStateUserDetail({
            ...stateUserDetail,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        form.setFieldsValue(stateUserDetail);
    }, [form, stateUserDetail]);

    useEffect(() => {
        setStateUserDetail({
            city: user?.city,
            name: user?.name,
            email: user?.email,
            address: user?.address,
            phone: user?.phone,
        });
    }, [user]);
    const diliveryPriceMemo = useMemo(() => {
        if (delivery === 'good') {
            return 21000;
        } else if (delivery === 'fast') {
            return 31000;
        }
    }, [delivery]);
    const priceMemo = useMemo(() => {
        const totalPrice = order?.orderItemSelected?.reduce((total, curr) => {
            return total + Math.trunc(curr.price - (curr.price * curr.discount) / 100) * curr.amount;
        }, 0);
        return totalPrice;
    }, [order]);

    const diliveryPriceMemoSale = useMemo(() => {
        if (priceMemo >= 200000 && priceMemo <= 500000) {
            return 20000;
        } else if (priceMemo >= 500000) {
            return 30000;
        } else if (priceMemo <= 200000) {
            return 0;
        }
    }, [priceMemo]);
    const totalSale = useMemo(() => {
        return Number(priceMemo) - Number(diliveryPriceMemoSale);
    }, [priceMemo, diliveryPriceMemoSale]);
    const totalPriceMemo = useMemo(() => {
        return Number(priceMemo) + Number(diliveryPriceMemo) - Number(diliveryPriceMemoSale);
    }, [priceMemo, diliveryPriceMemo, diliveryPriceMemoSale]);

    const mutationAddOrder = useMutationHooks((data) => {
        const { token, ...rest } = data;
        const res = OrderService.createOrder({ ...rest }, token);
        return res;
    });

    const handleAddOrder = async () => {
        if (user?.access_token && order?.orderItemSelected && user?.name && user?.address && user?.phone && user?.city && priceMemo && user?.id) {
            mutationAddOrder.mutate({
                token: user?.access_token,
                orderItems: order?.orderItemSelected, // sản phẩm trong giỏ hàng
                fullName: user?.name, // tên người nhận
                address: user?.address, // địa chỉ người nhận
                phone: user?.phone, // số điện thoại người nhận
                city: user?.city, // thành phố người nhận
                paymentMethod: payment, // phương thức thanh toán
                deliveryMethod: delivery, // phương thức giao hàng
                itemsPrice: priceMemo, // giá trị sản phẩm
                shippingPrice: diliveryPriceMemo, // phí vận chuyển
                totalPrice: totalPriceMemo, // tổng giá trị
                user: user?.id, // id người dùng
                email: user?.email, // email người dùng
            });
        }
        if (payment === 'paypal') {
            alert('Chức năng đang phát triển');

            const data = await PaymentService.getConfig({
                amount: totalPriceMemo,
                email: user?.email,
                phone: user?.phone,
                name: user?.name,
                address: user?.address,
                city: user?.city,
            });
        }
    };

    const { isLoading, isSuccess, isError, data } = mutationAddOrder;
    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            const arrayOrder = [];
            order?.orderItemSelected.forEach((element) => {
                arrayOrder.push(element.product);
            });
            dispatch(removeAllOrderProduct({ listChecked: arrayOrder }));
            messages.success('Mua hàng thành công');
            navigate('/ordersuccess', {
                state: {
                    delivery,
                    payment,
                    order: order?.orderItemSelected,
                },
            });

            navigate('/');
        } else if (isError && data?.status === 'ERR') {
            messages.error('Sản phẩm bạn mua đã hết hàng');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError]);

    const handleDilivery = (e) => {
        setDelivery(e.target.value);
    };

    const handlePayment = (e) => {
        console.log('🚀 ~ handlePayment ~ e.target.value:', e.target.value);
        setPayment(e.target.value);
    };

    const addPaypalScript = async () => {
        const { data } = await PaymentService.getConfig();

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
        script.async = true;

        script.onload = () => {
            setSdkReady(true);
        };
        document.body.appendChild(script);
    };

    useEffect(() => {
        if (!window.paypal) {
            addPaypalScript();
        } else {
            setSdkReady(true);
        }
    }, []);

    const onSuccessPaypal = (detail, data) => {
        mutationAddOrder.mutate({
            token: user?.access_token,
            orderItems: order?.orderItemSelected,
            fullName: user?.name,
            address: user?.address,
            phone: user?.phone,
            city: user?.city,
            email: user?.email,
            paymentMethod: payment,
            deliveryMethod: delivery,
            itemsPrice: priceMemo,
            shippingPrice: diliveryPriceMemo,
            totalPrice: totalPriceMemo,
            user: user?.id,
            isPaid: true,
            paidAt: detail.update_time,
        });
    };
    return (
        <Loading isLoading={isLoading}>
            <div className={cx('wrapper')}>
                <div className={cx('info')}>
                    <div className={cx('title')}>Địa chỉ giao hàng</div>
                    <WrapperForm name="basic" labelCol={{ span: 3 }} wrapperCol={{ span: 8 }} initialValues={{ remember: true }} autoComplete="off" form={form}>
                        <WrapperForm.Item label="Họ và tên người nhận" name="name" rules={[{ required: true, message: 'Thông tin này không thể để trống!' }]}>
                            <WrapperInput placeholder="Nhập họ và tên người nhận" value={stateUserDetail.name} onChange={handleOnChangeDetail} name="name" />
                        </WrapperForm.Item>
                        <WrapperForm.Item label="Email" name="email" rules={[{ required: true, message: 'Thông tin này không thể để trống!' }]}>
                            <WrapperInput placeholder="email" value={stateUserDetail.email} onChange={handleOnChangeDetail} name="email" />
                        </WrapperForm.Item>
                        <WrapperForm.Item label="Địa chỉ " name="address" rules={[{ required: true, message: 'Thông tin này không thể để trống!' }]}>
                            <WrapperInput placeholder="Nhập địa chỉ người nhận" value={stateUserDetail.address} onChange={handleOnChangeDetail} name="address" />
                        </WrapperForm.Item>
                        <WrapperForm.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Thông tin này không thể để trống!' }]}>
                            <WrapperInput placeholder="Nhập số điện thoại người nhận" value={stateUserDetail.phone} onChange={handleOnChangeDetail} name="phone" />
                        </WrapperForm.Item>
                        <WrapperForm.Item label="Địa chỉ nhận" name="city" rules={[{ required: true, message: 'Thông tin này không thể để trống!' }]}>
                            <WrapperInput placeholder="Nhập địa chỉ nhận" value={stateUserDetail.city} onChange={handleOnChangeDetail} name="city" />
                        </WrapperForm.Item>
                    </WrapperForm>
                </div>

                <div className={cx('delivery')}>
                    <div className={cx('delivery-title')}>Phương Thức giao hàng</div>
                    <Radio.Group onChange={handleDilivery} value={delivery}>
                        <div className={cx('delivery-way')}>
                            <WrapperRadio value="good">Giao Hàng Tiêu Chuẩn : 21.000đ </WrapperRadio>
                            <WrapperRadio value="fast">Giao Hàng Nhanh : 31.000đ</WrapperRadio>
                        </div>
                    </Radio.Group>
                </div>

                <div className={cx('method-buy')}>
                    <div className={cx('method-title')}>Phương thức thanh Toán</div>
                    <Radio.Group onChange={handlePayment} value={payment}>
                        <div className={cx('method-way')}>
                            <BuyWayRadio value="later_money">
                                <div className={cx('method-text')}>
                                    <FaMoneyBill className={cx('buy-icon')} /> <span>Thanh toán tiền mặt khi nhận hàng</span>
                                </div>
                            </BuyWayRadio>
                            <BuyWayRadio value="paypal">
                                <div className={cx('method-text')}>
                                    <FaCcPaypal className={cx('buy-paypal')} /> <span>Thanh toán bằng paypal</span>
                                </div>
                            </BuyWayRadio>
                        </div>
                    </Radio.Group>
                </div>
                <div className={cx('buy')}>
                    <div className={cx('buy-inner')}>
                        <div className={cx('total-name')}>
                            <div className={cx('total-title')}>Thành tiền : </div>
                            <div className={cx('total-tt')}> {convertPrice(totalSale)}</div>
                        </div>
                        <div className={cx('total-sum')}>
                            <div className={cx('sum-title')}>Phí vận chuyển : </div>
                            <div className={cx('sum-vat')}> {convertPrice(diliveryPriceMemo)}</div>
                        </div>
                        <div className={cx('into-sum')}>
                            <div className={cx('into-title')}>Tổng Số Tiền (gồm VAT) : </div>
                            <div className={cx('into-money')}> {convertPrice(totalPriceMemo)}</div>
                        </div>
                    </div>

                    <div className={cx('option')}>
                        <span className={cx('option-back')}>
                            <AiFillBackward className={cx('back-icon')} />
                            Quay về giỏ hàng
                        </span>
                        {payment === 'paypal' && sdkReady ? (
                            <PayPalButton
                                amount={totalPriceMemo}
                                // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                onSuccess={onSuccessPaypal}
                                onError={() => {
                                    alert('ERROR');
                                }}
                            />
                        ) : (
                            <Button login className={cx('btn-buy')} onClick={() => handleAddOrder()}>
                                Xác Nhận Thanh Toán
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Loading>
    );
}

export default CheckoutPage;
