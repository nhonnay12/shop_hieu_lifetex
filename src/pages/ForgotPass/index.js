import classNames from 'classnames/bind';
import styles from './ForgotPass.module.scss';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '~/components/Button';
import InputForm from '~/components/InputForm';
const cx = classNames.bind(styles);

function ForgotPass() {
    const navigate = useNavigate();
    const handleNavigateRegister = () => {
        navigate('/register');
    };
    const handleNavigateLogin = () => {
        navigate('/login');
    };
    const [email, setEmail] = useState('');

    const handleOnchangeEmail = (value) => {
        setEmail(value);
    };

    //
    return (
        <div className={cx('wrapper')}>
            <div className={cx('form-login')}>
                <div className={cx('title')}>
                    <h3 className={cx('title-login')} onClick={handleNavigateLogin}>
                        Đăng nhập
                    </h3>
                    <h3 onClick={handleNavigateRegister} className={cx('title-login')}>
                        Đăng ký
                    </h3>
                </div>
                <form method="post" action="">
                    <div className={cx('form-group')}>
                        <label htmlFor="name" className={cx('form-label')}>
                            Số điện thoại/Email
                        </label>
                        <div className={cx('form-input')}>
                            <InputForm
                                value={email}
                                onChange={handleOnchangeEmail}
                                type="text"
                                placeholder="Nhập số điện thoại hoặc email"
                                className={cx('form-control')}
                                id="name"
                            />
                        </div>
                    </div>
                </form>
                <Button login className={cx('btn-login')}>
                    Xác nhận Email
                </Button>
            </div>
        </div>
    );
}

export default ForgotPass;
