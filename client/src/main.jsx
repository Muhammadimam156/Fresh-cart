import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './app/store';
import { setToken, loadMe } from './features/auth/authSlice';
import { setAuthToken } from './api/client';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

const token = window.localStorage.getItem('freshcart-token');
if (token) {
  store.dispatch(setToken(token));
  setAuthToken(token);
  store.dispatch(loadMe());
}
