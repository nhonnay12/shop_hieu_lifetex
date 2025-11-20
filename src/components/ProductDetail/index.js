import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss';
import { Col, Row, Image, Rate, message } from 'antd';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineShoppingCart } from 'react-icons/ai';
import { GrFormNext } from 'react-icons/gr';
import { BsPencil } from 'react-icons/bs';
import * as ProductService from '~/service/ProductService';
import chunk from 'lodash/chunk';
import { InputNumber } from 'antd';
import Button from '../Button';
import Button1 from '@mui/material/Button';
import { useQuery } from 'react-query';
import Loading from '../LoadingComponent';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addOrderProduct } from '~/redux/slides/orderSlide';
import { convertPrice } from '~/ultil';
import IntroduceProduct from '../IntroduceProduct';
import { useMutationHooks } from '~/hooks/useMutationHook';
import * as CommentService from '~/service/CommentService';
import ModalComponent from '~/pages/Admin/ComponentAdmin/ModalComponent';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { WrapperRate, WrapperRate1 } from './style';
import WrapperBook from './wrappBook';
import { MdDelete } from 'react-icons/md';

const cx = classNames.bind(styles);
function ProductDetail({ idProduct }) {
    const [numProduct, setNumProduct] = useState(1);
    const [open, setOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onChange = (value) => {
        setNumProduct(Number(value));
    };
    const user = useSelector((state) => state.user);

    const handleChangeCount = (type) => {
        if (type === 'increase') {
            setNumProduct(numProduct + 1);
        } else {
            if (numProduct <= 1) {
                setNumProduct(1);
            } else {
                setNumProduct(numProduct - 1);
            }
        }
    };
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    // const { isLoading, isSuccess, isError, data } = mutationAddOrder;
    const handleAddProductCartBuy = () => {
        dispatch(
            addOrderProduct({
                orderItem: {
                    name: productDetails?.name,
                    amount: numProduct,
                    image: productDetails?.image,
                    discount: productDetails?.discount,
                    price: productDetails?.price,
                    pricesale: productDetails?.pricesale,
                    story: productDetails?._id,
                    countInStock: productDetails?.countInStock,
                },
            }),
        );
        navigate('/cart');
    };
    const handleAddProductCart = () => {
        if (!user?.access_token) {
            alert('Vui lòng đăng nhập để tiếp tục mua hàng');
            navigate('/login');
            return;
        }
        dispatch(
            addOrderProduct({
                orderItem: {
                    name: productDetails?.name,
                    amount: numProduct,
                    image: productDetails?.image,
                    discount: productDetails?.discount,
                    price: productDetails?.price,
                    pricesale: productDetails?.pricesale,
                    story: productDetails?._id,
                    countInStock: productDetails?.countInStock,
                },
            }),
        );
        message.success('Thêm sản phẩm vào giỏ hàng thành công');
    };

    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1];
        if (id) {
            const res = await ProductService.getDetailProduct(id);

            return res.story;
        }
    };
    const { isLoading, data: productDetails } = useQuery(['product-details', idProduct], fetchGetDetailsProduct, {
        enabled: !!idProduct,
    });

    const priceSale = Math.trunc(productDetails?.price - (productDetails?.price * productDetails?.discount) / 100);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [comment, setStateComment] = useState('');
    const handleOnChangeComment = (e) => {
        setStateComment(e.target.value);
    };
    const mutationAddComment = useMutationHooks((data) => {
        const { token, ...rest } = data;
        const res = CommentService.createComment({ ...rest }, token);
        return res;
    });

    const handleAddComment = () => {
        if (!user?.access_token) {
            alert('Vui lòng đăng nhập để bình luận');
            navigate('/login');
            return;
        }

        if (user?.access_token && user?.id && user?.name && comment && productDetails?._id) {
            mutationAddComment.mutate(
                {
                    token: user?.access_token,
                    user: user?.id,
                    userName: user?.name,
                    comment: comment,
                    rating: rateValue,
                    product: productDetails?._id,
                },
                {
                    onSettled: () => {
                        queryComment.refetch();
                    },
                },
            );
        }
        handleCancel();
    };
    const { data: dataAddComment, isSuccess: isSuccessComment } = mutationAddComment;

    useEffect(() => {
        if (isSuccessComment && dataAddComment?.status === 'OK') {
            setIsModalOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessComment]);
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateComment('');
        setRateValue(5);
    };

    const fetchMyOrder = async (context) => {
        const id = context?.queryKey && context?.queryKey[1];
        if (id) {
            const res = await CommentService.getDetailCommentProduct(id);
            return res.data;
        }
    };

    const queryComment = useQuery(['comment', idProduct], fetchMyOrder, {
        enabled: !!idProduct,
    });
    const { data: dataComment } = queryComment;
    const [rateValue, setRateValue] = useState(5);
    const handleRate = (value) => {
        setRateValue(value);
    };
    const [reload, setReaload] = useState(0);

    const pagination = chunk(dataComment, 7);
    const [currentIndex, setCurrentIndex] = useState(0);

    const rateMemo = useMemo(() => {
        const totalRate = dataComment?.reduce((total, curr) => {
            return total + curr?.rating / dataComment?.length;
        }, 0);
        return totalRate;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataComment]);

    const [loadMore, setLoadMore] = useState(false);

    const handleDeleteComment = (id) => {
        CommentService.deleteComment(id, { token: user?.access_token });
        setReaload(new Date() * 1);
    };

    return (
        <Loading isLoading={isLoading}>
            <div className={cx('title')}>
                Trang chủ <GrFormNext />
                <span className={cx('title-type')}>{productDetails?.type}</span>
            </div>
            <div className={cx('wrapper')}>
                <div className={cx('product-inner')}>
                    <div className={cx('product')}>
                        <div className={'list-img'}>
                            <Row>
                                <Image.PreviewGroup
                                    preview={{
                                        onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                                    }}
                                >
                                    <Col span={4} className={cx('img-small')}>
                                        <Image height={80} width={70} src={productDetails?.image} alt="" className={cx('img-product')} />
                                    </Col>
                                    <Col span={10}>
                                        <Image width={400} src={productDetails?.image} alt="" className={cx('')} />
                                    </Col>
                                </Image.PreviewGroup>
                            </Row>
                        </div>
                        <div className={cx('product-info')}>
                            <span className={cx('name-product')}>{productDetails?.name}</span>
                            <div className={cx('product-right')}>
                                <div className={cx('company')}>
                                    <span className={cx('company-home')}>
                                        Nhà cung cấp:<span className={cx('company-home-text')}> Nhà Xuất Bản Kim Đồng</span>
                                    </span>
                                    <span className={cx('company-name')}>
                                        Nhà xuất bản:<span className={cx('do-author-text')}> Kim Đồng</span>
                                    </span>
                                </div>
                                <div className={cx('do')}>
                                    <span className={cx('do-author')}>
                                        Tác giả:
                                        <span className={cx('do-author-text')}> {productDetails?.author}</span>
                                    </span>
                                    <span className={cx('do-type')}>
                                        Hình thức: <span className={cx('do-author-text')}>Bìa Mềm</span>
                                    </span>
                                </div>
                            </div>
                            <div className={cx('star')}>
                                <Rate disabled value={productDetails?.rating} allowHalf />
                            </div>
                            <div className={cx('price')}>
                                <div className={cx('price-sale')}>{convertPrice(priceSale)}</div>
                                {productDetails?.discount !== 0 && <div className={cx('price-current')}>{convertPrice(productDetails?.price)}</div>}
                                {productDetails?.discount !== 0 && <span className={cx('sale')}>-{productDetails?.discount}%</span>}
                            </div>
                            <div className={cx('delivery')}>
                                <div className={cx('time-delivery')}> Thời gian giao hàng</div>
                                <div className={cx('delivery-info')}>
                                    <div className={cx('place-delivery')}>
                                        Giao hàng đến: &nbsp;<span className={cx('place-delivery-text')}> {user?.address}</span>
                                    </div>
                                    <div className={cx('expected-delivery')}>
                                        Thời gian giao hàng: &nbsp;<span className={cx('place-delivery-text')}> Từ thứ 2 -> thứ 6</span>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('amount')}>
                                <span className={cx('amount-text')}>Số lượng</span>
                                <div className={cx('amount-so')}>
                                    <AiOutlineMinus className={cx('btn-less')} onClick={() => handleChangeCount('decrease')} />
                                    <InputNumber min={1} className={cx('input-amount')} onChange={onChange} defaultValue={numProduct} value={numProduct} />
                                    <AiOutlinePlus className={cx('btn-more')} onClick={() => handleChangeCount('increase')} />
                                </div>
                            </div>
                            <div className={cx('custom-container')} onClick={handleClickOpen}>
                                <Button1 sx={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>Xem sách</Button1>
                            </div>
                        </div>
                    </div>

                    <div className={cx('btn-buy')}>
                        <Button className={cx('btn-buy-cart')} register leftIcon={<AiOutlineShoppingCart className={cx('btn-icon-cart')} />} onClick={handleAddProductCart}>
                            Thêm vào giỏ hàng
                        </Button>
                        <Button className={cx('btn-buy-cart')} login onClick={handleAddProductCartBuy}>
                            Mua ngay
                        </Button>
                    </div>
                </div>

                <div className={cx('aa')}>
                    <div className={cx('description')}>
                        <h3>Mô tả nội dung:</h3>
                        <p className={cx(`${cx('description-text')} ${loadMore ? cx('description-less') : ''}`)}>{productDetails?.content}</p>
                    </div>
                    <div className={cx('more-des-op')}>
                        {!loadMore ? (
                            <Button register className={cx('more-des')} onClick={() => setLoadMore(true)}>
                                Xem thêm
                            </Button>
                        ) : (
                            <Button register className={cx('more-des')} onClick={() => setLoadMore(false)}>
                                Rút ngọn
                            </Button>
                        )}
                    </div>
                </div>

                <div className={cx('product-information')}>
                    <h2>Thông tin sản phẩm</h2>
                    <div>
                        <div className={cx('information')}>
                            <p className={cx('information_left')}>Mã hàng</p>
                            <p>17082001</p>
                        </div>
                        <div className={cx('information')}>
                            <p className={cx('information_left')}>Tên nhà cung cấp</p>
                            <p>Kim Đồng</p>
                        </div>
                        <div className={cx('information')}>
                            <p className={cx('information_left')}>Tác giả</p>
                            <p>{productDetails?.author}</p>
                        </div>
                        <div className={cx('information')}>
                            <p className={cx('information_left')}>Thể loại</p>
                            <p>{productDetails?.type}</p>
                        </div>
                        <div className={cx('information')}>
                            <p className={cx('information_left')}>Hình thức</p>
                            <p>Bìa Mềm</p>
                        </div>
                        <div className={cx('information')}>
                            <p className={cx('information_left')}>Số trang</p>
                            <p>{productDetails?.page}</p>
                        </div>
                        <div className={cx('information')}>
                            <p className={cx('information_left')}>Kích thước bao bì</p>
                            <p>20.5 x 13 cm</p>
                        </div>
                        <div className={cx('information')}>
                            <p className={cx('information_left')}>Trọng lượng</p>
                            <p>170g</p>
                        </div>
                        <div className={cx('node')}>
                            <p>
                                Giá sản phẩm trên Fahasa.com đã bao gồm thuế theo luật hiện hành. Bên cạnh đó, tuỳ vào loại sản phẩm, hình thức và địa chỉ giao hàng mà có thể phát
                                sinh thêm chi phí khác như Phụ phí đóng gói, phí vận chuyển, phụ phí hàng cồng kềnh,...
                            </p>
                            <p className={cx('red')}>Chính sách khuyến mãi trên Fahasa.com không áp dụng cho Hệ thống Nhà sách Fahasa trên toàn quốc</p>
                        </div>
                    </div>{' '}
                </div>

                <div className={cx('product-review')}>
                    <div className={cx('add-comment')}>
                        <h2 className={cx('product-review-title')}>Đánh giá sản phẩm</h2>
                        <div className={cx('rate-comment')}>
                            <div>
                                <span className={cx('rate-text')}>{rateMemo?.toFixed(1)}</span>
                                <span className={cx('rate-text-5')}>/5</span>
                                <div>
                                    <WrapperRate disabled value={rateMemo?.toFixed(1)} allowHalf />
                                </div>
                                <div className={cx('rate-text-total')}>( {dataComment?.length} đáng giá)</div>
                            </div>
                            <div>
                                <Button register onClick={() => handleOpenModal()} className={cx('btn-write')}>
                                    <BsPencil /> Viết đánh giá
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className={cx('comment')}>
                        {pagination[currentIndex]?.map((item) => {
                            return (
                                <div key={item?._id} style={{ display: 'flex', justifyContent: 'space-between', width: '50%', alignItems: 'center' }}>
                                    <div className={cx('list-comment')}>
                                        <div className={cx('comment-name-date')}>
                                            <div className={cx('comment-name')}>{item?.userName}</div>
                                            <div className={cx('comment-date')}>{item?.createdAt?.split('T')[0]}</div>
                                        </div>
                                        <div className={cx('comment-rate')}>
                                            <WrapperRate disabled value={item?.rating} />
                                            <span className={cx('comment-text')}>{item?.comment}</span>
                                        </div>
                                    </div>
                                    {user?.name && (
                                        <div className="delete-comment" onClick={() => handleDeleteComment(item?._id)}>
                                            <MdDelete />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div>
                        <ul className={cx('list-pagination')}>
                            {pagination?.map((item, index) => {
                                return (
                                    <li key={index} onClick={() => setCurrentIndex(index)} className={`${cx('pagination')} ${index === currentIndex ? cx('active') : ''}`}>
                                        {index + 1}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            <ModalComponent title="" open={isModalOpen} onCancel={handleCancel} footer={null} width="64%">
                <div className={cx('title-comment')}>VIẾT ĐÁNH GIÁ SẢN PHẨM</div>
                <div className={cx('rate-star')}>
                    <WrapperRate1 value={rateValue} onChange={handleRate} defaultValue={rateValue} />
                </div>
                <textarea
                    className={cx('textarea-product')}
                    cols={95}
                    rows={5}
                    placeholder="nhập nhận xét của bạn về sản phẩm ..."
                    value={comment}
                    onChange={handleOnChangeComment}
                ></textarea>
                <div className={cx('btn-comment')}>
                    <span onClick={() => setIsModalOpen(false)} className={cx('close-model')}>
                        Hủy
                    </span>
                    <Button login onClick={handleAddComment}>
                        Gửi nhận xét
                    </Button>
                </div>
            </ModalComponent>
            {open && <WrapperBook open={open} handleClose={handleClose} data={productDetails} />}
        </Loading>
    );
}

export default ProductDetail;
