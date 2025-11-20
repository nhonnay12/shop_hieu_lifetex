import classNames from 'classnames/bind';
import style from './OrderSuccess.module.scss';

import Loading from '~/components/LoadingComponent';
import { useLocation } from 'react-router-dom';
import { orderContant } from '~/contant';
import { convertPrice } from '~/ultil';
const cx = classNames.bind(style);
function OrderSuccess() {
    const location = useLocation();
    const { state } = location;

    console.log('🚀 ~ OrderSuccess ~ state:', state);

    return (
        <Loading isLoading={false}>
            <div className={cx('wrapper')}>
                <div className={cx('inner')}>
                    <div className={cx('delivery')}>
                        <div className={cx('delivery-title')}>Phương Thức giao hàng:</div>
                        <div className={cx('delivery-way')}>{orderContant.delivery[state?.delivery]}</div>
                    </div>
                    <div className={cx('method-buy')}>
                        <div className={cx('method-title')}>Phương thức thanh Toán:</div>
                        <div className={cx('method-way')}>
                            <div className={cx('method-text')}>
                                <span>{orderContant.payment[state?.payment]}</span>
                            </div>
                        </div>
                    </div>
                    {state?.order?.map((item) => {
                        const priceSale = Math.trunc(item?.price - (item?.price * item?.discount) / 100);

                        return (
                            <div className={cx('product')} key={item.product}>
                                <img className={cx('img')} src={item.image} alt="" />
                                <div className={cx('card')}>
                                    <div className={cx('name')}>{item.name}</div>
                                    <div className={cx('price')}>
                                        <div className={cx('price-curr')}>{convertPrice(item.price)}</div>
                                        <div className={cx('price-sale')}>{convertPrice(priceSale)}</div>
                                        <div className={cx('amount')}>Số Lượng : {item.amount}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Loading>
    );
}
export default OrderSuccess;
