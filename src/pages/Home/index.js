import classNames from 'classnames/bind';

import styles from './Home.module.scss';
import Banner from './Banner';
import ProductCard from '~/components/ProductCard';
import * as ProductService from '~/service/ProductService';
import * as CategoryService from '~/service/CategoryService';

import { useQuery } from 'react-query';
import Button from '~/components/Button';
import { ImgBanner, typeImage } from '~/assets/images';
import ProductSale from '~/components/ProductSale';

const cx = classNames.bind(styles);

function Home() {
    const limit = 10;
    const page = 0;

    const fetchProductAll = async (context) => {
        const search = '';
        //lấy key số 1 trong mảng query
        const page = context?.queryKey && context?.queryKey[1];
        const limit = context?.queryKey && context?.queryKey[2];

        const res = await ProductService.getAllProducts(search, page, limit);
        return res;
    };
    const { data: products } = useQuery(['products', page, limit], fetchProductAll, { retry: 3, retryDelay: 1000 });

    const getAllCategory = async () => {
        const res = await CategoryService.getAllCategory();

        return res;
    };
    const queryCategory = useQuery(['category'], getAllCategory);
    const { data: category } = queryCategory;
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Banner />
                <div className={cx('banner-img')}>
                    {ImgBanner.map((banner) => (
                        <img key={banner.iBanner} src={banner.iBanner} alt="" className={cx('banner-img-name')} />
                    ))}
                </div>
                <div className={cx('type-product')}>
                    <div className={cx('item-type')}>
                        <img src={typeImage.typeImage1} alt="" />
                        <div className={cx('item-type-name')}>Sale Thứ 3</div>
                    </div>
                    <div className={cx('item-type')}>
                        <img src={typeImage.typeImage2} alt="" />
                        <div className={cx('item-type-name')}>Trở Lại Trường Học</div>
                    </div>
                    <div className={cx('item-type')}>
                        <img src={typeImage.typeImage3} alt="" />
                        <div className={cx('item-type-name')}>Tiktok Trending</div>
                    </div>
                    <div className={cx('item-type')}>
                        <img src={typeImage.typeImage4} alt="" />
                        <div className={cx('item-type-name')}>Flash Sale</div>
                    </div>
                    <div className={cx('item-type')}>
                        <img src={typeImage.typeImage5} alt="" />
                        <div className={cx('item-type-name')}>Mã Giảm Giá</div>
                    </div>
                    <div className={cx('item-type')}>
                        <img src={typeImage.typeImage6} alt="" />
                        <div className={cx('item-type-name')}>Phiên Chợ Sách cũ</div>
                    </div>
                    <div className={cx('item-type')}>
                        <img src={typeImage.typeImage7} alt="" />
                        <div className={cx('item-type-name')}>Sản Phẩm Mới</div>
                    </div>
                    <div className={cx('item-type')}>
                        <img src={typeImage.typeImage8} alt="" />
                        <div className={cx('item-type-name')}>Văn Phòng Phẩm</div>
                    </div>
                    <div className={cx('item-type')}>
                        <img src={typeImage.typeImage9} alt="" />
                        <div className={cx('item-type-name')}>Xu hướng</div>
                    </div>
                    <div className={cx('item-type')}>
                        <img src={typeImage.typeImage10} alt="" />
                        <div className={cx('item-type-name')}>Manga</div>
                    </div>
                </div>

                <ProductSale />
                {/* <div className={cx('category')}>
 
                    {category?.data?.map((item) => {
                        return (
                            <div key={item?._id} className={cx('item-category')}>
                                <img src={item?.image} alt="" className={cx('img-category')} />
                                <p className={cx('name-category')}>{item?.nameType}</p>
                            </div>
                        );
                    })}
                </div> */}
                <div className={cx('product-top')}>
                    <div className={cx('top-sp')}>
                        <h3>XU HƯỚNG MUA SẮM</h3>
                    </div>
                    <div className={cx('list-product')}>
                        {products?.stories?.map((product) => {
                            return (
                                <ProductCard
                                    key={product.id}
                                    image={product.image}
                                    name={product.name}
                                    price={product.price}
                                    pricesale={product.pricesale}
                                    rating={product.rating}
                                    sold={product.sold}
                                    discount={product.discount}
                                    content={product.content}
                                    description={product.description}
                                    age={product.age}
                                    type={product.type}
                                    id={product._id}
                                />
                            );
                        })}
                    </div>
                    <Button register className={cx('btn-more')}>
                        Xem thêm
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Home;
