import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { privateRoutes, publishRoutes } from '~/routes';
import { DefaultLayout } from '~/layouts';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode';

import { isJsonString } from './ultil';
import * as UserService from '~/service/UserService';
import { resetUser, updateUser } from '~/redux/slides/userSlide';
import Loading from './components/LoadingComponent';

function App() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector((state) => state.user);

    useEffect(() => {
        setIsLoading(true);
        const { storageData, decoded } = handleDecoded();
        
        if (decoded?.id) {
            handleGetDetailsUser(decoded.id, storageData)
                .then(() => {
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching user details:', error);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    dispatch(resetUser());
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, []);

    const handleDecoded = () => {
        let storageData = localStorage.getItem('access_token');
        let decoded = {};
        
        if (storageData && isJsonString(storageData)) {
            try {
                storageData = JSON.parse(storageData);
                decoded = jwt_decode(storageData);
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            }
        }
        
        return { decoded, storageData };
    };

    // ✅ INTERCEPTOR TỰ ĐỘNG REFRESH TOKEN
    UserService.axiosJWT.interceptors.request.use(
        async (config) => {
            try {
                const currentTime = new Date().getTime() / 1000;
                let storageData = localStorage.getItem('access_token');
                
                if (!storageData || !isJsonString(storageData)) {
                    return config;
                }
                
                storageData = JSON.parse(storageData);
                const decoded = jwt_decode(storageData);
                
                // ✅ Kiểm tra nếu token sắp hết hạn (còn < 5 phút)
                // Hoặc đã hết hạn
                if (decoded.exp < currentTime + 300) {
                    console.log('Access token expiring soon or expired, refreshing...');
                    
                    let storageRefreshToken = localStorage.getItem('refresh_token');
                    
                    if (!storageRefreshToken || !isJsonString(storageRefreshToken)) {
                        console.log('No refresh token, logging out');
                        dispatch(resetUser());
                        return Promise.reject(new Error('No refresh token'));
                    }
                    
                    const refreshToken = JSON.parse(storageRefreshToken);
                    
                    try {
                        const decodedRefreshToken = jwt_decode(refreshToken);
                        
                        if (decodedRefreshToken.exp > currentTime) {
                            // Refresh token còn hạn
                            const data = await UserService.refreshToken(refreshToken);
                            
                            if (data?.access_token) {
                                console.log('Token refreshed successfully');
                                localStorage.setItem('access_token', JSON.stringify(data.access_token));
                                config.headers['token'] = `Bearer ${data.access_token}`;
                            } else {
                                console.log('Refresh failed, logging out');
                                localStorage.removeItem('access_token');
                                localStorage.removeItem('refresh_token');
                                dispatch(resetUser());
                                return Promise.reject(new Error('Refresh failed'));
                            }
                        } else {
                            // Refresh token hết hạn
                            console.log('Refresh token expired, logging out');
                            localStorage.removeItem('access_token');
                            localStorage.removeItem('refresh_token');
                            dispatch(resetUser());
                            return Promise.reject(new Error('Refresh token expired'));
                        }
                    } catch (error) {
                        console.error('Error refreshing token:', error);
                        dispatch(resetUser());
                        return Promise.reject(error);
                    }
                } else {
                    // Token còn hạn, dùng bình thường
                    config.headers['token'] = `Bearer ${storageData}`;
                }
                
                return config;
            } catch (err) {
                console.error('Interceptor error:', err);
                return Promise.reject(err);
            }
        },
        (err) => {
            return Promise.reject(err);
        },
    );

    const handleGetDetailsUser = async (id, token) => {
        try {
            let storageRefreshToken = localStorage.getItem('refresh_token');
            
            if (!storageRefreshToken || !isJsonString(storageRefreshToken)) {
                throw new Error('No refresh token found');
            }
            
            const refreshToken = JSON.parse(storageRefreshToken);
            const res = await UserService.getDetailUser(id, token);
            
            if (res?.data) {
                dispatch(updateUser({ 
                    ...res.data, 
                    access_token: token, 
                    refreshToken: refreshToken 
                }));
            }
        } catch (error) {
            console.error('Error in handleGetDetailsUser:', error);
            throw error;
        }
    };

    return (
        <Loading isLoading={isLoading}>
            <Router>
                <div className="App">
                    <Routes>
                        {publishRoutes.map((route, index) => {
                            let Layout = route.layout || DefaultLayout;

                            if (route.layout) {
                                Layout = route.layout;
                            } else if (route.layout === null) {
                                Layout = Fragment;
                            }
                            const Page = route.component;
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </div>
            </Router>
        </Loading>
    );
}

export default App;