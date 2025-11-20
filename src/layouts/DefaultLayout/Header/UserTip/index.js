import { CiUser } from 'react-icons/ci';

import classNames from 'classnames/bind';
import styles from './UserTip.module.scss';
import User from '~/components/Popper/User';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

function UserTip() {
    const user = useSelector((state) => state.user);

    return (
        <User>
            <div className={cx('user')}>
                <button className={cx('btn-user')}>
                    <CiUser />
                </button>
                <span className={cx('text-user')}>{user?.name ? <span>{user.name}</span> : <span>Tài Khoản</span>}</span>
            </div>
        </User>
    );
}

export default UserTip;
