// AdminInventory.jsx
import { useQuery } from 'react-query';
import { useRef, useState, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { Button as BTN, Input, Space } from 'antd';

import * as ProductService from '~/service/ProductService';
import TableComponent from '../ComponentAdmin/TableComponent';
import { convertPrice } from '~/ultil';

function AdminInventory() {
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

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

    const columns = [
        { title: 'Tên sản phẩm', dataIndex: 'name', sorter: (a, b) => (a.name || '').length - (b.name || '').length, ...getColumnSearchProps('name') },
        { title: 'Giá', dataIndex: 'price', sorter: (a, b) => (a.price || 0) - (b.price || 0), render: (price) => convertPrice(price) },
        { title: 'Tồn kho', dataIndex: 'countInStock', sorter: (a, b) => (a.countInStock || 0) - (b.countInStock || 0) },
        { title: 'Đã bán', dataIndex: 'sold', sorter: (a, b) => (a.sold || 0) - (b.sold || 0) },
    ];

    return (
        <div>
            <h2>Quản lý kho</h2>
            <TableComponent columns={columns} isLoading={isLoadingProducts} data={dataTable} />
        </div>
    );
}

export default AdminInventory;
