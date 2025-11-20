import classNames from 'classnames/bind';
import styles from './Register.module.scss';
import { useEffect, useState } from 'react';

import Button from '~/components/Button';
import { useNavigate } from 'react-router-dom';
import InputForm from '~/components/InputForm';
import * as UserService from '~/service/UserService';
import { useMutationHooks } from '~/hooks/useMutationHook';
import Loading from '~/components/LoadingComponent';
import * as messages from '~/components/Message';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const cx = classNames.bind(styles);
function Register() {
    const navigate = useNavigate();
    const handleNavigateLogin = () => {
        navigate('/login');
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setComfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    //thêm dữ liệu vào user bằng react query
    const mutation = useMutationHooks((data) => UserService.RegisterUser(data));
    const { data, isLoading, isSuccess, isError } = mutation;
    //
    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            messages.success('Đăng ký thành công');
            handleNavigateLogin();
        } else if (isError && data?.status === 'ERR') {
            messages.error('Đăng ký thất bại');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError]);
    //lấy dữ liệu từ in put

    const handleOnchangeName = (value) => {
        setName(value);
    };
    const handleOnchangePhone = (value) => {
        setPhone(value);
    };
    const handleOnchangeAddress = (value) => {
        setAddress(value);
    };

    const handleOnchangeEmail = (value) => {
        setEmail(value);
    };
    const handleOnchangePassWord = (value) => {
        setPassword(value);
    };
    const handleOnchangeComfirmPassword = (value) => {
        setComfirmPassword(value);
    };
    const handleSignUp = () => {
        mutation.mutate({ name, email, password, confirmPassword, phone, address });
    };
    const [isShowPassword, setIsShowPassword] = useState(false);

    //
    return (
        <div className={cx('wrapper')}>
            <div className={cx('form-register')}>
                <div className={cx('title')}>
                    <h3 onClick={handleNavigateLogin} className={cx('title-register')}>
                        Đăng nhập
                    </h3>
                    <h3 className={cx('title-register')}>Đăng ký</h3>
                </div>
                <form method="post" action="">
    {/* Họ và tên */}
    <div className={cx('form-group')}>
        <label htmlFor="name" className={cx('form-label')}>
            Họ và tên
        </label>
        <div className={cx('form-input')}>
            <InputForm
                value={name}
                onChange={handleOnchangeName}
                type="text"
                placeholder="Nhập họ và tên của bạn"
                className={cx('form-control')}
                id="name"
            />
        </div>
    </div>

    {/* Số điện thoại */}
    <div className={cx('form-group')}>
        <label htmlFor="phone" className={cx('form-label')}>
            Số điện thoại
        </label>
        <div className={cx('form-input')}>
            <InputForm
                value={phone}
                onChange={handleOnchangePhone}
                type="text"
                placeholder="Nhập số điện thoại"
                className={cx('form-control')}
                id="phone"
            />
        </div>
    </div>

    {/* Địa chỉ */}
    <div className={cx('form-group')}>
        <label htmlFor="address" className={cx('form-label')}>
            Địa chỉ
        </label>
        <div className={cx('form-input')}>
            <InputForm
                value={address}
                onChange={handleOnchangeAddress}
                type="text"
                placeholder="Nhập địa chỉ của bạn"
                className={cx('form-control')}
                id="address"
            />
        </div>
    </div>

    {/* Email */}
    <div className={cx('form-group')}>
        <label htmlFor="email" className={cx('form-label')}>
            Email
        </label>
        <div className={cx('form-input')}>
            <InputForm
                value={email}
                onChange={handleOnchangeEmail}
                type="email"
                placeholder="Nhập email của bạn"
                className={cx('form-control')}
                id="email"
            />
        </div>
    </div>

    {/* Mật khẩu */}
    <div className={cx('form-group')}>
        <label htmlFor="password" className={cx('form-label')}>
            Mật khẩu
        </label>
        <div className={cx('form-input')}>
            <InputForm
                value={password}
                onChange={handleOnchangePassWord}
                type={isShowPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                className={cx('form-control')}
                id="password"
            />
        </div>
        <span className={cx('eyes')} onClick={() => setIsShowPassword(!isShowPassword)}>
            {isShowPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
        </span>
    </div>

    {/* Xác nhận mật khẩu */}
    <div className={cx('form-group')}>
        <label htmlFor="re-password" className={cx('form-label')}>
            Xác nhận mật khẩu
        </label>
        <div className={cx('form-input')}>
            <InputForm
                value={confirmPassword}
                onChange={handleOnchangeComfirmPassword}
                type={isShowPassword ? 'text' : 'password'}
                placeholder="Xác nhận mật khẩu"
                className={cx('form-control')}
                id="re-password"
            />
        </div>
        <span className={cx('eyes')} onClick={() => setIsShowPassword(!isShowPassword)}>
            {isShowPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
        </span>
    </div>
</form>

                {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                <Loading isLoading={isLoading}>
                    <Button register className={cx('btn-register')} onClick={handleSignUp} disabled={email.length === 0}>
                        Đăng ký
                    </Button>
                </Loading>

                <span className={cx('text-ok')}>
                    Bằng việc đăng ký, bạn đã đồng ý với Fahasa.com về
                    <p className={cx('text-dk')}>Điều khoản dịch vụ & Chính sách bảo mật</p>
                </span>
            </div>
        </div>
    );
}

export default Register;
