import classNames from 'classnames/bind';
import style from './AdminOrder.module.scss';
import TableComponent from '../ComponentAdmin/TableComponent';
import {
     useEffect,
    useState,
} from 'react';
import { Button as BTN, Input, Space } from 'antd';

import * as OrderService from '~/service/OrderSevice';

import * as messages from '~/components/Message';
import { useQuery } from 'react-query';
import {
    AiOutlineDelete,
    //  AiOutlineEdit
} from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { orderContant } from '~/contant';
import ModalComponent from '../ComponentAdmin/ModalComponent';
import { useMutationHooks } from '~/hooks/useMutationHook';
import Loading from '~/components/LoadingComponent';

const cx = classNames.bind(style);
function AdminOrder() {
    // const [isOpenDrawer, setIsOpenDrawer] = useState(false);

    const [rowSelected, setRowSelected] = useState('');
    const user = useSelector((state) => state?.user);
    //Get All Product
    const getAllOrders = async () => {
        const res = await OrderService.getAllOrder(user?.access_token);
        return res;
    };
    const queryOrder = useQuery(['order'], getAllOrders);
    const { isLoading: isLoadingOrder, data: orders } = queryOrder;
    const renderAction = () => {
        return (
            <div>
                <AiOutlineDelete style={{ fontSize: '3rem' }} onClick={() => setIsModalOpenDelete(true)} />
            </div>
        );
    };

    //Update
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };
    const mutationDelete = useMutationHooks((data) => {
        const { id, token } = data;
        const res = OrderService.deleteOrder(id, token);
        return res;
    });
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isErrorDeleted } = mutationDelete;

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            messages.success('Xóa thành công');
            handleCancelDelete();
        } else if (isErrorDeleted && dataDeleted?.status === 'ERR') {
            messages.error('Xóa thất bại');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessDeleted, isErrorDeleted]);

    const handleDeleteUser = () => {
        mutationDelete.mutate(
            { id: rowSelected, token: user?.access_token },
            {
                onSettled: () => {
                    queryOrder.refetch();
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

    const rendervalue = (value) => {
        if (value === true) {
            return 'Đã thanh toán';
        }
        return 'Chưa thanh toán';
    }

    const columns = [
        {
            title: 'userName',
            dataIndex: 'userName',
            width: 200,
            render: (text) => <span>{text}</span>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('userName'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 200,
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            width: 200,
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            width: 200,
            ...getColumnSearchProps('address'),
        },
        {
            title: 'itemsPrice',
            dataIndex: 'itemsPrice',
            width: 200,
        },
        // {
        //     title: 'product',
        //     dataIndex: 'product',
        //     width: 800,
        //     sorter: (a, b) => a.type.length - b.type.length,
        //     ...getColumnSearchProps('product'),
        // },
        {
            title: 'Phương thức giao hàng',
            dataIndex: 'deliveryMethod',
            width: 300,
        },
        {
            title: 'phí giao hàng',
            dataIndex: 'shippingPrice',
            width: 200,
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentMethod',
            width: 300,
        },
        {
            title: 'tổng tiền',
            dataIndex: 'totalPrice',
            width: 200,
        },

        {
            title: 'Đã thanh toán',
            dataIndex: 'isPaid',
            render: (isPaid) => `${rendervalue(isPaid)}`,
            width: 200,
            filters: [
                {
                    text: 'true',
                    value: true,
                },
                {
                    text: 'false',
                    value: false,
                },
            ],
            onFilter: (value, record) => {
                if (value === true) {
                    return record.isPaid === true;
                } else if (value === false) {
                    return record.isPaid === false;
                }
            },
        },
        // {
        //     title: 'Đã giao',
        //     dataIndex: 'isDelivered',
        //     render: (isDelivered) => `${isDelivered}`,

        //     width: 200,
        //     filters: [
        //         {
        //             text: 'true',
        //             value: true,
        //         },
        //         {
        //             text: 'false',
        //             value: false,
        //         },
        //     ],
        //     onFilter: (value, record) => {
        //         if (value === true) {
        //             return record.isDelivered === true;
        //         } else if (value === false) {
        //             return record.isDelivered === false;
        //         }
        //     },
        // },
        {
            title: 'Action',
            dataIndex: 'action',
            width: 100,
            fixed: 'right',
            render: renderAction,
        },
    ];
    const dataTable =
        orders?.data?.length &&
        orders?.data?.map((order) => {
            return {
                ...order,
                key: order._id,
                userName: order?.shippingAddress?.fullName,
                phone: order?.shippingAddress?.phone,
                email: order?.shippingAddress?.email,
                address: `${order?.shippingAddress?.address} - ${order?.shippingAddress?.city}`,
                product: order?.orderItems?.map((item) => {
                    return `${item?.name}`;
                }),
                image: order?.orderItems?.map((item) => {
                    return `${item?.image}`;
                }),
                deliveryMethod: orderContant.delivery[order?.deliveryMethod],
                paymentMethod: orderContant.payment[order?.paymentMethod],
            };
        });
    return (
        <div className={cx('wrapper')}>
            <div>Quản lý người dùng</div>
            <div className={cx('inner')}>
                <TableComponent
                    columns={columns}
                    data={dataTable}
                    scroll={{
                        x: 1400,
                        y: 400,
                    }}
                    isLoading={isLoadingOrder}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                setRowSelected(record?._id);
                            },
                        };
                    }}
                />
            </div>
            {/* <Loading isLoading={isLoadingDeleted}> */}
            <ModalComponent
                title="Xóa sản phẩmaaaaaaa"
                open={isModalOpenDelete}
                onCancel={handleCancelDelete}
                 onOk={handleDeleteUser}
            >
                <div>Bạn có chắc muốn xóa sản phẩm này không</div>
            </ModalComponent>
            {/* </Loading> */}
        </div>
    );
}

export default AdminOrder;
