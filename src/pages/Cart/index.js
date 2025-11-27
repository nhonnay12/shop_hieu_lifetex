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
import { Form } from 'antd';
import { useMutationHooks } from '~/hooks/useMutationHook';
import * as UserService from '~/service/UserService';
import Loading from '~/components/LoadingComponent';
import { updateUser } from '~/redux/slides/userSlide';
import StepComponet from '~/components/StepComponent';

const cx = classNames.bind(styles);

function Cart() {
    const order = useSelector((state) => state?.order);
    const user = useSelector((state) => state.user);
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

    // Cập nhật selectedOrder vào Redux mỗi khi listChecked thay đổi
    useEffect(() => {
        dispatch(selectedOrder({ listChecked }));
    }, [listChecked, dispatch]);

    useEffect(() => {
        if (!user.access_token) {
            messages.warning('Vui lòng đăng nhập để xem giỏ hàng');
            navigate('/login');
        }
    }, [user, navigate]);

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
    }, [isModalOpenUpdateInfo, user]);

    const handleOnChangeDetail = (e) => {
        setStateUserDetail({
            ...stateUserDetail,
            [e.target.name]: e.target.value,
        });
    };

    // --- SỬA LOGIC CHECKBOX TỪNG ITEM ---
    // Truyền trực tiếp idProduct vào hàm, không lấy qua e.target.value để tránh lỗi
    const handleOnChangeCheck = (e, idProduct) => {
        if (e.target.checked) {
            setListChecked([...listChecked, idProduct]);
        } else {
            setListChecked(listChecked.filter((item) => item !== idProduct));
        }
    };

    // --- SỬA LOGIC CHECK ALL ---
    const handleCheckAll = (e) => {
        if (e.target.checked) {
            // Chỉ chọn những sản phẩm CÒN HÀNG (countInStock > 0)
            const newListChecked = [];
            order?.orderItems?.forEach((item) => {
                if (item.countInStock > 0) {
                    newListChecked.push(item.product);
                }
            });
            setListChecked(newListChecked);
        } else {
            setListChecked([]);
        }
    };

    // --- SỬA LOGIC THAY ĐỔI SỐ LƯỢNG ---
    const handleChangeCount = (type, idProduct, countInStock) => {
        const item = order?.orderItems.find((i) => i.product === idProduct);
        if (!item) return;

        if (type === 'increase') {
            if (item.amount < countInStock) {
                dispatch(increaseAmount({ idProduct }));
            } else {
                messages.warning(`Chỉ còn lại ${countInStock} sản phẩm`);
            }
        } else if (type === 'decrease') {
            if (item.amount > 1) {
                dispatch(decreaseAmount({ idProduct }));
            }
        }
    };

    // Input thay đổi số lượng
    const handleOnChangeAmount = (value, idProduct, countInStock) => {
        let newAmount = Number(value);
        if (!newAmount || newAmount < 1) newAmount = 1; // Mặc định là 1 nếu xóa trắng hoặc nhập 0

        if (newAmount > countInStock) {
            messages.warning(`Không thể mua quá số lượng tồn kho (${countInStock})`);
            newAmount = countInStock; // Reset về max
        }

        // Logic sync với Redux (bạn có thể thay bằng action updateAmount trực tiếp nếu có)
        const item = order?.orderItems?.find((item) => item.product === idProduct);
        if (item) {
            const diff = newAmount - item.amount;
            if (diff > 0) {
                for (let i = 0; i < diff; i++) dispatch(increaseAmount({ idProduct }));
            } else if (diff < 0) {
                for (let i = 0; i < Math.abs(diff); i++) dispatch(decreaseAmount({ idProduct }));
            }
        }
    };

    const handleDeleteOrder = (idProduct) => {
        dispatch(removeOrderProduct({ idProduct }));
        // Xóa khỏi listChecked nếu đang chọn
        setListChecked(listChecked.filter((item) => item !== idProduct));
    };

    const handleDeleteAllOrder = () => {
        if (listChecked.length > 0) {
            dispatch(removeAllOrderProduct({ listChecked }));
            setListChecked([]);
        }
    };

    // --- TÍNH TOÁN GIÁ ---
    const priceMemo = useMemo(() => {
        const result = order?.orderItemSelected?.reduce((total, curr) => {
            const priceSale = curr.price - (curr.price * curr.discount) / 100;
            return total + Math.trunc(priceSale) * curr.amount;
        }, 0);
        return result;
    }, [order]);

    const diliveryPriceMemo = useMemo(() => {
        if (priceMemo >= 500000) return 30000;
        if (priceMemo >= 200000) return 20000;
        return 0;
    }, [priceMemo]);

    const totalSale = priceMemo - diliveryPriceMemo;

    // --- UPDATE USER ---
    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rest } = data;
        return UserService.updateUser(id, { ...rest }, token);
    });

    const { isLoading, data, isSuccess, isError } = mutationUpdate;

    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            messages.success('Cập nhật thông tin thành công');
            handleAddCart(); // Gọi lại thanh toán sau khi update xong
        } else if (isError) {
            messages.error('Cập nhật thất bại');
        }
    }, [isSuccess, isError]);

    // --- THANH TOÁN ---
    const handleAddCart = () => {
        if (!listChecked.length) {
            messages.error('Vui lòng chọn sản phẩm cần mua');
            return;
        }

        // Check stock lần cuối
        const invalidItems = order?.orderItemSelected?.filter((item) => item.amount > item.countInStock || item.countInStock === 0);
        if (invalidItems?.length > 0) {
            const nameInvalid = invalidItems.map((i) => i.name).join(', ');
            messages.error(`Sản phẩm ${nameInvalid} đã hết hàng hoặc không đủ số lượng!`);
            return;
        }

        if (!user?.phone || !user?.address || !user?.name || !user?.city) {
            setIsModalOpenUpdateInfo(true);
        } else {
            navigate('/checkout');
        }
    };

    const handleCancelUpdate = () => {
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

    const itemsDelivery = [
        { title: '0đ', description: 'Giảm giá' },
        { title: '20.000đ', description: 'Trên 200.000đ' },
        { title: '30.000đ', description: 'Trên 500.000đ' },
    ];

    // Lọc ra các item còn hàng để tính toán việc "Chọn tất cả" có được check hay không
    const inStockItems = order?.orderItems?.filter((item) => item.countInStock > 0) || [];
    const isCheckAll = inStockItems.length > 0 && inStockItems.every((item) => listChecked.includes(item.product));

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title-cart')}>
                <span className={cx('title')}>Giỏ Hàng</span>
                <span className={cx('title-count')}>({order?.orderItems?.length} Sản Phẩm)</span>
            </div>

            <div className={cx('step')}>
                <StepComponet items={itemsDelivery} current={diliveryPriceMemo === 20000 ? 1 : diliveryPriceMemo === 30000 ? 2 : 0} />
            </div>

            <div className={cx('inner')}>
                <div className={cx('container')}>
                    {/* Header Giỏ hàng */}
                    <div className={cx('check-all')}>
                        <CustomCheckbox className={cx('checkbox-all')} onChange={handleCheckAll} checked={isCheckAll} />
                        <span className={cx('text-all')}>Chọn tất cả ({inStockItems.length} sản phẩm còn hàng)</span>
                        <div className={cx('title-amount')}>Số lượng</div>
                        <div className={cx('title-buy')}>Thành tiền</div>
                        <div className={cx('delete-cart-all')}>
                            <MdDeleteForever onClick={handleDeleteAllOrder} style={{ cursor: 'pointer' }} />
                        </div>
                    </div>

                    {/* Danh sách sản phẩm */}
                    <div className={cx('content')}>
                        {order?.orderItems?.map((item) => {
                            const priceSale = Math.trunc(item.price - (item.price * item.discount) / 100);
                            const isOOS = item.countInStock === 0; // Out of stock

                            // Đảm bảo amount luôn có giá trị
                            const currentAmount = item.amount ? item.amount : 1;

                            return (
                                <div key={item.product} className={cx('product-cart')}>
                                    <div className={cx('checkbox-all-width')}>
                                        {!isOOS ? (
                                            <CustomCheckbox
                                                className={cx('checkbox-all')}
                                                onChange={(e) => handleOnChangeCheck(e, item.product)}
                                                checked={listChecked.includes(item.product)}
                                            />
                                        ) : (
                                            <CiWarning style={{ color: 'red', fontSize: '20px' }} title="Hết hàng" />
                                        )}
                                    </div>

                                    <img src={item.image} alt={item.name} className={cx('product-img')} />

                                    <div className={cx('product-info')}>
                                        <span className={cx('product-name')}>{item.name}</span>
                                        <div className={cx('price')}>
                                            <div className={cx('product-price')}>{convertPrice(priceSale)}</div>
                                            {item.discount !== 0 && <div className={cx('product-price-old')}>{convertPrice(item.price)}</div>}
                                        </div>
                                        <div style={{ color: isOOS ? 'red' : 'green', fontSize: '12px' }}>{isOOS ? 'Hết hàng' : `Còn hàng (${item.countInStock})`}</div>
                                    </div>

                                    <div className={cx('option')}>
                                        <div className={cx('option-price')}>
                                            {/* Chỉ hiện nút tăng giảm khi còn hàng */}
                                            {!isOOS && (
                                                <div className={cx('amount-so')}>
                                                    <button
                                                        className={cx('btn-less')}
                                                        style={{ border: 'none', background: 'transparent', cursor: currentAmount === 1 ? 'not-allowed' : 'pointer' }}
                                                        onClick={() => handleChangeCount('decrease', item.product, item.countInStock)}
                                                    >
                                                        <FaMinus />
                                                    </button>

                                                    {/* INPUT SỐ LƯỢNG: Fix lỗi không hiện số */}
                                                    <WrapperInputNumber
                                                        min={1}
                                                        max={item.countInStock}
                                                        defaultValue={1}
                                                        value={currentAmount}
                                                        className={cx('input-amount')}
                                                        onChange={(val) => handleOnChangeAmount(val, item.product, item.countInStock)}
                                                    />

                                                    <button
                                                        className={cx('btn-more')}
                                                        style={{
                                                            border: 'none',
                                                            background: 'transparent',
                                                            cursor: currentAmount >= item.countInStock ? 'not-allowed' : 'pointer',
                                                        }}
                                                        onClick={() => handleChangeCount('increase', item.product, item.countInStock)}
                                                    >
                                                        <FaPlus />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className={cx('total-price')}>{convertPrice(priceSale * currentAmount)}</div>

                                        <div className={cx('delete-cart')}>
                                            <MdDeleteForever onClick={() => handleDeleteOrder(item.product)} style={{ cursor: 'pointer' }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Phần Tổng tiền bên phải */}
                <div className={cx('sale')}>
                    <div className={cx('sale-inner')}>
                        {/* ... (Giữ nguyên phần Ticket khuyến mãi của bạn) ... */}
                        <div className={cx('title-sale')}>
                            <div className={cx('sale-text')}>
                                <TbTicket className={cx('sale-text-icon')} />
                                Khuyến mãi
                            </div>
                        </div>
                    </div>

                    <div className={cx('total')}>
                        <div className={cx('address')}>
                            <div className={cx('address-text')}>
                                Địa chỉ: {user?.address} - {user?.city}
                            </div>
                            <div className={cx('address-change')} onClick={() => setIsModalOpenUpdateInfo(true)}>
                                Thay đổi
                            </div>
                        </div>

                        <div className={cx('total-name')}>
                            <div className={cx('total-title')}>Thành tiền</div>
                            <div className={cx('total-tt')}>{convertPrice(priceMemo)}</div>
                        </div>

                        {diliveryPriceMemo !== 0 && (
                            <div className={cx('delivery-name')}>
                                <div className={cx('delivery-title')}>Giảm giá vận chuyển</div>
                                <div className={cx('delivery-tt')}>{convertPrice(diliveryPriceMemo)}</div>
                            </div>
                        )}

                        <div className={cx('total-sum')}>
                            <div className={cx('sum-title')}>Tổng tiền</div>
                            <div className={cx('sum-vat')}>{convertPrice(totalSale)}</div>
                        </div>

                        {/* Nút Mua Hàng */}
                        <Button
                            login
                            className={cx('btn-buy')}
                            onClick={handleAddCart}
                            disabled={!listChecked.length} // Disable nếu chưa chọn sp nào
                        >
                            THANH TOÁN
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modal Update Info (Giữ nguyên) */}
            <ModalComponent forceRender title="Cập nhật thông tin giao hàng" open={isModalOpenUpdateInfo} onCancel={handleCancelUpdate} onOk={handleUpdateInfoUser}>
                <Loading isLoading={isLoading}>
                    <WrapperForm form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} autoComplete="off">
                        <WrapperForm.Item label="Họ tên" name="name" rules={[{ required: true }]}>
                            <WrapperInput name="name" onChange={handleOnChangeDetail} />
                        </WrapperForm.Item>
                        <WrapperForm.Item label="Địa chỉ" name="address" rules={[{ required: true }]}>
                            <WrapperInput name="address" onChange={handleOnChangeDetail} />
                        </WrapperForm.Item>
                        <WrapperForm.Item label="SĐT" name="phone" rules={[{ required: true }]}>
                            <WrapperInput name="phone" onChange={handleOnChangeDetail} />
                        </WrapperForm.Item>
                        <WrapperForm.Item label="Thành phố" name="city" rules={[{ required: true }]}>
                            <WrapperInput name="city" onChange={handleOnChangeDetail} />
                        </WrapperForm.Item>
                    </WrapperForm>
                </Loading>
            </ModalComponent>
        </div>
    );
}

export default Cart;
