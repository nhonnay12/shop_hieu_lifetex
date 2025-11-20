import classNames from 'classnames/bind';
import styles from './User.module.scss';

import Button from '~/components/Button';

const cx = classNames.bind(styles);
function UserItem({ data }) {
    return (
        <Button className={cx('list-btn-user')} leftIcon={data.icon} to={data.to} onClick={data.onClick}>
            {data.title}
        </Button>
    );
}

export default UserItem;
