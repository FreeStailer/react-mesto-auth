import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App.js';
import { HashRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals.js';

ReactDOM.render(
  <React.StrictMode>
      <HashRouter>
          <App/>
      </HashRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);

reportWebVitals();