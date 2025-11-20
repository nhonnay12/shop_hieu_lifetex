import { Button as But } from 'antd/es/radio';
import Button from '~/components/Button';
import { IoMdAddCircleOutline } from 'react-icons/io';
import classNames from 'classnames/bind';
import style from './AdminProduct.module.scss';
import TableComponent from '../ComponentAdmin/TableComponent';
import { Modal, Upload, Button as BTN, Input, Space, Select } from 'antd';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';

import { useRef, useState } from 'react';
import { getBase64, renderOptions } from '~/ultil';
import { useMutationHooks } from '~/hooks/useMutationHook';
import * as ProductService from '~/service/ProductService';
import { useEffect } from 'react';
import * as messages from '~/components/Message';
import { useQuery } from 'react-query';
import DrawerComponent from '../ComponentAdmin/DrawerComponent';
import { useSelector } from 'react-redux';
import Loading from '~/components/LoadingComponent';
import ModalComponent from '../ComponentAdmin/ModalComponent';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
const cx = classNames.bind(style);
function AdminProduct() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const initial = () => ({
        name: '',
        age: '',
        image: '',
        price: '',
        content: '',
        type: '',
        author: '',
        sold: '',
        pricesale: '',
        rating: '',
        discount: '',
    });
    const [stateProduct, setStateProduct] = useState(initial());
     const [page, setPage] = useState(1);
    const [limit] = useState(10);

    //thêm dữ liệu vào Product bằng react query
    const mutation = useMutationHooks((data) => {
        const { name, image, type, author, sold, price, pricesale, content, rating, age, description, discount } = data;
        const res = ProductService.createProduct({
            name,
            image,
            type,
            author,
            sold,
            price,
            pricesale,
            rating,
            age,
            description,
            discount,
            content,
        });
        return res;
    });
    const { data, isLoading: isLoadingCreate, isSuccess, isError } = mutation;

    //

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            messages.success('Thêm thành công');

            handleCancel();
        } else if (isError && data?.status === 'ERR') {
            messages.error('Thêm thất bại');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError]);

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            name: '',
            age: '',
            image: '',
            price: '',
            content: '',
            type: '',
            author: '',
            sold: '',
            pricesale: '',
            rating: '',
            description: '',
            discount: '',
        });
    };
    const handleOnfinish = () => {
        const params = {
            name: stateProduct.name,
            image: stateProduct.image,
            type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
            author: stateProduct.author,
            sold: stateProduct.sold,
            price: stateProduct.price,
            pricesale: stateProduct.pricesale,
            rating: stateProduct.rating,
            age: stateProduct.age,
            description: stateProduct.description,
            discount: stateProduct.discount,
            content: stateProduct.content,
        };
        mutation.mutate(params, {
            onSettled: () => {
                queryProduct.refetch();
                messages.success('Thêm thành công');
                handleCancel();
            },
        });
    };
    const handleOnChange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value,
        });
    };

    const handleOnChangeAvatar = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview,
        });
    };

    //Get All Product
    const getAllProduct = async () => {
        try {
            // Gọi API với page và limit được truyền chính xác
            const res = await ProductService.getAllProducts(null, page, limit);

            // Kiểm tra res và cập nhật page nếu có pagination từ response
            if (res?.pagination?.page) {
                setPage(res.pagination.page);
            }
            return res.stories;
        } catch (error) {
            console.error('Error fetching stories: ', error);
        }
    };
    const queryProduct = useQuery(['products'], getAllProduct);

    const { isLoading: isLoadingProduct, data: products } = queryProduct;

    const renderAction = () => {
        return (
            <div>
                <AiOutlineDelete style={{ fontSize: '3rem' }} onClick={() => setIsModalOpenDelete(true)} />
                <AiOutlineEdit style={{ fontSize: '3rem' }} onClick={handleDetailProduct} />
            </div>
        );
    };

    //Update
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const user = useSelector((state) => state?.user);
    const [stateProductDetail, setStateProductDetail] = useState(initial());

    const handleOnChangeDetail = (e) => {
        setStateProductDetail({
            ...stateProductDetail,
            [e.target.name]: e.target.value,
        });
    };

    const handleOnChangeAvatarDetail = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetail({
            ...stateProductDetail,
            image: file.preview,
        });
    };

    const fetchGetProductDetail = async (rowSelected) => {
        const res = await ProductService.getDetailProduct(rowSelected);

        if (res?.story) {
            setStateProductDetail({
                name: res?.story?.name,
                image: res?.story?.image,
                type: res?.story?.type,
                author: res?.story?.author,
                sold: res?.story?.sold,
                price: res?.story?.price,
                pricesale: res?.story?.pricesale,
                rating: res?.story?.rating,
                description: res?.story?.description,
                age: res?.story?.age,
                discount: res?.story?.discount,
                content: res?.story?.content,
            });
        }
    };

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            fetchGetProductDetail(rowSelected);
        }
    }, [rowSelected, isOpenDrawer]);
    const handleDetailProduct = () => {
        if (rowSelected) {
        }
        setIsOpenDrawer(true);
    };
    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rest } = data;
        const res = ProductService.updateProduct(id, token, { ...rest });
        return res;
    });
    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateProductDetail({
            name: '',
            age: '',
            image: '',
            price: '',
            content: '',
            type: '',
            author: '',
            sold: '',
            pricesale: '',
            rating: '',
            description: '',
            discount: '',
        });
    };
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isErrorUpdated } = mutationUpdate;

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            messages.success('Cập nhật thành công');
            handleCloseDrawer();
        } else if (isErrorUpdated && dataUpdated?.status === 'ERR') {
            messages.error('Cập nhật thất bại');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessUpdated, isErrorUpdated]);

    const handleOnUpdate = () => {
        mutationUpdate.mutate(
            { id: rowSelected, token: user?.access_token, ...stateProductDetail },
            {
                onSettled: () => {
                    queryProduct.refetch();
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
        const res = ProductService.deleteProduct(id, token);
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

    const handleDeleteProduct = () => {
        mutationDelete.mutate(
            { id: rowSelected, token: user?.access_token },
            {
                onSettled: () => {
                    queryProduct.refetch();
                    messages.success('xóa thành công');
                    setIsModalOpenDelete(false);
                },
            },
        );
    };
    //Delete Many
    const mutationDeleteMany = useMutationHooks((data) => {
        const { token, ...ids } = data;
        const res = ProductService.deleteManyProduct(ids, token);
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

    const handleDeleteManyProduct = (ids) => {
        mutationDeleteMany.mutate(
            { ids: ids, token: user?.access_token },
            {
                onSettled: () => {
                    queryProduct.refetch();
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
            width: 350,
            render: (text) => <span>{text}</span>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            filters: [
                {
                    text: '>= 100',
                    value: '>=',
                },
                {
                    text: '<= 100',
                    value: '<=',
                },
            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return record.price >= 100;
                } else if (value === '<=') {
                    return record.price <= 100;
                }
            },
        },
        {
            title: 'Author',
            dataIndex: 'author',
            sorter: (a, b) => a.author.length - b.author.length,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            sorter: (a, b) => a.type.length - b.type.length,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction,
        },
    ];
    const dataTable = products
        ? products.map((product) => ({
              ...product,
              key: product._id,
          }))
        : [];
    return (
        <div className={cx('wrapper')}>
            <div>Quản lý người dùng</div>
            <But className={cx('btn-add')} onClick={() => setIsModalOpen(true)}>
                <IoMdAddCircleOutline className={cx('icon-add')} />
            </But>
            <div>
                <TableComponent
                    handleDeleteMany={handleDeleteManyProduct}
                    columns={columns}
                    data={dataTable}
                    isLoading={isLoadingProduct}
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
                <Loading isLoading={isLoadingCreate}>
                    <form method="post" action="">
                        <div className={cx('form-group')}>
                            <label htmlFor="name" className={cx('form-label')}>
                                Tên sách
                            </label>
                            <div className={cx('form-input')}>
                                <input
                                    value={stateProduct.name}
                                    onChange={handleOnChange}
                                    type="text"
                                    placeholder="Nhập tên sách"
                                    className={cx('form-control')}
                                    id="name"
                                    name="name"
                                />
                            </div>
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="type" className={cx('form-label')}>
                                Thể loại
                            </label>
                            <div className={cx('form-input')}>
                                <input
                                    value={stateProduct.type}
                                    onChange={handleOnChange}
                                    type="text"
                                    placeholder="Nhập thể loại"
                                    className={cx('form-control')}
                                    id="type"
                                    name="type"
                                />
                            </div>
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="author" className={cx('form-label')}>
                                Tác giả
                            </label>
                            <div className={cx('form-input')}>
                                <input
                                    value={stateProduct.author}
                                    onChange={handleOnChange}
                                    type="text"
                                    placeholder="Nhập tác giả"
                                    className={cx('form-control')}
                                    id="author"
                                    name="author"
                                />
                            </div>
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="age" className={cx('form-label')}>
                                Tuổi
                            </label>
                            <div className={cx('form-input')}>
                                <input value={stateProduct.age} onChange={handleOnChange} name="age" type="text" placeholder="Nhập tuổi" className={cx('form-control')} id="age" />
                            </div>
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="sold" className={cx('form-label')}>
                                Đã bán
                            </label>
                            <div className={cx('form-input')}>
                                <input
                                    value={stateProduct.sold}
                                    onChange={handleOnChange}
                                    name="sold"
                                    type="number"
                                    placeholder="Nhập đã bán"
                                    className={cx('form-control')}
                                    id="sold"
                                />
                            </div>
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="price" className={cx('form-label')}>
                                Giá bán
                            </label>
                            <div className={cx('form-input')}>
                                <input
                                    value={stateProduct.price}
                                    onChange={handleOnChange}
                                    name="price"
                                    type="number"
                                    placeholder="Nhập giá"
                                    className={cx('form-control')}
                                    id="price"
                                />
                            </div>
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="pricesale" className={cx('form-label')}>
                                Giá giảm
                            </label>
                            <div className={cx('form-input')}>
                                <input
                                    value={stateProduct.pricesale}
                                    onChange={handleOnChange}
                                    name="pricesale"
                                    type="number"
                                    placeholder="Nhập giá giảm"
                                    className={cx('form-control')}
                                    id="pricesale"
                                />
                            </div>
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="rating" className={cx('form-label')}>
                                Đánh giá
                            </label>
                            <div className={cx('form-input')}>
                                <input
                                    value={stateProduct.rating}
                                    onChange={handleOnChange}
                                    name="rating"
                                    type="number"
                                    placeholder="Nhập đánh giá"
                                    className={cx('form-control')}
                                    id="rating"
                                />
                            </div>
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="discount" className={cx('form-label')}>
                                Phần trăm giảm giá
                            </label>
                            <div className={cx('form-input')}>
                                <input
                                    value={stateProduct.discount}
                                    onChange={handleOnChange}
                                    name="discount"
                                    type="text"
                                    placeholder="Nhập phần trăm giảm giá"
                                    className={cx('form-control')}
                                    id="discount"
                                />
                            </div>
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="content" className={cx('form-label')}>
                                Nội dung
                            </label>
                            <div className={cx('form-input1')}>
                                <textarea
                                    value={stateProduct.content}
                                    onChange={handleOnChange}
                                    name="content"
                                    placeholder="Nhập nội dung"
                                    className={cx('form-control1')}
                                    id="content"
                                    rows={5}
                                />
                            </div>
                        </div>

                        <div className={cx('form-input-avatar')}>
                            <Upload onChange={handleOnChangeAvatar} className={cx('ant-upload-list-item.ant-upload-list-item-error')} maxCount={1}>
                                <BTN>Select File</BTN>
                            </Upload>
                            {stateProduct?.image && <img src={stateProduct?.image} className={cx('input-avatar')} alt="avatar" />}
                        </div>
                    </form>
                    <Button login className={cx('btn-save')} onClick={handleOnfinish}>
                        Lưu
                    </Button>
                </Loading>
            </Modal>
            <DrawerComponent isOpen={isOpenDrawer} title="Update Sản Phẩm" onClose={() => setIsOpenDrawer(false)} width="80%">
                <Loading isLoading={isLoadingUpdated}>
                    <form method="post" action="">
                        <div className={cx('form-group')}>
                            <label htmlFor="name" className={cx('form-label')}>
                                Tên sách
                            </label>
                            <div className={cx('form-input')}>
                                <input
                                    value={stateProductDetail.name}
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
                            <label htmlFor="type" className={cx('form-label')}>
                                Thể loại
                            </label>
                            <div className={cx('form-input')}>
                                <input
                                    value={stateProductDetail.type}
                                    onChange={handleOnChangeDetail}
                                    type="text"
                                    placeholder="Nhập Type"
                                    className={cx('form-control')}
                                    id="type"
                                    name="type"
                                />
                            </div>
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="author" className={cx('form-label')}>
                                Tác giả
                            </label>
                            <div className={cx('form-input')}>
                                <input
                                    value={stateProductDetail.author}
                                    onChange={handleOnChangeDetail}
                                    type="text"
                                    placeholder="Nhập tác giả"
                                    className={cx('form-control')}
                                    id="author"
                                    name="author"
                                />
                            </div>
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="sold" className={cx('form-label')}>
                                Đã bán
                            </label>
                            <div className={cx('form-input')}>
                                <input
                                    value={stateProductDetail.sold}
                                    onChange={handleOnChangeDetail}
                                    name="sold"
                                    type="number"
                                    placeholder="Nhập đã bán"
                                    className={cx('form-control')}
                                    id="sold"
                                />
                            </div>
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="price" className={cx('form-label')}>
                                Giá
                            </label>
                            <div className={cx('form-input')}>
                                <input
                                    value={stateProductDetail.price}
                                    onChange={handleOnChangeDetail}
                                    name="price"
                                    type="number"
                                    placeholder="Nhập giá"
                                    className={cx('form-control')}
                                    id="price"
                                />
                            </div>
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="pricesale" className={cx('form-label')}>
                                Giá giảm
                            </label>
                            <div className={cx('form-input')}>
                                <input
                                    value={stateProductDetail.pricesale}
                                    onChange={handleOnChangeDetail}
                                    name="pricesale"
                                    type="number"
                                    placeholder="Nhập giá giảm"
                                    className={cx('form-control')}
                                    id="pricesale"
                                />
                            </div>
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="rating" className={cx('form-label')}>
                                Đánh giá
                            </label>
                            <div className={cx('form-input')}>
                                <input
                                    value={stateProductDetail.rating}
                                    onChange={handleOnChangeDetail}
                                    name="rating"
                                    type="number"
                                    placeholder="Nhập rating"
                                    className={cx('form-control')}
                                    id="rating"
                                />
                            </div>
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="age" className={cx('form-label')}>
                                Nhập số tuổi
                            </label>
                            <div className={cx('form-input')}>
                                <input
                                    value={stateProductDetail.age}
                                    onChange={handleOnChangeDetail}
                                    name="age"
                                    type="text"
                                    placeholder="Nhập số tuổi"
                                    className={cx('form-control')}
                                    id="age"
                                />
                            </div>
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="discount" className={cx('form-label')}>
                                Giảm giá
                            </label>
                            <div className={cx('form-input')}>
                                <input
                                    value={stateProductDetail.discount}
                                    onChange={handleOnChangeDetail}
                                    name="discount"
                                    type="text"
                                    placeholder="Nhập phần trăm giảm"
                                    className={cx('form-control')}
                                    id="discount"
                                />
                            </div>
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="content" className={cx('form-label')}>
                                Nội dung
                            </label>
                            <div className={cx('form-input1')}>
                                <textarea
                                    value={stateProductDetail.content}
                                    onChange={handleOnChangeDetail}
                                    name="content"
                                    type="text"
                                    placeholder="Nhập nội dung"
                                    className={cx('form-control1')}
                                    id="content"
                                    rows={5}
                                />
                            </div>
                        </div>

                        <div className={cx('form-input-avatar')}>
                            <Upload onChange={handleOnChangeAvatarDetail} className={cx('ant-upload-list-item.ant-upload-list-item-error')} maxCount={1}>
                                <BTN>Select File</BTN>
                            </Upload>
                            {stateProductDetail?.image && <img src={stateProductDetail?.image} className={cx('input-avatar')} alt="avatar" />}
                        </div>
                    </form>
                    <Button login className={cx('btn-save')} onClick={handleOnUpdate}>
                        Updates
                    </Button>
                </Loading>
            </DrawerComponent>
            <Loading isLoading={isLoadingDeleted}>
                <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
                    <div>Bạn có chắc muốn xóa sản phẩm này không</div>
                </ModalComponent>
            </Loading>
        </div>
    );
}

export default AdminProduct;
