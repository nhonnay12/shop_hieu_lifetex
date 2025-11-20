import { Wrapper as PopperWrapper } from '~/components/Popper';
import SearchResult from '~/layouts/DefaultLayout/Header/SearchResult';
import Tippy from '@tippyjs/react/headless';
import { AiOutlineSearch } from 'react-icons/ai';
import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './InputSearch.module.scss';
import { useDispatch } from 'react-redux';
import { searchProduct } from '~/redux/slides/ProductSlide';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '~/context/SearchContext';

const cx = classNames.bind(styles);

function InputSearch() {
    const { searchValue, setSearchValue, searchResult, setSearchResult, showResult, setShowResult } = useContext(SearchContext);

    const navigate = useNavigate();
    const handleNavigateSearch = () => {
        setShowResult(false);
        navigate('/search');
    };

    const dispatch = useDispatch();

    const handleHideResult = () => {
        setShowResult(false);
    };

    const onSearch = (e) => {
        setSearchValue(e.target.value);
        dispatch(searchProduct(e.target.value));
    };

    return (
        <div key="uniqueId1">
            <Tippy
                placement="bottom"
                interactive
                visible={showResult}
                render={(attrs) => (
                    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            <h4 className={cx('search-title')}>Sản phẩm liên quan</h4>
                            {searchResult ? (
                                searchResult?.map((result) => <SearchResult key={result._id} data={result} />)
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>Không tìm thấy sản phẩm</div>
                            )}
                        </PopperWrapper>
                    </div>
                )}
                onClickOutside={handleHideResult}
            >
                <div className={cx('search')}>
                    <input value={searchValue || ''} onChange={onSearch} onFocus={() => setShowResult(true)} placeholder="Tìm kiếm sản phẩm mong muốn ..." />
                    <button className={cx('search-btn')} onClick={handleNavigateSearch}>
                        <AiOutlineSearch />
                    </button>
                </div>
            </Tippy>
        </div>
    );
}

export default InputSearch;
