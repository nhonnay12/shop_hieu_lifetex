import classNames from 'classnames/bind';

import styles from './SearchPage.module.scss';
import * as ProductService from '~/service/ProductService';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useContext, useEffect } from 'react';
import { useState } from 'react';
import Loading from '~/components/LoadingComponent';
import NavbarComponent from '~/components/NavbarComponent';
import useDebounce from '~/hooks/useDebounce';
import { SearchContext } from '~/context/SearchContext';
import ProductCard2 from '~/components/ProductCard/ProductCard1';

const cx = classNames.bind(styles);

function SearchPage() {
    // const [loading, setLoading] = useState(false);

    const { searchResult, setSearchResult } = useContext(SearchContext);

    const [stateProduct, setStateProduct] = useState([]);

    useEffect(() => {
        setStateProduct(searchResult);
    }, [searchResult]);

    const handleNavbar = (e) => {
        const value = e.target.value;
        let arr;
        if (value === '0-150.000đ') {
            arr = searchResult?.filter((item) => {
                return Math.trunc(item.price - (item.price * item.discount) / 100) <= 150000;
            });
            setStateProduct(arr);
        } else if (value === '150.000đ-300.000đ') {
            arr = searchResult?.filter((item) => {
                return Math.trunc(item.price - (item.price * item.discount) / 100) > 150000 && Math.trunc(item.price - (item.price * item.discount) / 100) < 300000;
            });
            setStateProduct(arr);
        } else if (value === '300.000đ-500.000đ') {
            arr = searchResult?.filter((item) => {
                return Math.trunc(item.price - (item.price * item.discount) / 100) > 300000 && Math.trunc(item.price - (item.price * item.discount) / 100) < 500000;
            });
            setStateProduct(arr);
        } else if (value === '500.000đ') {
            arr = searchResult?.filter((item) => {
                return Math.trunc(item.price - (item.price * item.discount) / 100) >= 500000;
            });
            setStateProduct(arr);
        }
    };

    return (
        <div>
            <h2 className={cx('wrapper')}>
                <NavbarComponent className={cx('navbar')} onChange={handleNavbar} />
                <div className={cx('inner')}>
                    <div className={cx('list-product')}>
                        {stateProduct?.map((product) => {
                            return <ProductCard2 key={product._id} {...product} />;
                        })}
                    </div>
                </div>
            </h2>
        </div>
    );
}

export default SearchPage;
