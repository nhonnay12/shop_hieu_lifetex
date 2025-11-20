import { Button as But } from 'antd/es/radio';
import Button from '~/components/Button';
import { IoMdAddCircleOutline } from 'react-icons/io';
import classNames from 'classnames/bind';
import style from './AdminCategory.module.scss';
import TableComponent from '../ComponentAdmin/TableComponent';
import { Modal, Upload, Button as BTN, Input, Space } from 'antd';
import { AiOutlineDelete } from 'react-icons/ai';

import { useRef, useState } from 'react';
import { getBase64 } from '~/ultil';
import { useMutationHooks } from '~/hooks/useMutationHook';
import * as CategoryService from '~/service/CategoryService';
import { useEffect } from 'react';
import * as messages from '~/components/Message';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useQuery } from 'react-query';
import ModalComponent from '../ComponentAdmin/ModalComponent';
import { useSelector } from 'react-redux';
import Loading from '~/components/LoadingComponent';
const cx = classNames.bind(style);
function AdminCategory() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const initial = () => ({
        nameType: '',
        image: '',
    });
    const [stateCategory, setStateCategory] = useState(initial());

    //thêm dữ liệu vào Category bằng react query
    const mutation = useMutationHooks((data) => {
        const { nameType, image } = data;
        const res = CategoryService.createCategory({
            nameType,
            image,
        });
        return res;
    });
    const { data, isSuccess, isError } = mutation;
    //

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            messages.success('thêm thành công');
            handleCancel();
        } else if (isError && data?.status === 'ERR') {
            messages.error('thêm thất bại');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError]);

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateCategory({
            nameType: '',
            image: '',
        });
    };
    const getAllCategory = async () => {
        const res = await CategoryService.getAllCategory();
        return res;
    };
    const queryCategory = useQuery(['category'], getAllCategory);
    const { isLoading: isLoadingCategory, data: category } = queryCategory;

    const handleOnfinish = () => {
        const params = {
            nameType: stateCategory.nameType,
            image: stateCategory.image,
        };
        mutation.mutate(params, {
            onSettled: () => {
                queryCategory.refetch();
            },
        });
        handleCancel();
    };
    const handleOnChange = (e) => {
        setStateCategory({
            ...stateCategory,
            [e.target.name]: e.target.value,
        });
    };

    const handleOnChangeAvatar = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateCategory({
            ...stateCategory,
            image: file.preview,
        });
    };
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

    const renderAction = () => {
        return (
            <div>
                <AiOutlineDelete style={{ fontSize: '3rem' }} onClick={() => setIsModalOpenDelete(true)} />
            </div>
        );
    };
    const [rowSelected, setRowSelected] = useState('');
    const user = useSelector((state) => state?.user);

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };
    const handleDeleteProduct = () => {
        mutationDelete.mutate(
            { id: rowSelected, token: user?.access_token },
            {
                onSettled: () => {
                    queryCategory.refetch();
                },
            },
        );
    };
    const mutationDelete = useMutationHooks((data) => {
        const { id, token } = data;
        const res = CategoryService.deleteCategory(id, token);
        return res;
    });
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isErrorDeleted } = mutationDelete;
    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            messages.success('xóa thành công');
            handleCancelDelete();
        } else if (isErrorDeleted && dataDeleted?.status === 'ERR') {
            messages.error('xóa thất bại');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessDeleted, isErrorDeleted]);

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
            title: 'nameType',
            dataIndex: 'nameType',
            width: 700,
            render: (text) => <span>{text}</span>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('nameType'),
        },
        {
            title: 'image',
            dataIndex: 'image',
            width: 100,
            render: (text, record) => {
                return (
                    <div>
                        <img src={record.image} alt="" style={{ maxHeight: '119px' }} />
                    </div>
                );
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction,
        },
    ];
    const dataTable =
        category?.data?.length &&
        category?.data?.map((product) => {
            return { ...product, key: product._id };
        });
    return (
        <div className={cx('wrapper')}>
            <div>Quản lý người dùng</div>
            <But className={cx('btn-add')} onClick={() => setIsModalOpen(true)}>
                <IoMdAddCircleOutline className={cx('icon-add')} />
            </But>
            <div>
                <TableComponent
                    // handleDeleteMany={handleDeleteManyProduct}
                    columns={columns}
                    data={dataTable}
                    isLoading={isLoadingCategory}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                setRowSelected(record?._id);
                            },
                        };
                    }}
                />
            </div>
            <Modal title="" open={isModalOpen} onCancel={handleCancel} footer={null} width="80%">
                <form method="post" action="">
                    <div className={cx('form-group')}>
                        <label htmlFor="nameType" className={cx('form-label')}>
                            nameType
                        </label>
                        <div className={cx('form-input')}>
                            <input
                                value={stateCategory.nameType}
                                onChange={handleOnChange}
                                type="text"
                                placeholder="Nhập nameType"
                                className={cx('form-control')}
                                id="nameType"
                                name="nameType"
                            />
                        </div>
                    </div>
                    <div className={cx('form-input-avatar')}>
                        <Upload onChange={handleOnChangeAvatar} className={cx('ant-upload-list-item.ant-upload-list-item-error')} maxCount={1}>
                            <BTN>Select File</BTN>
                        </Upload>
                        {stateCategory?.image && <img src={stateCategory?.image} className={cx('input-avatar')} alt="avatar" />}
                    </div>
                </form>
                <Button login className={cx('btn-save')} onClick={handleOnfinish}>
                    Lưu
                </Button>
            </Modal>
            <Loading isLoading={isLoadingDeleted}>
                <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
                    <div>Bạn có chắc muốn xóa sản phẩm này không</div>
                </ModalComponent>
            </Loading>
        </div>
    );
}

export default AdminCategory;
