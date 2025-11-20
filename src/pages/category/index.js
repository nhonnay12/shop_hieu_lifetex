import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavbarComponent from '~/components/NavbarComponent';
import ProductCard from '~/components/ProductCard';
import { MdNavigateNext } from 'react-icons/md';
import * as ProductService from '~/service/ProductService';
import Loading from '~/components/LoadingComponent';
import classNames from 'classnames/bind';
import styles from './category.module.scss';
import { Pagination } from 'antd';
import { useSelector } from 'react-redux';
import useDebounce from '~/hooks/useDebounce';
const cx = classNames.bind(styles);

function Category() {
    const searchProduct = useSelector((state) => state?.product?.search);
    const searchDebounce = useDebounce(searchProduct, 500);
    const { state } = useLocation();
    const [products, setProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    const [panigate, setPanigate] = useState({
        page: 0,
        limit: 10,
        total: 1,
    });
    const fetchProductType = async (type, page, limit) => {
        setLoading(true);
        const res = await ProductService.getProductType(type, page, limit);
        if (res?.status === 'OK') {
            setLoading(false);
            setProduct(res?.data);
            setPanigate({ ...panigate, total: res?.data?.length });
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (state) {
            fetchProductType(state, panigate.page, panigate.limit);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, panigate.page, panigate.limit]);

    const onChange = (current, pageSize) => {
        setPanigate({ ...panigate, page: current - 1, limit: pageSize });
    };
    return (
        <Loading isLoading={loading}>
            <div className={cx('home')}>
                <span>Trang chủ </span>
                <MdNavigateNext />
                <span className={cx('home-type')}>{state}</span>
            </div>
            <h2 className={cx('wrapper')}>
                <NavbarComponent className={cx('navbar')} />
                <div className={cx('inner')}>
                    <div className={cx('list-product')}>
                        {products
                            // eslint-disable-next-line array-callback-return
                            ?.filter((pro) => {
                                if (searchDebounce === '') {
                                    return pro;
                                } else if (pro?.name?.trim()?.toLowerCase()?.includes(searchDebounce?.trim()?.toLowerCase())) {
                                    return pro;
                                } else {
                                    return pro;
                                }
                            })
                            ?.map((product) => {
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
                    </div>
                    <div className={cx('pagination')}>
                        <Pagination defaultCurrent={panigate.page + 1} total={panigate.total} onChange={onChange} style={{ textAlign: 'center', marginTop: '10px' }} />
                    </div>
                </div>
            </h2>
        </Loading>
    );
}

export default Category;
