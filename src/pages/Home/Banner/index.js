import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { GrNext, GrPrevious } from 'react-icons/gr';
import styles from './Banner.module.scss';
import classNames from 'classnames/bind';
import images, { BBanner } from '~/assets/images';

const cx = classNames.bind(styles);

const renderArrowPrev = (onClickHandler, hasPrev, label) =>
    hasPrev && (
        <button type="button" onClick={onClickHandler} title={label} className={cx('btn-prev')}>
            <GrPrevious />
        </button>
    );

const renderArrowNext = (onClickHandler, hasNext, label) =>
    hasNext && (
        <button type="button" onClick={onClickHandler} title={label} className={cx('btn-next')}>
            <GrNext />
        </button>
    );

function Banner() {
    return (
        <div className={cx('banner')}>
            <div className={cx('big-banner')}>
                <Carousel
                    showThumbs={false}
                    autoPlay
                    infiniteLoop
                    emulateTouch
                    showIndicators
                    showStatus={false}
                    renderArrowPrev={renderArrowPrev}
                    renderArrowNext={renderArrowNext}
                >
                    {BBanner.map((banner) => (
                        <img key={banner.banner} src={banner.banner} alt="" />
                    ))}
                </Carousel>
            </div>
            <div className={cx('small-banner')}>
                <img src={images.sBanner1} alt="" />
                <img src={images.sBanner} alt="" />
            </div>
        </div>
    );
}

export default Banner;
