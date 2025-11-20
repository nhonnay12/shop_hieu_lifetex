import Home from '~/pages/Home';
import Cart from '~/pages/Cart';
import Produce from '~/pages/Produce';
import Profile from '~/pages/Profile';
import Login from '~/pages/Login';
import Register from '~/pages/Register';
import Admin from '~/pages/Admin';
import NotFoundPage from '~/pages/NotFoundPage';
import SearchPage from '~/pages/SearchPage';
import Category from '~/pages/category';
import CheckoutPage from '~/pages/CheckoutPage';
import OrderSuccess from '~/pages/OrderSuccess';
import MyOrder from '~/pages/MyOrder';
import DetailOrder from '~/pages/DetailOrder';
import ForgotPass from '~/pages/ForgotPass';

const publishRoutes = [
    { path: '/', component: Home },
    { path: '/cart', component: Cart },
    { path: '/product/:id', component: Produce },
    { path: '/profile', component: Profile },
    { path: '/login', component: Login },
    { path: '/forgotpass', component: ForgotPass },

    { path: '/register', component: Register },
    { path: '/search', component: SearchPage },
    { path: '/category/:type', component: Category },
    { path: '/checkout', component: CheckoutPage },
    { path: '/ordersuccess', component: OrderSuccess },
    { path: '/my_order', component: MyOrder },
    { path: '/detail_Order/:id', component: DetailOrder },
    { path: '/system/admin', component: Admin, layout: null },
    { path: '*', component: NotFoundPage, layout: null },
];
// const privateRoutes = [{ path: '/system/admin', component: Admin, layout: null, isPrivate: true }];

export { publishRoutes };
