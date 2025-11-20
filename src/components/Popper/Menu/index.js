import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import styles from './Menu.module.scss';
import * as ProductService from '~/service/ProductService';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(styles);

function MenuTippy({ children }) {
    const navigate = useNavigate();
    const [typeProduct, setTypeProduct] = useState([]);
    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct();
        if (res?.status === 'OK') {
            setTypeProduct(res?.data);
        }
    };

    useEffect(() => {
        fetchAllTypeProduct();
    }, []);

    const hanldeNavigateCategory = (type) => {
        navigate(
            `/category/${type
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                ?.replace(/ /g, '_')}`,
            { state: type },
        );
    };

    return (
        <div>
            <Tippy
                delay={[0, 300]}
                placement="bottom"
                interactive
                render={(attrs) => (
                    <div className={cx('list-menu')} tabIndex="-1" {...attrs}>
                        <PopperWrapper className={cx('wrapper')}>
                            <div className={cx('title')}>Danh mục sản phẩm</div>

                            <div className={cx('item-menu')}>
                                {typeProduct.map((item) => {
                                    return (
                                        <div key={item} className={cx('item')} onClick={() => hanldeNavigateCategory(item)}>
                                            {item}
                                        </div>
                                    );
                                })}
                            </div>
                        </PopperWrapper>
                    </div>
                )}
            >
                {children}
            </Tippy>
        </div>
    );
}

export default MenuTippy;
