import { FaFacebookF } from 'react-icons/fa';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import styles from './User.module.scss';
import { AiOutlineHeart } from 'react-icons/ai';
import { BsFileText } from 'react-icons/bs';
import { CiLogout } from 'react-icons/ci';

import { HiUserCircle, HiOutlineTicket } from 'react-icons/hi';
import { TbSquareLetterF } from 'react-icons/tb';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import Button from '~/components/Button';
import * as UserService from '~/service/UserService';
import { useDispatch, useSelector } from 'react-redux';
import { resetUser } from '~/redux/slides/userSlide';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loading from '~/components/LoadingComponent';

const cx = classNames.bind(styles);

function User({ children, items = [] }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (user?.access_token && user.isAdmin) {
            setShowPopup(true);
            const timer = setTimeout(() => {
                setShowPopup(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [user]);

    const handleLogout = async () => {
        setLoading(true);
        await UserService.logOutUser();
        dispatch(resetUser());
        localStorage.removeItem('access_token'); // Chỉ xóa state của redux-persist
        setLoading(false);
        navigate('/'); // Điều hướng về trang chủ
    };
    return (
        <div>
            {showPopup && (
                <div className={cx('admin-popup')}>
                    <p>Xin chào Admin</p>
                </div>
            )}
            <Loading isLoading={loading}>
                <Tippy
                    delay={[0, 500]}
                    placement="bottom-end"
                    interactive
                    render={(attrs) => (
                        <div className={cx('list-users')} tabIndex="-1" {...attrs}>
                            <PopperWrapper>
                                {user?.access_token && user.isAdmin && (
                                    <>
                                        <Button to="/system/admin" className={cx('btn')}>
                                            Quản lý
                                        </Button>
                                    </>
                                )}

                                {user?.access_token ? (
                                    <>
                                        <Button leftIcon={<HiUserCircle />} className={cx('btn')} onClick={() => navigate('/profile')}>
                                            Thành viên Fahasa
                                        </Button>
                                        <Button
                                            leftIcon={<BsFileText />}
                                            onClick={() =>
                                                navigate('/my_order', {
                                                    state: {
                                                        id: user?.id,
                                                        token: user?.access_token,
                                                    },
                                                })
                                            }
                                            className={cx('btn')}
                                        >
                                            Đơn hàng của tôi
                                        </Button>
                                        <Button leftIcon={<AiOutlineHeart />} className={cx('btn')}>
                                            Sản phẩm yêu thích
                                        </Button>
                                        <Button leftIcon={<HiOutlineTicket />} className={cx('btn')}>
                                            Wallet Voucher
                                        </Button>
                                        <Button leftIcon={<TbSquareLetterF />} className={cx('btn')}>
                                            Tài Khoản F-point
                                        </Button>
                                        <Button leftIcon={<CiLogout />} className={cx('btn')} onClick={() => handleLogout()}>
                                            Thoát tài khoản
                                        </Button>
                                    </>
                                ) : (
                                    <div className={cx('user-items')}>
                                        <Link to="/login">
                                            <Button login className={cx('loggin')}>
                                                Đăng nhập
                                            </Button>
                                        </Link>
                                        <Link to={'/register'}>
                                            <Button register>Đăng ký</Button>
                                        </Link>
                                        <Button facebook className={cx('icon-fa')}>
                                            <FaFacebookF />
                                            Đăng nhập bằng facebook
                                        </Button>
                                    </div>
                                )}
                            </PopperWrapper>
                        </div>
                    )}
                >
                    {children}
                </Tippy>
            </Loading>
        </div>
    );
}

export default User;
