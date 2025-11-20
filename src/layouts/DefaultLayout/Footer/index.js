import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import logo from '~/assets/images/img/logo.png';
import logo2 from '~/assets/images/img/logo-bo-cong-thuong-da-thong-bao1.png';
import nhan1 from '~/assets/images/img/Facebook-on.png';
import nhan2 from '~/assets/images/img/Insta-on.png';
import nhan3 from '~/assets/images/img/Youtube-on.png';
import nhan4 from '~/assets/images/img/twitter-on.png';
import nhan5 from '~/assets/images/img/tumblr-on.png';
import nhan6 from '~/assets/images/img/pinterest-on.png';
import gg from '~/assets/images/img/android1.png';
import gg2 from '~/assets/images/img/appstore1.png';
import T1 from '~/assets/images/img/ZaloPay-logo-130x83.png';
import T2 from '~/assets/images/img/momopay.png';
import T3 from '~/assets/images/img/shopeepay_logo.png';
import T4 from '~/assets/images/img/logo_moca_120.jpg';
import T5 from '~/assets/images/img/vnpay_logo.png';

import { FaMapMarkerAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { BsFillTelephoneFill } from 'react-icons/bs';

const cx = classNames.bind(styles);
function Footer() {
    return (
        <div className={cx('wrapper1')}>
            <div className={cx('banner_ft')}></div>
            <div className={cx('wrapper')}>
                <div className={cx('inner')}>
                    <img className={cx('logo')} src={logo} alt="" />
                    {/* <p className={cx('inner_map')}>Lầu 5, 387-389 Hai Bà Trưng Quận 3 TP HCM</p>
                    <p className={cx('inner_map')}>Công Ty Cổ Phần Phát Hành Sách TP HCM - FAHASA</p>
                    <p className={cx('inner_map')}>60 - 62 Lê Lợi, Quận 1, TP. HCM, Việt Nam</p> */}
                    <p className={cx('inner_node')}>
                        Fahasa.com nhận đặt hàng trực tuyến và giao hàng tận nơi. KHÔNG hỗ trợ đặt mua và nhận hàng trực tiếp tại văn phòng cũng như tất cả Hệ Thống Fahasa trên
                        toàn quốc.
                    </p>
                    <div className={cx('logo2')}>
                        <img src={logo2} alt="" />
                    </div>
                    <div className={cx('logo_nhan')}>
                        <img src={nhan1} alt="" />
                        <img src={nhan2} alt="" />
                        <img src={nhan3} alt="" />
                        <img src={nhan4} alt="" />
                        <img src={nhan5} alt="" />
                        <img src={nhan6} alt="" />
                    </div>
                    <div className={cx('right')}>
                        <img className={cx('gg')} src={gg} alt="" />
                        <img className={cx('gg2')} src={gg2} alt="" />
                    </div>
                </div>

                <div className={cx('wapper-right')}>
                    <div className={cx('right_top')}>
                        <div className={cx('item_top')}>
                            <h4>DỊCH VỤ</h4>
                            <ul className={cx('item_ul')}>
                                <li className={cx('item_li')}>Điều khoản sử dụng</li>
                                <li className={cx('item_li')}>Chính sách bảo mật thông tin</li>
                                <li className={cx('item_li')}>Chính sách bảo mật thanh toán</li>
                                <li className={cx('item_li')}>Giới thiệu Fahasa</li>
                                <li className={cx('item_li')}>Hệ thống trung tâm - nhà sách</li>
                            </ul>
                        </div>
                        <div className={cx('item_top')}>
                            <h4>hỗ trợ</h4>
                            <ul className={cx('item_ul')}>
                                <li className={cx('item_li')}>Chính sách đổi - trả - hoàn tiền</li>
                                <li className={cx('item_li')}>Chính sách bảo hành - bồi hoàn</li>
                                <li className={cx('item_li')}>Chính sách vận chuyển</li>
                                <li className={cx('item_li')}>Chính sách khách sỉ</li>
                                <li className={cx('item_li')}>Phương thức thanh toán và xuất HĐ</li>
                            </ul>
                        </div>
                        <div className={cx('item_top')}>
                            <h4>DỊCH VỤ</h4>
                            <ul className={cx('item_ul')}>
                                <li className={cx('item_li')}>Đăng nhập/Tạo mới tài khoản</li>
                                <li className={cx('item_li')}>Thay đổi địa chỉ khách hàng</li>
                                <li className={cx('item_li')}>Chi tiết tài khoản</li>
                                <li className={cx('item_li')}>Lịch sử mua hàng</li>
                            </ul>
                        </div>
                    </div>

                    <div className={cx('call')}>
                        <h4>LIÊN HỆ</h4>
                        <div className={cx('call_list')}>
                            <p className={cx('call_item')}>
                                <FaMapMarkerAlt />
                                {/* 60-62 Lê Lợi, Q.1, TP. HCM */}
                            </p>
                            <p className={cx('call_item', 'hehe')}>
                                <MdEmail />
                                cskh@fahasa.com.vn
                            </p>
                            <p className={cx('call_item')}>
                                <BsFillTelephoneFill />
                                1900636467
                            </p>
                        </div>
                    </div>

                    <div className={cx('hidden')}>
                        <div className={cx('footer-image-container')}>
                            <img src={T5} alt="" />
                        </div>
                        <div className={cx('footer-image-container')}>
                            <img src={T1} alt="" />
                        </div>
                        <div className={cx('footer-image-container')}>
                            <img className={cx('t2')} src={T2} alt="" />
                        </div>
                        <div className={cx('footer-image-container')}>
                            <img className={cx('t3')} src={T3} alt="" />
                        </div>
                        <div className={cx('footer-image-container')}>
                            <img className={cx('t4')} src={T4} alt="" />
                        </div>
                    </div>
                </div>
            </div>

            <p className={cx('bim')}>
                Giấy chứng nhận Đăng ký Kinh doanh số 0304132047 do Sở Kế hoạch và Đầu tư Thành phố Hồ Chí Minh cấp ngày 20/12/2005, đăng ký thay đổi lần thứ 10, ngày 20/05/2022.
            </p>
        </div>
    );
}

export default Footer;
