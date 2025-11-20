import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BsFacebook } from 'react-icons/bs';
import jwt_decode from 'jwt-decode';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Button from '~/components/Button';
import InputForm from '~/components/InputForm';
import * as UserService from '~/service/UserService';
import { useMutationHooks } from '~/hooks/useMutationHook';
import Loading from '~/components/LoadingComponent';
import { useDispatch } from 'react-redux';
import { updateUser } from '~/redux/slides/userSlide';
const cx = classNames.bind(styles);
function Login() {
    const navigate = useNavigate();
    const handleNavigateRegister = () => {
        navigate('/register');
    };
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    //lấy dữ liệu từ dâta bằng react query
    const mutation = useMutationHooks((data) => UserService.loginUser(data));
    const { data, isLoading, isSuccess, isError } = mutation;
    //
    const [isShowPassword, setIsShowPassword] = useState(false);
    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            if (location?.state) {
                navigate(location?.state);
            } else {
                navigate('/');
            }
            localStorage.setItem('access_token', JSON.stringify(data?.access_token));
            localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token));

            if (data?.access_token) {
                const decoded = jwt_decode(data?.access_token);
                if (decoded?.id) {
                    handleGetDetailUser(decoded?.id, data?.access_token);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError]);
    // const handleGetDetailUser = async (id, token) => {
    //     const storage = localStorage.getItem('refresh_token');
    //     const refreshToken = JSON.parse(storage);
    //     const res = await UserService.getDetailUser(id, token);
    //     dispatch(updateUser({ ...res?.data, access_token: token, refreshToken }));
    // };
    // useEffect(() => {
    //     if (isSuccess) {
    //         navigate('/');
    //         localStorage.setItem('access_token', JSON.stringify(data?.access_token));
    //         if (data?.access_token) {
    //             const decoded = jwt_decode(data?.access_token);
    //             if (decoded?.id) {
    //                 handleGetDetailUser(decoded?.id, decoded?.access_token);
    //                 console.log(decoded);
    //             }
    //         }
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [isSuccess]);

    // const handleGetDetailUser = async (id, token) => {
    //     const res = await UserService.getDetailUser(id, token);
    //     dispatch(updateUser({ ...res?.data, access_token: token }));
    // };

    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            // ✅ SỬA: Lưu token TRƯỚC KHI navigate
            if (data?.access_token && data?.refresh_token) {
                localStorage.setItem('access_token', JSON.stringify(data.access_token));
                localStorage.setItem('refresh_token', JSON.stringify(data.refresh_token));
                
                try {
                    const decoded = jwt_decode(data.access_token);
                    
                    if (decoded?.id) {
                        handleGetDetailUser(decoded.id, data.access_token)
                            .then(() => {
                                // Navigate SAU KHI đã lưu token và lấy user details
                                if (location?.state) {
                                    navigate(location.state);
                                } else {
                                    navigate('/');
                                }
                            })
                            .catch((error) => {
                                console.error('Error getting user details:', error);
                            });
                    }
                } catch (error) {
                    console.error('Error decoding token:', error);
                }
            }
        }
    }, [isSuccess, data]);

    //lấy dữ liệu từ form login
    const handleOnchangeEmail = (value) => {
        setEmail(value);
    };
    const handleOnchangePassWord = (value) => {
        setPassword(value);
    };
    const handleSignIn = () => {
        mutation.mutate({
            email,
            password,
        });
    };
        const handleGetDetailUser = async (id, token) => {
        try {
            const storage = localStorage.getItem('refresh_token');
            const refreshToken = JSON.parse(storage);
            const res = await UserService.getDetailUser(id, token);
            
            if (res?.data) {
                dispatch(updateUser({ 
                    ...res.data, 
                    access_token: token, 
                    refreshToken 
                }));
            }
        } catch (error) {
            console.error('Error in handleGetDetailUser:', error);
            throw error;
        }
    };


    const handleNavigateForgot = () => {
        navigate('/forgotpass');
    };
    //
    return (
        <div className={cx('wrapper')}>
            <div className={cx('form-login')}>
                <div className={cx('title')}>
                    <h3 className={cx('title-login')}>Đăng nhập</h3>
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
                    <div className={cx('form-group')}>
                        <label htmlFor="name" className={cx('form-label')}>
                            Mật khẩu
                        </label>
                        <div className={cx('form-input')}>
                            <InputForm
                                value={password}
                                onChange={handleOnchangePassWord}
                                type={isShowPassword ? 'text' : 'password'}
                                placeholder="Nhập số điện thoại"
                                className={cx('form-control')}
                                id="name"
                            />
                        </div>
                        <span className={cx('eyes')} onClick={() => setIsShowPassword(!isShowPassword)}>
                            {isShowPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                        </span>
                    </div>
                </form>
                {/* <span onClick={handleNavigateForgot}>Quên mật khẩu</span> */}
                {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                <Loading isLoading={isLoading}>
                    <Button login className={cx('btn-login')} onClick={handleSignIn}>
                        Đăng nhập
                    </Button>
                </Loading>

                <Button facebook leftIcon={<BsFacebook />} className={cx('btn-fb')}>
                    Đăng nhập bằng facebook
                </Button>
            </div>
        </div>
    );
}

export default Login;
