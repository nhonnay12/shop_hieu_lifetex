import classNames from 'classnames/bind';
import style from './DetailOrder.module.scss';
import { useLocation, useParams } from 'react-router-dom';
import * as OrderService from '~/service/OrderSevice';
import { useQuery } from 'react-query';
import { orderContant } from '~/contant';
import Loading from '~/components/LoadingComponent';
import { convertPrice } from '~/ultil';

const cx = classNames.bind(style);
function DetailOrder() {
    const params = useParams();
    const location = useLocation();
    const { state } = location;
    const { id } = params;
    const fetchMyOrderDetail = async () => {
        const res = await OrderService.getDetailOrder(id, state?.token);
        return res.data;
    };
    const queryOrder = useQuery(
        { queryKey: ['orders-detail'], queryFn: fetchMyOrderDetail },
        {
            enabled: id,
        },
    );
    const { data, isLoading } = queryOrder;
    return (
        <Loading isLoading={isLoading}>
            <div className={cx('wrapper')}>
                <div className={cx('info-user-pay')}>
                    <div className={cx('Title')}>Chi Tiết Đơn Hàng</div>
                    <div className={cx('info')}>
                        <div className={cx('info-name')}>
                            Tên Khách Hàng :<span className={cx('info-name-text')}>{data?.shippingAddress?.fullName}</span>
                        </div>
                        <div className={cx('info-place')}>
                            Địa Chỉ :{' '}
                            <span className={cx('info-place-text')}>
                                {data?.shippingAddress?.address} - {data?.shippingAddress?.city}
                            </span>
                        </div>
                        <div className={cx('info-phone')}>
                            Điện Thoại : <span className={cx('info-phone-num')}> {data?.shippingAddress?.phone}</span>
                        </div>
                    </div>
                    <div className={cx('delivery')}>
                        <div>
                            <span className={cx('delivery-way')}>Hình Thức Giao Hàng : </span>
                            <span className={cx('delivery-name')}>{orderContant.delivery[data?.deliveryMethod]}</span>
                        </div>
                        <span className={cx('delivery-price')}>
                            Phí Giao Hàng : <span> {convertPrice(data?.shippingPrice)}</span>
                        </span>
                    </div>
                    <div className={cx('pay')}>
                        <span className={cx('pay-title')}>Hình Thức Thanh Toán :</span>
                        <span className={cx('pay-way')}>{orderContant.payment[data?.paymentMethod]}</span>
                        <div className={cx('pay-was')}>{`${data?.isPaid ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}`}</div>
                    </div>
                </div>
                {data?.orderItems?.map((item) => {
                    const pricesale = Math.trunc(item?.price - (item?.price * item?.discount) / 100);
                    return (
                        <div key={item?._id}>
                            <div className={cx('product')}>
                                <img src={item?.image} alt="" className={cx('product-img')} />
                                <div className={cx('product-name-list')}>
                                    <span className={cx('product-name')}>{item?.name}</span>
                                    <div>
                                        <span className={cx('product-price')}>{convertPrice(pricesale)}</span>
                                        <span className={cx('product-price-old')}>{convertPrice(item?.price)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('product-info')}>
                                <div className={cx('product-info-discount')}>
                                    Giảm giá : <span className={cx('discount-text')}>{item?.discount}%</span>
                                </div>
                                <div className={cx('product-info-price')}>
                                    Giá sản phẩm :<span className={cx('product-info-price-text')}> {convertPrice(pricesale)}</span>
                                </div>
                                <div className={cx('product-info-amount')}>
                                    {' '}
                                    Số Lượng sản phẩm : <span className={cx('product-info-amount-text')}>{item?.amount}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div className={cx('total-info')}>
                    <div className={cx('product-info-delivery')}>Phí Giao Hàng : {convertPrice(data?.shippingPrice)}</div>
                    <div className={cx('product-info-total')}>Tổng Tiền : {convertPrice(data?.totalPrice)}</div>
                </div>
            </div>
        </Loading>
    );
}

export default DetailOrder;
