import classNames from 'classnames/bind';
import style from './AdminComment.module.scss';
import TableComponent from '../ComponentAdmin/TableComponent';
import { useState } from 'react';
import { Button as BTN, Input, Space } from 'antd';
import * as CommentService from '~/service/CommentService';
import { useQuery } from 'react-query';
import { AiOutlineDelete } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useMutationHooks } from '~/hooks/useMutationHook';
import { useEffect } from 'react';
import * as messages from '~/components/Message';
import Loading from '~/components/LoadingComponent';
import ModalComponent from '../ComponentAdmin/ModalComponent';

const cx = classNames.bind(style);
function AdminComment() {
    //Get All Product
    const getAllComment = async () => {
        const res = await CommentService.getAllComment(user?.access_token);
        return res;
    };
    const queryComment = useQuery(['comment'], getAllComment);
    const { isLoading: isLoadingUser, data: comments } = queryComment;
    const renderAction = () => {
        return (
            <div>
                <AiOutlineDelete style={{ fontSize: '3rem' }} onClick={() => setIsModalOpenDelete(true)} />
            </div>
        );
    };

    //Update
    // const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const user = useSelector((state) => state?.user);
    // const [stateUserDetail, setStateUserDetail] = useState({
    //     name: '',
    //     email: '',
    //     phone: '',
    //     address: '',
    //     avatar: '',
    //     isAdmin: false,
    // });

    // const handleOnChangeDetail = (e) => {
    //     setStateUserDetail({
    //         ...stateUserDetail,
    //         [e.target.name]: e.target.value,
    //     });
    // };

    // const handleOnChangeAvatarDetail = async ({ fileList }) => {
    //     const file = fileList[0];
    //     if (!file.url && !file.preview) {
    //         file.preview = await getBase64(file.originFileObj);
    //     }
    //     setStateUserDetail({
    //         ...stateUserDetail,
    //         avatar: file.preview,
    //     });
    // };

    // const fetchGetUserDetail = async (rowSelected) => {
    //     const res = await UserService.getDetailUser(rowSelected);
    //     if (res?.data) {
    //         setStateUserDetail({
    //             name: res?.data?.name,
    //             email: res?.data?.email,
    //             phone: res?.data?.phone,
    //             address: res?.data?.address,
    //             avatar: res?.data?.avatar,
    //             isAdmin: res?.data?.isAdmin,
    //         });
    //     }
    // };

    // useEffect(() => {
    //     if (rowSelected && isOpenDrawer) {
    //         fetchGetUserDetail(rowSelected);
    //     }
    // }, [rowSelected, isOpenDrawer]);

    // const handleDetailUser = () => {
    //     if (rowSelected) {
    //     }
    //     setIsOpenDrawer(true);
    // };
    // const mutationUpdate = useMutationHooks((data) => {
    //     const { id, token, ...rest } = data;
    //     const res = UserService.updateUser(id, { ...rest }, token);
    //     return res;
    // });
    // const handleCloseDrawer = () => {
    //     setIsOpenDrawer(false);
    //     setStateUserDetail({
    //         name: '',
    //         email: '',
    //         phone: '',
    //         address: '',
    //         avatar: '',
    //         isAdmin: false,
    //     });
    // };
    // const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isErrorUpdated } = mutationUpdate;

    // useEffect(() => {
    //     if (isSuccessUpdated && dataUpdated?.status === 'OK') {
    //         messages.success('thêm thành công');
    //         handleCloseDrawer();
    //     } else if (isErrorUpdated && dataUpdated?.status === 'ERR') {
    //         messages.error('thêm thất bại');
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [isSuccessUpdated, isErrorUpdated]);

    // const handleOnUpdate = () => {
    //     mutationUpdate.mutate(
    //         { id: rowSelected, ...stateUserDetail, token: user?.access_token },
    //         {
    //             onSettled: () => {
    //                 queryUser.refetch();
    //             },
    //         },
    //     );
    // };
    //Delete
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };
    const mutationDelete = useMutationHooks((data) => {
        const { id, token } = data;
        const res = CommentService.deleteComment(id, token);
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
                    queryComment.refetch();
                },
            },
        );
    };
    //Delete Many
    // const mutationDeleteMany = useMutationHooks((data) => {
    //     const { token, ...ids } = data;
    //     const res = UserService.deleteManyUser(ids, token);
    //     return res;
    // });
    // const { data: dataDeletedMany, isSuccess: isSuccessDeletedMany, isErrorDeletedMany } = mutationDeleteMany;

    // useEffect(() => {
    //     if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
    //         messages.success('xóa thành công');
    //         handleCancelDelete();
    //     } else if (isErrorDeletedMany && dataDeletedMany?.status === 'ERR') {
    //         messages.error('xóa thất bại');
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [isSuccessDeleted, isErrorDeleted]);

    // const handleDeleteManyUser = (ids) => {
    //     mutationDeleteMany.mutate(
    //         { ids: ids, token: user?.access_token },
    //         {
    //             onSettled: () => {
    //                 queryUser.refetch();
    //             },
    //         },
    //     );
    // };
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
            dataIndex: 'userName',
            render: (text) => <span>{text}</span>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            sorter: (a, b) => a.author.length - b.author.length,
            ...getColumnSearchProps('comment'),
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction,
        },
    ];
    const dataTable =
        comments?.data?.length &&
        comments?.data?.map((comment) => {
            return { ...comment, key: comment?._id };
        });

    return (
        <div className={cx('wrapper')}>
            <div>Quản lý người dùng</div>
            <div>
                <TableComponent
                    // handleDeleteMany={handleDeleteManyUser}
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
            <Loading isLoading={isLoadingDeleted}>
                <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
                    <div>Bạn có chắc muốn xóa sản phẩm này không</div>
                </ModalComponent>
            </Loading>
        </div>
    );
}

export default AdminComment;
