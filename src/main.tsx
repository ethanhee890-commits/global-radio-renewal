import React from 'react';
import ReactDOM from 'react-dom/client';
import GlobalRadioApp from './GlobalRadioApp';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GlobalRadioApp />
  </React.StrictMode>
);

document.getElementById('boot-splash')?.remove();
