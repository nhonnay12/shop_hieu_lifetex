import React from 'react';
import ReactDOM from 'react-dom'; // Sử dụng 'react-dom' thay vì 'react-dom/client'
import App from '~/App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from './components/GlobalStyles';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import SearchProvider from './context/SearchContext';

const queryClient = new QueryClient();

ReactDOM.render(
    <QueryClientProvider client={queryClient}>
        <GlobalStyles>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <SearchProvider>
                        <App />
                    </SearchProvider>
                </PersistGate>
            </Provider>
        </GlobalStyles>
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>,
    document.getElementById('root'), // Sử dụng 'render' với React 17
);

reportWebVitals();
