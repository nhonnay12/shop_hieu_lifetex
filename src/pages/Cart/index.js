import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { CustomCheckbox, WrapperInputNumber, WrapperForm, WrapperInput } from './style';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { MdDeleteForever, MdNavigateNext } from 'react-icons/md';
import { TbTicket } from 'react-icons/tb';
import { CiWarning } from 'react-icons/ci';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '~/redux/slides/orderSlide';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { convertPrice } from '~/ultil';
import Button from '~/components/Button';
import * as messages from '~/components/Message';
import ModalComponent from '../Admin/ComponentAdmin/ModalComponent';
import { Alert, Form } from 'antd';
import { useMutationHooks } from '~/hooks/useMutationHook';
import * as UserService from '~/service/UserService';
import Loading from '~/components/LoadingComponent';
import { updateUser } from '~/redux/slides/userSlide';
import StepComponet from '~/components/StepComponent';

const cx = classNames.bind(styles);
function Cart() {
    const order = useSelector((state) => state?.order);
    const user = useSelector((state) => state.user);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [listChecked, setListChecked] = useState([]);
    const [isModalOpenUpdateInfo, setIsModalOpenUpdateInfo] = useState(false);
    const [form] = Form.useForm();
    const [stateUserDetail, setStateUserDetail] = useState({
        name: '',
        address: '',
        phone: '',
        city: '',
    });

    useEffect(() => {
        if (!user.access_token) {
            alert('Vui lòng đăng nhập để tiếp tục mua hàng');
            navigate('/login');
        }
    }, [user, navigate]);

    const handleOnChangeDetail = (e) => {
        setStateUserDetail({
            ...stateUserDetail,
            [e.target.name]: e.target.value,
        });
    };
    const handleChangeCount = (type, idProduct, value, countInStock) => {
        if (type === 'increase') {
            if (value >= countInStock) {
                --value;
            } else {
                dispatch(increaseAmount({ idProduct }));
            }
        } else if (type === 'decrease') {
            if (value <= 1) {
                value = 1;
            } else {
                dispatch(decreaseAmount({ idProduct }));
            }
        }
    };
    const handleDetailProduct = (id) => {};

    const handleDeleteOrder = (idProduct) => {
        dispatch(removeOrderProduct({ idProduct }));
    };
    const onChangeCheckbox = (e) => {
        if (listChecked.includes(e.target.value)) {
            const newListChecked = listChecked.filter((item) => item !== e.target.value);
            setListChecked(newListChecked);
        } else {
            setListChecked([...listChecked, e.target.value]);
        }
    };
    const handleCheckAll = (e) => {
        if (e.target.checked) {
            const newListChecked = [];

            order?.orderItems?.forEach((item) => {
                newListChecked.push(item?.product);
            });
            setListChecked(newListChecked);
        } else {
            setListChecked([]);
        }
    };

    const handleDeleteAllOrder = () => {
        if (listChecked?.length > 1) {
            dispatch(removeAllOrderProduct({ listChecked }));
        }
    };

    useEffect(() => {
        dispatch(selectedOrder({ listChecked }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listChecked]);
    useEffect(() => {
        form.setFieldsValue(stateUserDetail);
    }, [form, stateUserDetail]);

    useEffect(() => {
        if (isModalOpenUpdateInfo) {
            setStateUserDetail({
                city: user?.city,
                name: user?.name,
                address: user?.address,
                phone: user?.phone,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalOpenUpdateInfo]);
    //tiền tạm thời
    const priceMemo = useMemo(() => {
        const totalPrice = order?.orderItemSelected?.reduce((total, curr) => {
            return total + Math.trunc(curr.price - (curr.price * curr.discount) / 100) * curr.amount;
        }, 0);
        return totalPrice;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order]);

    const diliveryPriceMemo = useMemo(() => {
        if (priceMemo >= 200000 && priceMemo <= 500000) {
            return 20000;
        } else if (priceMemo >= 500000) {
            return 30000;
        } else if (priceMemo <= 200000) {
            return 0;
        }
    }, [priceMemo]);
    //giảm tiền khi đạt điều kiện
    const totalSale = useMemo(() => {
        return Number(priceMemo) - Number(diliveryPriceMemo);
    }, [priceMemo, diliveryPriceMemo]);

    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rest } = data;
        const res = UserService.updateUser(id, { ...rest }, token);
        return res;
    });
    const { isLoading, data, isSuccess, isError } = mutationUpdate;
    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            messages.success('Sửa thành công');
        } else if (isError && data?.status === 'ERR') {
            messages.error('Sửa thất bại');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError]);

    const handleAddCart = () => {
        if (!order?.orderItemSelected?.length) {
            messages.error('vui lòng chọn sản phẩm');
        } else if (!user?.phone || !user?.address || !user?.name || !user?.city) {
            setIsModalOpenUpdateInfo(true);
        } else if (!user?.id) {
            navigate('/login', { state: location?.pathname });
        } else {
            navigate('/checkout');
        }
    };
    const handleCancelUpdate = () => {
        setStateUserDetail({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
        });
        form.resetFields();
        setIsModalOpenUpdateInfo(false);
    };
    const handleUpdateInfoUser = () => {
        const { name, phone, address, city } = stateUserDetail;
        if (name && phone && address && city) {
            mutationUpdate.mutate(
                { id: user?.id, ...stateUserDetail, token: user?.access_token },
                {
                    onSuccess: () => {
                        dispatch(updateUser({ name, address, city, phone }));
                        setIsModalOpenUpdateInfo(false);
                    },
                },
            );
        }
    };
    const renderOffProduct = (count, stock) => {
        if (count > stock) {
            return <span className={cx('off-product')}>Sản Phẩm Không Đủ Hàng</span>;
        }
    };
    const handleChangeAddress = () => {
        setIsModalOpenUpdateInfo(true);
    };
    const onChange = (value) => {};
    const itemsDelivery = [
        {
            title: '0đ',
            description: 'Giảm giá',
        },
        {
            title: '20.000đ',
            description: 'Trên 200.000đ',
        },
        {
            title: '30.000đ',
            description: 'Trên 500.000đ',
        },
    ];
    return (
        <div className={cx('wrapper')}>
            <div className={cx('title-cart')}>
                <span className={cx('title')}>Giỏ Hàng </span>
                <span className={cx('title-count')}>({order?.orderItems?.length} Sản Phẩm )</span>
            </div>
            <div className={cx('step')}>
                <StepComponet items={itemsDelivery} current={diliveryPriceMemo === 20000 ? 1 : diliveryPriceMemo === 30000 ? 2 : 0} />
            </div>
            <div className={cx('inner')}>
                <div className={cx('container')}>
                    <div className={cx('check-all')}>
                        <CustomCheckbox className={cx('checkbox-all')} onChange={handleCheckAll} checked={listChecked?.length === order?.orderItems?.length} />
                        <span className={cx('text-all')}>Chọn tất cả ({order?.orderItems?.length} sản phẩm)</span>
                        <div className={cx('title-amount')}>Số lượng</div>
                        <div className={cx('title-buy')}>Thành Tiền</div>
                        <div className={cx('delete-cart-all')}>
                            <MdDeleteForever onClick={handleDeleteAllOrder} />
                        </div>
                    </div>
                    <div className={cx('content')}>
                        {order?.orderItems?.map((item) => {
                            const priceSale = Math.trunc(item?.price - (item?.price * item?.discount) / 100);

                            return (
                                <div key={item?.product} className={cx('product-cart')}>
                                    <div className={cx('checkbox-all-width')}>
                                        {item?.countInStock !== 0 && (
                                            <CustomCheckbox
                                                className={cx('checkbox-all')}
                                                onChange={onChangeCheckbox}
                                                value={item?.product}
                                                checked={listChecked.includes(item?.product)}
                                            />
                                        )}
                                    </div>

                                    <img src={item?.image} alt="" className={cx('product-img')} onClick={() => handleDetailProduct(item?.product)} />
                                    <div className={cx('product-info')}>
                                        <span className={cx('product-name')}>{item?.name}</span>
                                        <div className={cx('price')}>
                                            <div className={cx('product-price')}>{convertPrice(priceSale)}</div>
                                            {item?.discount !== 0 && <div className={cx('product-price-old')}>{convertPrice(item?.price)}</div>}
                                        </div>
                                    </div>
                                    <div className={cx('option')}>
                                        <div className={cx('option-price')}>
                                            <div>
                                                {item?.countInStock !== 0 && (
                                                    <div className={cx('amount-so')}>
                                                        <FaMinus className={cx('btn-less')} onClick={() => handleChangeCount('decrease', item?.product, item?.amount)} />
                                                        <WrapperInputNumber
                                                            min={1}
                                                            value={item?.amount}
                                                            defaultValue={item?.amount}
                                                            className={cx('input-amount')}
                                                            onChange={onChange}
                                                        />
                                                        <FaPlus
                                                            className={cx('btn-more')}
                                                            onClick={() => handleChangeCount('increase', item?.product, item?.amount, item?.countInStock)}
                                                        />
                                                    </div>
                                                )}
                                                <div className={cx('render-off')}>{renderOffProduct(item?.amount, item?.countInStock)}</div>
                                            </div>
                                        </div>

                                        <div className={cx('total-price')}>{convertPrice(priceSale * item?.amount)}</div>
                                        <div className={cx('delete-cart')}>
                                            <MdDeleteForever onClick={() => handleDeleteOrder(item?.product)} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className={cx('sale')}>
                    <div className={cx('sale-inner')}>
                        <div className={cx('title-sale')}>
                            <div className={cx('sale-text')}>
                                <TbTicket className={cx('sale-text-icon')} />
                                Khuyến Mãi
                            </div>
                            <div className={cx('sale-more')}>
                                Xem Thêm
                                <MdNavigateNext />
                            </div>
                        </div>
                        <div className={cx('ticket')}>
                            <div className={cx('ticket-name')}>
                                <div className={cx('ticket-name-text')}>MÃ GIẢM 10K - ĐƠN HÀNG TỪ 150K </div>
                                <div className={cx('ticket-description')}>Chi tiết</div>
                            </div>
                            <div className={cx('ticket-wra')}>Không áp dụng cho phiếu quà tặng</div>
                            <div className={cx('ticket-condition-text')}>
                                <div className={cx('ticket-condition-need')}>Mua thêm 94.650đ để nhận mã </div>
                                <div className={cx('ticket-condition')}> 150.000đ</div>
                                <button className={cx('ticket-buy-more')}>Mua thêm</button>
                            </div>
                        </div>
                        <div className={cx('ticket')}>
                            <div className={cx('ticket-name')}>
                                <div className={cx('ticket-name-text')}>MÃ GIẢM 10K - ĐƠN HÀNG TỪ 150K </div>
                                <div className={cx('ticket-description')}>Chi tiết</div>
                            </div>
                            <div className={cx('ticket-wra')}>Không áp dụng cho phiếu quà tặng</div>
                            <div className={cx('ticket-condition-text')}>
                                <div className={cx('ticket-condition-need')}>Mua thêm 94.650đ để nhận mã </div>
                                <div className={cx('ticket-condition')}> 150.000đ</div>
                                <button className={cx('ticket-buy-more')}>Mua thêm</button>
                            </div>
                        </div>
                        <div className={cx('ticket-more')}>
                            <span>2 khuyến mãi đủ điều kiên</span>
                            <MdNavigateNext className={cx('ticket-more-icon')} />
                        </div>
                        <div className={cx('ticket-help')}>
                            <span>Có thể áp dụng đông thời nhiều mã</span> <CiWarning className={cx('ticket-help-icon')} />
                        </div>
                    </div>
                    <div className={cx('total')}>
                        <div className={cx('address')}>
                            <div className={cx('address-text')}>Địa chỉ : </div>
                            <div className={cx('address-tp')}>{user?.address} </div>
                            <div className={cx('address-place')}>- {user?.city}</div>
                            <div className={cx('address-change')} onClick={handleChangeAddress}>
                                Thay đổi
                            </div>
                        </div>
                        <div className={cx('total-name')}>
                            <div className={cx('total-title')}>Thành tiền</div>
                            <div className={cx('total-tt')}>{convertPrice(priceMemo)}</div>
                        </div>
                        {diliveryPriceMemo !== 0 && (
                            <div className={cx('delivery-name')}>
                                <div className={cx('delivery-title')}>Giá giảm</div>
                                <div className={cx('delivery-tt')}>{convertPrice(diliveryPriceMemo)}</div>
                            </div>
                        )}

                        <div className={cx('total-sum')}>
                            <div className={cx('sum-title')}>Tổng Số Tiền (gồm VAT)</div>
                            <div className={cx('sum-vat')}>{convertPrice(totalSale)}</div>
                        </div>

                        {!order?.orderItemSelected?.length ? (
                            <Button login disabled className={cx('btn-buy')} onClick={() => handleAddCart()}>
                                THANH TOÁN
                            </Button>
                        ) : (
                            <Button login className={cx('btn-buy')} onClick={() => handleAddCart()}>
                                THANH TOÁN
                            </Button>
                        )}
                        <div className={cx('total-help')}>(Giảm giá trên web chỉ áp dụng cho bán lẻ)</div>
                    </div>
                </div>
            </div>
            <ModalComponent forceRender title="Xóa sản phẩm" open={isModalOpenUpdateInfo} onCancel={handleCancelUpdate} onOk={handleUpdateInfoUser}>
                <Loading isLoading={isLoading}>
                    <WrapperForm name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }} autoComplete="off" form={form} width="50%">
                        <WrapperForm.Item label="Họ và tên người nhận" name="name" rules={[{ required: true, message: 'Thông tin này không thể để trống!' }]}>
                            <WrapperInput placeholder="Nhập họ và tên người nhận" value={stateUserDetail.name} onChange={handleOnChangeDetail} name="name" />
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
                </Loading>
            </ModalComponent>
        </div>
    );
}

export default Cart;
