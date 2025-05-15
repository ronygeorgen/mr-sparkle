import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import ThemeProvider from './utils/ThemeContext';
import App from './App';
import { FiscalPeriodProvider } from './contexts/FiscalPeriodContext';
import { store, persistor } from './app/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import './services/request_interceptor';
import './services/response_interceptor';

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <ThemeProvider>
            <FiscalPeriodProvider>
              <App />
            </FiscalPeriodProvider>
          </ThemeProvider>
        </Router>
      </PersistGate>
    </Provider>
);