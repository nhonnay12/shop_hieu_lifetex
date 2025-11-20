import classNames from 'classnames/bind';

import styles from './ProductSale.module.scss';
import ProductCard from '~/components/ProductCard';
import * as ProductService from '~/service/ProductService';
import { useQuery } from 'react-query';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { GrNext, GrPrevious } from 'react-icons/gr';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function ProductSale() {
    const [data, setData] = useState([]);

    const navigator = useNavigate();

    const fetchProductAll = async () => {
        const res = await ProductService.getHotNews();

        setData(res.stories);
    };
    useEffect(() => {
        fetchProductAll();
    }, []);
    var settings = {
        speed: 100,
        slidesToShow: 5,
        slidesToScroll: 5,
        infinite: false,
        pauseOnHover: true,
        pauseOnFocus: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    };
    function SampleNextArrow(props) {
        const { onClick, name = <GrNext /> } = props;
        return (
            <div className={cx('next')} onClick={onClick}>
                {name}
            </div>
        );
    }

    function SamplePrevArrow(props) {
        const { onClick, name = <GrPrevious /> } = props;
        return (
            <div className={cx('prev')} onClick={onClick}>
                {name}
            </div>
        );
    }

    const handleDetailProduct = (id) => {
        navigator(`/product/${id}`);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('product-top')}>
                    <div className={cx('title-product')}>
                        <h3>Mới nhất</h3>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', margin: '0 70px' }}>
                        {data?.map((product, index) => (
                            <div onClick={() => handleDetailProduct(product?._id)} key={index} className={cx('product-item')} style={{ position: 'relative' }}>
                                <div style={{ width: '200px' }}>
                                    <div className={cx('new-badge')}>New</div>
                                    <img src={product?.image} alt={product?.name} />
                                    <p>{product?.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductSale;
