// AdminInventory.jsx
import { useQuery } from 'react-query';
import { useRef, useState, useEffect, useMemo } from 'react';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { Button as BTN, Input, Space, Modal, InputNumber, Form, Typography, Tag } from 'antd';

import * as ProductService from '~/service/ProductService';
import TableComponent from '../ComponentAdmin/TableComponent';
import { convertPrice } from '~/ultil';
import { useMutationHooks } from '~/hooks/useMutationHook';
import * as messages from '~/components/Message';
import axios from 'axios';

function AdminInventory() {
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalType, setModalType] = useState(''); // 'stock-in' or 'stock-out'
    const [quantity, setQuantity] = useState(1);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

    const [form] = Form.useForm();
    const [bulkForm] = Form.useForm();

    // fetch và chuẩn hoá dữ liệu ngay ở đây
    const fetchProducts = async () => {
        const res = await ProductService.getAllProducts();
        // Nếu service trả về axios response: res.data
        // Nếu service trả về payload như { data: [...]}: res.data || res
        // Thử cân nhắc res?.data ?? res
        return res?.data ?? res;
    };

    const queryProduct = useQuery(['products'], fetchProducts, {
        // optional: retry: false, staleTime...
    });

    const { isLoading: isLoadingProducts, data: productsRaw } = queryProduct;

    // Debug nhanh: mở console để biết shape trả về của productsRaw
    useEffect(() => {
        console.log('productsRaw', productsRaw);
    }, [productsRaw]);

    // Chuẩn hoá thành mảng product
    const productsArray = Array.isArray(productsRaw)
        ? productsRaw
        : Array.isArray(productsRaw?.data)
        ? productsRaw.data
        : Array.isArray(productsRaw?.stories)
        ? productsRaw.stories
        : [];

    const dataTable = productsArray.map((product) => ({
        ...product,
        key: product._id ?? product.id ?? Math.random().toString(36).slice(2),
    }));

    const selectedProductsForBulk = useMemo(() => {
        return dataTable.filter((product) => selectedRowKeys.includes(product.key));
    }, [selectedRowKeys, dataTable]);

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = { selectedRowKeys, onChange: onSelectChange };

    // --- phần search/filter không đổi ---
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
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <BTN type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
                        Search
                    </BTN>
                    <BTN onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </BTN>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
        onFilter: (value, record) => (record[dataIndex] ?? '').toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }} searchWords={[searchText]} autoEscape textToHighlight={text ? text.toString() : ''} />
            ) : (
                text
            ),
    });

    // const openModal = (type, record) => {
    //     setModalType(type);
    //     setSelectedProduct(record);
    //     setIsModalOpen(true);
    //     setQuantity(1); // Reset số lượng về 1 mỗi khi mở modal
    //     form.setFieldsValue({ quantity: 1 });
    // };

    const openBulkModal = (type) => {
        setModalType(type);
        setIsBulkModalOpen(true);
        bulkForm.setFieldsValue({
            products: selectedProductsForBulk.map((p) => ({ key: p.key, name: p.name, countInStock: p.countInStock, quantity: 1 })),
        });
    };

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                if (modalType === 'stock-in') {
                    console.log(`Nhập ${values.quantity} sản phẩm "${selectedProduct.name}"`);
                    // TODO: Gọi API để nhập kho
                } else {
                    console.log(`Xuất ${values.quantity} sản phẩm "${selectedProduct.name}"`);
                    // TODO: Gọi API để xuất kho
                }
                setIsModalOpen(false);
                form.resetFields();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
        form.resetFields();
    };

    // --- MUTATION CHO BULK UPDATE ---
    const mutationBulkUpdate = useMutationHooks(async (data) => {
        const res = await axios.put(`http://localhost:5000/api/story/stories/bulk-update`, data);
        return res.data;
    });
    const { isLoading: isLoadingBulkUpdate, isSuccess: isSuccessBulkUpdate, isError: isErrorBulkUpdate } = mutationBulkUpdate;

    useEffect(() => {
        if (isSuccessBulkUpdate) {
            messages.success('Cập nhật kho hàng loạt thành công!');
        } else if (isErrorBulkUpdate) {
            messages.error('Cập nhật kho hàng loạt thất bại!');
        }
    }, [isSuccessBulkUpdate, isErrorBulkUpdate]);

    const handleBulkOk = () => {
        bulkForm
            .validateFields()
            .then((values) => {
                const payload = {
                    stories: values.products.map((p) => ({
                        id: p.key,
                        // Nếu là xuất kho, chuyển số lượng thành số âm
                        countInStock: modalType === 'stock-out' ? -p.quantity : p.quantity,
                    })),
                };

                mutationBulkUpdate.mutate(payload, {
                    onSuccess: () => {
                        queryProduct.refetch(); // Tải lại danh sách sản phẩm
                        setIsBulkModalOpen(false);
                        setSelectedRowKeys([]);
                    },
                });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleBulkCancel = () => {
        setIsBulkModalOpen(false);
    };

    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            sorter: (a, b) => (a.name || '').length - (b.name || '').length,
            ...getColumnSearchProps('name'),
            // Thêm ellipsis để tên sản phẩm dài không bị vỡ layout
            ellipsis: true,
        },
        { title: 'Giá', dataIndex: 'price', sorter: (a, b) => (a.price || 0) - (b.price || 0), render: (price) => convertPrice(price) },
        // { title: 'Số lượng ban đầu', dataIndex: 'initialQuantity', sorter: (a, b) => (a.initialQuantity || 0) - (b.initialQuantity || 0) },
        { title: 'Số lượng tồn kho', dataIndex: 'countInStock', sorter: (a, b) => (a.countInStock || 0) - (b.countInStock || 0) },
        { title: 'Đã bán', dataIndex: 'sold', sorter: (a, b) => (a.sold || 0) - (b.sold || 0) },
        {
            title: 'Trạng thái',
            dataIndex: 'countInStock',
            sorter: (a, b) => (a.countInStock || 0) - (b.countInStock || 0),
            render: (countInStock) => {
                let color;
                let text;
                if (countInStock === 0) {
                    color = 'red';
                    text = 'Hết hàng';
                } else if (countInStock > 0 && countInStock <= 5) {
                    color = 'orange';
                    text = 'Sắp hết';
                } else {
                    color = 'green';
                    text = 'Còn hàng';
                }
                return <Tag color={color}>{text}</Tag>;
            },
            filters: [
                { text: 'Còn hàng', value: 'in_stock' },
                { text: 'Sắp hết', value: 'low_stock' },
                { text: 'Hết hàng', value: 'out_of_stock' },
            ],
            onFilter: (value, record) => {
                if (value === 'out_of_stock') return record.countInStock === 0;
                if (value === 'low_stock') return record.countInStock > 0 && record.countInStock <= 10;
                if (value === 'in_stock') return record.countInStock > 10;
                return true;
            },
        },
        // {
        //     title: 'Nhập kho',
        //     key: 'stock-in',
        //     render: (_, record) => <BTN type="primary" icon={<PlusOutlined />} onClick={() => openModal('stock-in', record)} />,
        // },
        // {
        //     title: 'Xuất kho',
        //     key: 'stock-out',
        //     render: (_, record) => <BTN type="primary" danger icon={<MinusOutlined />} onClick={() => openModal('stock-out', record)} />,
        // },
    ];

    const modalTitle = modalType === 'stock-in' ? 'Nhập kho sản phẩm' : 'Xuất kho sản phẩm';

    const bulkModalTitle = modalType === 'stock-in' ? 'Nhập kho hàng loạt' : 'Xuất kho hàng loạt';

    return (
        <div style={{ padding: '20px' }}>
            <h2>Quản lý kho</h2>
            <Space style={{ marginBottom: 16 }}>
                <BTN type="primary" onClick={() => openBulkModal('stock-in')} disabled={!selectedRowKeys.length}>
                    Nhập kho hàng loạt
                </BTN>
                <BTN type="primary" danger onClick={() => openBulkModal('stock-out')} disabled={!selectedRowKeys.length}>
                    Xuất kho hàng loạt
                </BTN>
            </Space>
            <TableComponent columns={columns} isLoading={isLoadingProducts || isLoadingBulkUpdate} data={dataTable} rowSelection={rowSelection} />
            {/* Modal cho thao tác đơn lẻ */}
            <Modal title={modalTitle} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Xác nhận" cancelText="Hủy">
                {selectedProduct && (
                    <>
                        <Typography.Text>
                            Sản phẩm: <strong>{selectedProduct.name}</strong>
                        </Typography.Text>
                        <br />
                        <Typography.Text>
                            Tồn kho hiện tại: <strong>{selectedProduct.countInStock}</strong>
                        </Typography.Text>
                    </>
                )}
                <Form form={form} layout="vertical" name="stock_form" style={{ marginTop: '20px' }}>
                    <Form.Item
                        name="quantity"
                        label="Số lượng"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số lượng!' },
                            {
                                type: 'number',
                                min: 1,
                                message: 'Số lượng phải lớn hơn 0',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (modalType === 'stock-out' && value > selectedProduct?.countInStock) {
                                        return Promise.reject(new Error('Số lượng xuất không được lớn hơn tồn kho!'));
                                    }
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} value={quantity} onChange={(value) => setQuantity(value)} placeholder="Nhập số lượng" />
                    </Form.Item>
                </Form>
            </Modal>
            {/* Modal cho thao tác hàng loạt */}
            <Modal title={bulkModalTitle} open={isBulkModalOpen} onOk={handleBulkOk} onCancel={handleBulkCancel} width={800} okText="Xác nhận" cancelText="Hủy">
                <Form form={bulkForm} name="bulk_stock_form" autoComplete="off" style={{ maxHeight: '60vh', overflowY: 'auto', marginTop: '20px' }}>
                    <Form.List name="products">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8, alignItems: 'baseline' }} align="baseline">
                                        <Form.Item {...restField} name={[name, 'name']} noStyle>
                                            <Typography.Text style={{ width: '300px' }} ellipsis={{ tooltip: selectedProductsForBulk[key]?.name }}>
                                                {selectedProductsForBulk[key]?.name}
                                            </Typography.Text>
                                        </Form.Item>
                                        <Typography.Text>Tồn kho: {selectedProductsForBulk[key]?.countInStock}</Typography.Text>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'quantity']}
                                            label="Số lượng"
                                            rules={[
                                                { required: true, message: 'Nhập số lượng!' },
                                                {
                                                    type: 'number',
                                                    min: 1,
                                                    message: 'Số lượng phải lớn hơn 0',
                                                },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (modalType === 'stock-out' && value > selectedProductsForBulk[key]?.countInStock) {
                                                            return Promise.reject(new Error('Vượt tồn kho!'));
                                                        }
                                                        return Promise.resolve();
                                                    },
                                                }),
                                            ]}
                                        >
                                            <InputNumber min={1} placeholder="Số lượng" />
                                        </Form.Item>
                                        {/* Hidden field for product key/id */}
                                        <Form.Item {...restField} name={[name, 'key']} hidden>
                                            <Input />
                                        </Form.Item>
                                    </Space>
                                ))}
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </div>
    );
}

export default AdminInventory;
