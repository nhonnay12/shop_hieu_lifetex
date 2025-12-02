import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { CustomCheckbox, WrapperInputNumber, WrapperForm, WrapperInput } from './style';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { MdDeleteForever, MdNavigateNext } from 'react-icons/md';
import { TbTicket } from 'react-icons/tb';
import { CiWarning } from 'react-icons/ci';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slides/orderSlide';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { convertPrice } from '../../ultil';
import Button from '../../components/Button';
import * as messages from '../../components/Message';
import ModalComponent from '../Admin/ComponentAdmin/ModalComponent';
import { Form } from 'antd';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../service/UserService';
import Loading from '../../components/LoadingComponent';
import { updateUser } from '../../redux/slides/userSlide';
import StepComponet from '../../components/StepComponent';

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

    useEffect(() => {
        if (!user.access_token) {
            messages.warning('Vui lòng đăng nhập để xem giỏ hàng');
            navigate('/login');
        }
    }, [user, navigate]);

    // Cập nhật danh sách sản phẩm được chọn vào Redux mỗi khi listChecked thay đổi
    useEffect(() => {
        dispatch(selectedOrder({ listChecked }));
    }, [listChecked, dispatch]);

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

    const handleOnChangeCheck = (index) => {
        // Sử dụng index làm định danh
        if (listChecked.includes(index)) {
            setListChecked(listChecked.filter((item) => item !== index));
        } else {
            setListChecked([...listChecked, index]);
        }
    };

    const handleCheckAll = (e) => {
        if (e.target.checked) {
            const allItemIndices = order?.orderItems?.map((_, index) => index).filter((index) => order.orderItems[index].countInStock > 0) || [];
            setListChecked(allItemIndices);
        } else {
            setListChecked([]);
        }
    };

    const handleChangeCount = (type, index) => {
        const item = order.orderItems[index];
        if (!item) return;
        const { amount, countInStock } = item;

        if (type === 'increase') {
            if (amount < countInStock) {
                dispatch(increaseAmount({ index: item.index }));
            }
        } else if (type === 'decrease') {
            if (amount > 1) {
                dispatch(decreaseAmount({ index: item.index }));
            }
        }
    };

    // Logic Xóa 1 Item (Giữ nguyên)
    const handleDeleteOrder = (index) => {
        dispatch(removeOrderProduct({ index }));
        // Xóa khỏi listChecked nếu đang chọn
        setListChecked(listChecked.filter((item) => item !== index));
    };

    // Logic Xóa Tất Cả Item Đã Chọn (Giữ nguyên)
    const handleDeleteAllOrder = () => {
        if (listChecked.length > 0) {
            dispatch(removeAllOrderProduct({ listChecked }));
            // Reset lại danh sách đã chọn ở local state sau khi dispatch action
            setListChecked([]);
        }
    };

    // --- TÍNH TOÁN GIÁ ---
    const priceMemo = useMemo(() => {
        const result = order?.orderItemSelected?.reduce((total, curr) => {
            const priceSale = curr.price - (curr.price * curr.discount) / 100;
            return total + Math.trunc(priceSale) * (curr.amount || 1);
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

        // Check stock lần cuối (Sử dụng itemsChecked đã tính toán)
        const invalidItems = order.orderItemSelected.filter((item) => item.amount > item.countInStock || item.countInStock === 0);
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
    const inStockItemIndices = useMemo(
        () =>
            order?.orderItems
                ?.map((item, index) => ({ ...item, index }))
                .filter((item) => item.countInStock > 0)
                .map((item) => item.index) || [],
        [order?.orderItems],
    );
    const isCheckAll = useMemo(() => inStockItemIndices.length > 0 && listChecked.length === inStockItemIndices.length, [listChecked, inStockItemIndices]);

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
                        <CustomCheckbox
                            className={cx('checkbox-all')}
                            onChange={handleCheckAll}
                            checked={isCheckAll}
                            disabled={inStockItemIndices.length === 0}
                            title="Chọn tất cả sản phẩm còn hàng"
                        />
                        <span className={cx('text-all')}>Chọn tất cả ({inStockItemIndices.length} sản phẩm còn hàng)</span>
                        <div className={cx('title-amount')}>Số lượng</div>
                        <div className={cx('title-buy')}>Thành tiền</div>
                        <MdDeleteForever className={cx('delete-cart-all')} onClick={handleDeleteAllOrder} style={{ cursor: 'pointer' }} title="Xóa các sản phẩm đã chọn" />
                    </div>

                    {/* Danh sách sản phẩm */}
                    <div className={cx('content')}>
                        {order?.orderItems?.map((item, index) => {
                            // index ở đây là index thật trong mảng
                            const priceSale = Math.trunc(item.price - (item.price * item.discount) / 100);
                            const isOOS = item.countInStock === 0; // Out of stock

                            // Đảm bảo amount luôn có giá trị
                            const currentAmount = item.amount ? item.amount : 1;

                            return (
                                <div key={index} className={cx('product-cart')}>
                                    <div className={cx('checkbox-all-width')}>
                                        {!isOOS ? ( // Chỉ cho phép check nếu còn hàng
                                            <CustomCheckbox className={cx('checkbox-item')} onChange={() => handleOnChangeCheck(index)} checked={listChecked.includes(index)} />
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
                                                        onClick={() => handleChangeCount('decrease', { index, amount: currentAmount, countInStock: item.countInStock })}
                                                    >
                                                        <FaMinus />
                                                    </button>

                                                    <WrapperInputNumber readOnly min={1} max={item.countInStock} value={currentAmount} className={cx('input-amount')} />

                                                    <button
                                                        className={cx('btn-more')}
                                                        style={{
                                                            border: 'none',
                                                            background: 'transparent',
                                                            cursor: currentAmount >= item.countInStock ? 'not-allowed' : 'pointer',
                                                        }}
                                                        onClick={() => handleChangeCount('increase', { index, amount: currentAmount, countInStock: item.countInStock })}
                                                    >
                                                        <FaPlus />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className={cx('total-price')}>{convertPrice(priceSale * currentAmount)}</div>

                                        <div className={cx('delete-cart')}>
                                            <MdDeleteForever
                                                onClick={() => handleDeleteOrder(index)}
                                                className={cx('delete-icon')}
                                                title="Xóa sản phẩm"
                                                style={{ cursor: 'pointer' }}
                                            />
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
