import classNames from 'classnames/bind';
import style from './AdminUser.module.scss';
import TableComponent from '../ComponentAdmin/TableComponent';
import { useState } from 'react';
import { Upload, Button as BTN, Input, Space } from 'antd';
import ModalComponent from '../ComponentAdmin/ModalComponent';
import { useMutationHooks } from '~/hooks/useMutationHook';
import { useEffect } from 'react';
import * as UserService from '~/service/UserService';
import * as messages from '~/components/Message';
import { getBase64 } from '~/ultil';
import { useQuery } from 'react-query';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import DrawerComponent from '../ComponentAdmin/DrawerComponent';
import Loading from '~/components/LoadingComponent';
import Button from '~/components/Button';

const cx = classNames.bind(style);
function AdminUser() {
    //Get All Product
    const getAllUsers = async () => {
        const res = await UserService.getAllUser(user?.access_token);
        return res;
    };
    const queryUser = useQuery(['user'], getAllUsers);
    const { isLoading: isLoadingUser, data: users } = queryUser;
    const renderAction = () => {
        return (
            <div>
                <AiOutlineDelete style={{ fontSize: '3rem' }} onClick={() => setIsModalOpenDelete(true)} />
                <AiOutlineEdit style={{ fontSize: '3rem' }} onClick={handleDetailUser} />
            </div>
        );
    };

    //Update
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const user = useSelector((state) => state?.user);
    const [stateUserDetail, setStateUserDetail] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        avatar: '',
        isAdmin: false,
    });

    const handleOnChangeDetail = (e) => {
        setStateUserDetail({
            ...stateUserDetail,
            [e.target.name]: e.target.value,
        });
    };

    const handleOnChangeAvatarDetail = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUserDetail({
            ...stateUserDetail,
            avatar: file.preview,
        });
    };

    const fetchGetUserDetail = async (rowSelected) => {
        const res = await UserService.getDetailUser(rowSelected);
        if (res?.data) {
            setStateUserDetail({
                name: res?.data?.name,
                email: res?.data?.email,
                phone: res?.data?.phone,
                address: res?.data?.address,
                avatar: res?.data?.avatar,
                isAdmin: res?.data?.isAdmin,
            });
        }
    };

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            fetchGetUserDetail(rowSelected);
        }
    }, [rowSelected, isOpenDrawer]);

    const handleDetailUser = () => {
        if (rowSelected) {
        }
        setIsOpenDrawer(true);
    };
    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rest } = data;
        const res = UserService.updateUser(id, { ...rest }, token);
        return res;
    });
    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateUserDetail({
            name: '',
            email: '',
            phone: '',
            address: '',
            avatar: '',
            isAdmin: false,
        });
    };
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isErrorUpdated } = mutationUpdate;

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            messages.success('thêm thành công');
            handleCloseDrawer();
        } else if (isErrorUpdated && dataUpdated?.status === 'ERR') {
            messages.error('thêm thất bại');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessUpdated, isErrorUpdated]);

    const handleOnUpdate = () => {
        mutationUpdate.mutate(
            { id: rowSelected, ...stateUserDetail, token: user?.access_token },
            {
                onSettled: () => {
                    queryUser.refetch();
                },
            },
        );
    };
    //Delete
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };
    const mutationDelete = useMutationHooks((data) => {
        const { id, token } = data;
        const res = UserService.deleteUser(id, token);
        return res;
    });
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isErrorDeleted } = mutationDelete;

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            messages.success('thêm thành công');
            handleCancelDelete();
        } else if (isErrorDeleted && dataDeleted?.status === 'ERR') {
            messages.error('thêm thất bại');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessDeleted, isErrorDeleted]);

    const handleDeleteUser = () => {
        mutationDelete.mutate(
            { id: rowSelected, token: user?.access_token },
            {
                onSettled: () => {
                    queryUser.refetch();
                },
            },
        );
    };
    //Delete Many
    const mutationDeleteMany = useMutationHooks((data) => {
        const { token, ...ids } = data;
        const res = UserService.deleteManyUser(ids, token);
        return res;
    });
    const { data: dataDeletedMany, isSuccess: isSuccessDeletedMany, isErrorDeletedMany } = mutationDeleteMany;

    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            messages.success('xóa thành công');
            handleCancelDelete();
        } else if (isErrorDeletedMany && dataDeletedMany?.status === 'ERR') {
            messages.error('xóa thất bại');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessDeleted, isErrorDeleted]);

    const handleDeleteManyUser = (ids) => {
        mutationDeleteMany.mutate(
            { ids: ids, token: user?.access_token },
            {
                onSettled: () => {
                    queryUser.refetch();
                },
            },
        );
    };
    //Search
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <BTN
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </BTN>
                    <BTN
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </BTN>
                    <BTN
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </BTN>
                    <BTN
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </BTN>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#fff',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    //columns data
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <span>{text}</span>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.author.length - b.author.length,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: (a, b) => a.type.length - b.type.length,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: (a, b) => a.type.length - b.type.length,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction,
        },
    ];
    const dataTable =
        users?.data?.length &&
        users?.data?.map((user) => {
            return { ...user, key: user._id, isAdmin: user.isAdmin ? 'True' : 'False' };
        });

    return (
        <div className={cx('wrapper')}>
            <div>Quản lý người dùng</div>
            <div>
                <TableComponent
                    handleDeleteMany={handleDeleteManyUser}
                    columns={columns}
                    data={dataTable}
                    isLoading={isLoadingUser}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                setRowSelected(record?._id);
                            },
                        };
                    }}
                />
            </div>
            <DrawerComponent isOpen={isOpenDrawer} title="Update Sản Phẩm" onClose={handleCloseDrawer} width="80%">
                <Loading isLoading={isLoadingUpdated}>
                    <form method="post" action="">
                        <div className={cx('form-group')}>
                            <label htmlFor="name" className={cx('form-label')}>
                                Name
                            </label>
                            <div className={cx('form-input')}>
                                <input
                                    value={stateUserDetail.name}
                                    onChange={handleOnChangeDetail}
                                    type="text"
                                    placeholder="Nhập tên sách"
                                    className={cx('form-control')}
                                    id="name"
                                    name="name"
                                />
                            </div>
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="email" className={cx('form-label')}>
                                email
                            </label>
                            <div className={cx('form-input')}>
                                <input
                                    value={stateUserDetail.email}
                                    onChange={handleOnChangeDetail}
                                    type="email"
                                    placeholder="Nhập email"
                                    className={cx('form-control')}
                                    id="email"
                                    name="email"
                                />
                            </div>
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="phone" className={cx('form-label')}>
                                phone
                            </label>
                            <div className={cx('form-input')}>
                                <input
                                    value={stateUserDetail.phone}
                                    onChange={handleOnChangeDetail}
                                    name="phone"
                                    type="number"
                                    placeholder="Nhập phone"
                                    className={cx('form-control')}
                                    id="phone"
                                />
                            </div>
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="address" className={cx('form-label')}>
                                address
                            </label>
                            <div className={cx('form-input')}>
                                <input
                                    value={stateUserDetail.address}
                                    onChange={handleOnChangeDetail}
                                    name="address"
                                    type="text"
                                    placeholder="Nhập address"
                                    className={cx('form-control')}
                                    id="address"
                                />
                            </div>
                        </div>
                        <div className={cx('form-input-avatar')}>
                            <Upload onChange={handleOnChangeAvatarDetail} className={cx('ant-upload-list-item.ant-upload-list-item-error')} maxCount={1}>
                                <BTN>Select File</BTN>
                            </Upload>
                            {stateUserDetail?.avatar && <img src={stateUserDetail?.avatar} className={cx('input-avatar')} alt="avatar" />}
                        </div>
                    </form>
                    <Button login className={cx('btn-save')} onClick={handleOnUpdate}>
                        Update
                    </Button>
                </Loading>
            </DrawerComponent>
            <Loading isLoading={isLoadingDeleted}>
                <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
                    <div>Bạn có chắc muốn xóa sản phẩm này không</div>
                </ModalComponent>
            </Loading>
        </div>
    );
}

export default AdminUser;
