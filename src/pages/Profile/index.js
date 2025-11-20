import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, message, Button as BTN } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import InputForm from '~/components/InputForm';
import Button from '~/components/Button';
import * as UserService from '~/service/UserService';
import { useMutationHooks } from '~/hooks/useMutationHook';
import Loading from '~/components/LoadingComponent';
import { updateUser } from '~/redux/slides/userSlide';
import { getBase64 } from '~/ultil';

const cx = classNames.bind(styles);
function Profile() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [avatar, setAvatar] = useState('');

    const mutation = useMutationHooks((data) => {
        const { id, access_token, ...rests } = data;
        UserService.updateUser(id, rests, access_token);
    });
    const { isLoading, isSuccess, isError } = mutation;

    useEffect(() => {
        setName(user?.name);
        setEmail(user?.email);
        setPhone(user?.phone);
        setAddress(user?.address);
        setAvatar(user?.avatar);
    }, [user]);

    useEffect(() => {
        if (isSuccess) {
            message.success();
            handleGetDetailUser(user?.id, user?.access_token);
        } else if (isError) {
            message.error();
        }
    });

    const handleGetDetailUser = async (id, token) => {
        const res = await UserService.getDetailUser(id, token);
        dispatch(updateUser({ ...res?.data, access_token: token }));
    };
    const handleOnChangeName = (value) => {
        setName(value);
    };
    const handleOnChangeEmail = (value) => {
        setEmail(value);
    };
    const handleOnChangePhone = (value) => {
        setPhone(value);
    };
    const handleOnChangeAddress = (value) => {
        setAddress(value);
    };
    const handleOnChangeAvatar = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvatar(file.preview);
    };

    const handleUpdate = () => {
        mutation.mutate({ id: user?.id, email, name, phone, address, avatar, access_token: user?.access_token });
    };

    return (
        <Loading isLoading={isLoading}>
            <div className={cx('wrapper')}>
                <div className={cx('content')}>
                    <h3 className={cx('title')}>Thông tin tài khoản</h3>
                    <form method="" action="">
                        <div className={cx('form-group')}>
                            <label htmlFor="" className={cx('form-label')}>
                                Tên
                            </label>
                            <div className={cx('form-input')}>
                                <InputForm
                                    value={name}
                                    onChange={handleOnChangeName}
                                    type="text"
                                    placeholder="Nhập Tên"
                                    className={cx('form-control')}
                                    id="name"
                                />
                            </div>
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="" className={cx('form-label')}>
                                Số điện thoại
                            </label>
                            <div className={cx('form-input')}>
                                <InputForm
                                    value={phone}
                                    onChange={handleOnChangePhone}
                                    type="text"
                                    placeholder="Nhập số điện thoại"
                                    className={cx('form-control')}
                                    id="phone"
                                />
                            </div>
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="" className={cx('form-label')}>
                                Email
                            </label>
                            <div className={cx('form-input')}>
                                <InputForm
                                    onChange={handleOnChangeEmail}
                                    value={email}
                                    type="text"
                                    placeholder="Nhập Email"
                                    className={cx('form-control')}
                                    id="email"
                                />
                            </div>
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="" className={cx('form-label')}>
                                Địa chỉ
                            </label>
                            <div className={cx('form-input')}>
                                <InputForm
                                    onChange={handleOnChangeAddress}
                                    value={address}
                                    type="address"
                                    placeholder="Nhập địa chỉ"
                                    className={cx('form-control')}
                                    id="address"
                                />
                            </div>
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="" className={cx('form-label')}>
                                Avatar
                            </label>
                            <div className={cx('form-input-avatar')}>
                                <Upload
                                    onChange={handleOnChangeAvatar}
                                    className={cx('ant-upload-list-item.ant-upload-list-item-error')}
                                    maxCount={1}
                                >
                                    <BTN icon={<UploadOutlined />}>Select File</BTN>
                                </Upload>
                                {avatar && <img src={avatar} className={cx('input-avatar')} alt="avatar" />}
                            </div>
                        </div>
                    </form>
                    <Button login className={cx('btn-save')} onClick={handleUpdate}>
                        Lưu Thay Đổi
                    </Button>
                </div>
            </div>
        </Loading>
    );
}

export default Profile;
