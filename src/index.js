import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import swConfig from './swConfig'
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import "./styles/main.scss";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

serviceWorkerRegistration.register(swConfig);
