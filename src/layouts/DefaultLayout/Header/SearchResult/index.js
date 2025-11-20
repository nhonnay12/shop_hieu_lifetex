import classNames from 'classnames/bind';
import styles from './SearchResult.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);
function SearchResult({ data }) {
    return (
        <Link to={`/product/${data._id}`} className={cx('search-result')}>
            <div className={cx('wrapper')}>
                <img className={cx('produce')} src={data.image} alt="" />
                <div className={cx('info')}>
                    <p className={cx('name')}>{data.name} </p>
                </div>
            </div>
        </Link>
    );
}

export default SearchResult;
