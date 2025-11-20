import styles from './Popper.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);
function Wrapper({ children, ...rests }) {
    return (
        <div className={cx('wrapper')} {...rests}>
            {children}
        </div>
    );
}

export default Wrapper;
