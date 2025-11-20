import { AiFillCaretDown } from 'react-icons/ai';
import { CgMenuGridO } from 'react-icons/cg';
import { BsBell, BsCart2 } from 'react-icons/bs';

import classNames from 'classnames/bind';
import 'tippy.js/dist/tippy.css'; // optional
import { Link } from 'react-router-dom';

import styles from './Header.module.scss';
import images from '~/assets/images';
import Bell from '~/components/Popper/Bell';
import UserTip from './UserTip';
import InputSearch from './InputSearch';
import MenuTippy from '~/components/Popper/Menu';
import { Badge } from 'antd';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

function Header() {
    const order = useSelector((state) => state.order);
    const user = useSelector((state) => state.user);

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link to="/" className={cx('logo')}>
                    <img src={images.logo} alt="Fahasa" />
                </Link>
                <MenuTippy>
                    <div className={cx('menu')}>
                        <CgMenuGridO />
                        <AiFillCaretDown className={cx('menu-down')} />
                    </div>
                </MenuTippy>

                 <InputSearch />
                <div className={cx('action')}>
                    <Bell>
                        <div className={cx('bell')}>
                            <button className={cx('btn-bell')}>
                                <BsBell />
                            </button>
                            <span className={cx('text-bell')}>Thông Báo</span>
                        </div>
                    </Bell>
                    <Link to="/cart" className={cx('cart')}>
                        {user?.access_token ? (
                            <Badge count={order?.orderItems.length}>
                                <button className={cx('btn-cart')}>
                                    <BsCart2 />
                                </button>
                            </Badge>
                        ) : (
                            <Badge>
                                <button className={cx('btn-cart')}>
                                    <BsCart2 />
                                </button>
                            </Badge>
                        )}

                        <span className={cx('text-cart')}>Giỏ Hàng</span>
                    </Link>
                    <UserTip />
                </div>
            </div>
        </header>
    );
}

export default Header;
