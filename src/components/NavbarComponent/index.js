import styles from './NavbarComponent.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { Radio } from 'antd';
// import ProductCard from '../ProductCard';

const cx = classNames.bind(styles);
function NavbarComponent(props) {
    const { onChange, className } = props;
    const [showMore, setShowMore] = useState(false);

    const handleShowMore = () => {
        setShowMore(true);
    };
    const handleShowLess = () => {
        setShowMore(false);
    };
    // const [fillProduct, setFillProduct] = useState([]);

    // const onChange = (e) => {
    //     const value = e.target.value;
    //     let arr;
    //     if (value === '0-150.000đ') {
    //         arr = data?.filter((item) => {
    //             return Math.trunc(item.price - (item.price * item.discount) / 100) <= 150000;
    //         });
    //         setFillProduct(arr);
    //     } else if (value === '150.000đ-300.000đ') {
    //         arr = data?.filter((item) => {
    //             return Math.trunc(item.price - (item.price * item.discount) / 100) > 150000 && Math.trunc(item.price - (item.price * item.discount) / 100) < 300000;
    //         });
    //         setFillProduct(arr);
    //     } else if (value === '300.000đ-500.000đ') {
    //         arr = data?.filter((item) => {
    //             return Math.trunc(item.price - (item.price * item.discount) / 100) > 300000 && Math.trunc(item.price - (item.price * item.discount) / 100) < 500000;
    //         });
    //         setFillProduct(arr);
    //     }
    // };
    // console.log(fillProduct);
    return (
        <div className={className}>
            <div className={cx('wrapper')}>
                <div className={cx('type-product')}>
                    <h3 className={cx('title')}>Nhóm sản phẩm</h3>
                    <p className={cx('list')}>Tất cả nhóm sản phẩm</p>
                    <div className={cx(`${cx('list-item')} ${showMore ? cx('show-more') : ''}`)}>
                        <p className={cx('item')}>Thiếu nhi</p>
                        <p className={cx('item')}>Giáo Khoa - Tham Khảo</p>
                        <p className={cx('item')}>Văn Học</p>
                        <p className={cx('item')}>Manga - Comic</p>
                        <p className={cx('item')}>Sách Học Ngoại Ngữ</p>
                    </div>
                    <button className={`${cx('btn-category')} ${showMore ? cx('none-btn') : ''}`} onClick={handleShowMore}>
                        <span className={cx('btn-text')}>
                            Xem thêm
                            <AiOutlineDown />
                        </span>
                    </button>
                    <button className={`${cx('btn-category')} ${!showMore ? cx('none-btn') : ''}`} onClick={handleShowLess}>
                        <span className={cx('btn-text')}>
                            Rút gọn
                            <AiOutlineUp />
                        </span>
                    </button>
                </div>
                <div className={cx('title-price')}>Giá</div>
                <div className={cx('price-product')}>
                    <Radio.Group onChange={onChange}>
                        <div className={cx('list-price-product')}>
                            <span>
                                <Radio className={cx('box-price')} value={'0-150.000đ'}>
                                    0đ - 150.000đ
                                </Radio>
                            </span>
                            <span>
                                <Radio className={cx('box-price')} value={'150.000đ-300.000đ'}>
                                    150.000đ - 300.000đ
                                </Radio>
                            </span>
                            <span>
                                <Radio className={cx('box-price')} value={'300.000đ-500.000đ'}>
                                    300.000đ - 500.000đ
                                </Radio>
                            </span>
                            <span>
                                <Radio className={cx('box-price')} value={'500.000đ'}>
                                    500.000đ - trở lên
                                </Radio>
                            </span>
                        </div>
                    </Radio.Group>
                </div>
            </div>
            {/* <div className={cx('list-product')}>
                {fillProduct?.map((product) => {
                    return (
                        <ProductCard
                            className={cx('search-product')}
                            key={product._id}
                            image={product.image}
                            name={product.name}
                            price={product.price}
                            rating={product.rating}
                            sold={product.sold}
                            discount={product.discount}
                            chapter={product.chapter}
                            countInStock={product.countInStock}
                            id={product._id}
                        />
                    );
                })}
            </div> */}
        </div>
    );
}

export default NavbarComponent;
