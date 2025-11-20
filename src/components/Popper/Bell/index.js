import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import { BsBell } from 'react-icons/bs';
import styles from './Bell.module.scss';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import Button from '~/components/Button';
import images from '~/assets/images';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const cx = classNames.bind(styles);

function Bell({ children }) {
    const navigate = useNavigate();
    const handleNavigateLogin = () => {
        navigate('/login');
    };
    const user = useSelector((state) => state.user);

    return (
        <div>
            <Tippy
                delay={[0, 500]}
                placement="bottom-end"
                interactive
                render={(attrs) => (
                    <div className={cx('list-bells')} tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            {user?.access_token ? (
                                <div>chúc mừng bạn đăng nhập thành công</div>
                            ) : (
                                <div className={cx('bell-items')}>
                                    <span className={cx('bell-text')}>
                                        <BsBell />
                                        Thông báo
                                    </span>
                                    <div className={cx('item')}>
                                        <img className={cx('bell-img')} src={images.bell} alt="bell" />
                                        <p>Vui lòng đăng nhập </p>
                                    </div>
                                    <Button onClick={handleNavigateLogin} login className={cx('loggin')}>
                                        Đăng nhập
                                    </Button>
                                    <Button register>Đăng ký</Button>
                                </div>
                            )}
                        </PopperWrapper>
                    </div>
                )}
            >
                {children}
            </Tippy>
        </div>
    );
}

export default Bell;
