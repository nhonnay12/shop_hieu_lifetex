import classNames from 'classnames/bind';

import styles from './Introduce.module.scss';
import ProductCard from '~/components/ProductCard';
import * as ProductService from '~/service/ProductService';
import { useQuery } from 'react-query';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { GrNext, GrPrevious } from 'react-icons/gr';

const cx = classNames.bind(styles);

function IntroduceProduct() {
    const limit = 10;
    const page = 1;

    const fetchProductAll = async (context) => {
        const search = '';

        const page = context?.queryKey && context?.queryKey[1];
        const limit = context?.queryKey && context?.queryKey[2];

        const res = await ProductService.getAllProducts(search, page, limit);
        return res;
    };
    const { data: products } = useQuery(['products', page, limit], fetchProductAll, { retry: 3, retryDelay: 1000 });

    var settings = {
        speed: 100,
        slidesToShow: 5,
        slidesToScroll: 5,
        infinite: false,
        pauseOnHover: true,
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

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('product-top')}>
                    <h2 className={cx('title-product')}>FAHASA GIỚI THIỆU</h2>
                    <div className={cx('list-product')}>
                        <Slider {...settings}>
                            {products?.data?.map((product) => {
                                return (
                                    <ProductCard
                                        key={product._id}
                                        image={product.image}
                                        name={product.name}
                                        price={product.price}
                                        pricesale={product.pricesale}
                                        sold={product.sold}
                                        discount={product.discount}
                                        chapter={product.chapter}
                                        countInStock={product.countInStock}
                                        id={product._id}
                                    />
                                );
                            })}
                        </Slider>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IntroduceProduct;
