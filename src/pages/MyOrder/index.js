import { useQuery } from 'react-query';
// import { useSelector } from 'react-redux';
import Loading from '~/components/LoadingComponent';
import * as OrderService from '~/service/OrderSevice';
import classNames from 'classnames/bind';
import style from './MyOrder.module.scss';
import Button from '~/components/Button';
import { convertPrice } from '~/ultil';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutationHooks } from '~/hooks/useMutationHook';
import { useEffect } from 'react';
import * as messages from '~/components/Message';
const cx = classNames.bind(style);
function MyOrder() {
    // const user = useSelector((state) => state?.user);
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();
    const fetchMyOrder = async () => {
        const res = await OrderService.getDetailOrderUser(state?.id, state?.token);

        return res.data;
    };
    const queryOrder = useQuery(
        { queryKey: ['orders'], queryFn: fetchMyOrder },
        {
            enabled: state?.id && state?.token,
        },
    );
    const { data, isLoading } = queryOrder;
    const handleDetailsOrder = (id) => {
        navigate(`/detail_Order/${id}`, {
            state: {
                token: state?.token,
            },
        });
    };

    const mutation = useMutationHooks((data) => {
        const { id, token, orderItems, userId } = data;
        const res = OrderService.cancelOrder(id, token, orderItems, userId);
        return res;
    });

    const handleCancelOrder = (order) => {
        mutation.mutate(
            {
                id: order._id,
                token: state.token,
                orderItems: order.orderItems, // toàn bộ hoặc lọc item cần hủy
            },
            { onSuccess: () => queryOrder.refetch() },
        );
    };

    const { data: dataCancelOrder, isSuccess: isSuccessCancel, isError: isErrorCancel, isLoading: isLoadingCancel } = mutation;

    const renderProduct = (list) => {
        return list?.map((item) => {
            const pricesale = Math.trunc(item?.price - (item?.price * item?.discount) / 100);
            return (
                <div className={cx('product')} key={item?._id}>
                    <img className={cx('img')} src={item?.image} alt="" />
                    <div className={cx('info')}>
                        <div className={cx('name')}>{item?.name}</div>
                        <div className={cx('option-price')}>
                            <span className={cx('price')}>{convertPrice(pricesale)}</span>
                            <span className={cx('price-old')}>{convertPrice(item?.price)}</span>
                        </div>
                    </div>
                </div>
            );
        });
    };

    useEffect(() => {
        if (isSuccessCancel && dataCancelOrder?.status !== 'ERR') {
            messages.success('Huỷ thành công');
        } else if (isErrorCancel && dataCancelOrder?.status === 'ERR') {
            messages.error('Huỷ thất bại');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessCancel, isErrorCancel]);

    return (
        <Loading isLoading={isLoading || isLoadingCancel}>
            <div className={cx('wrapper')}>
                {data?.map((order) => {
                    return (
                        <div className={cx('inner')} key={order?._id}>
                            <div className={cx('order')}>
                                <div className={cx('order-way')}>
                                    <div className={cx('order-option-title')}>TRẠNG THÁI SẢN PHẨM</div>
                                    <div className={cx('order-delivery')}>
                                        Giao Hàng : <span className={cx('order-delivery-text')}>{`${order?.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}`}</span>
                                    </div>
                                    <div className={cx('order-pay')}>
                                        Thanh Toán : <span className={cx('order-pay-text')}>{`${order?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`}</span>
                                    </div>
                                </div>
                                {renderProduct(order?.orderItems)}
                                <div className={cx('total')}>
                                    Tổng tiền : <span className={cx('total-num')}>{convertPrice(order?.totalPrice)}</span>
                                </div>
                            </div>
                            <div className={cx('order-option')}>
                                <Button register className={cx('btn-huy')} onClick={() => handleCancelOrder(order)}>
                                    Hủy Đơn Hàng
                                </Button>
                                <Button login className={cx('btn-detail')} onClick={() => handleDetailsOrder(order?._id)}>
                                    Xem Chi Tiết
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Loading>
    );
}

export default MyOrder;
