import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createClient} from '@supabase/supabase-js'
import {SessionContextProvider} from '@supabase/auth-helpers-react'
const supabase = createClient(
"https://xissqcaofxfaahdzjecp.supabase.co",
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpc3NxY2FvZnhmYWFoZHpqZWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAxMzkxMjgsImV4cCI6MjAyNTcxNTEyOH0.ZH3FjXswm_M9sGPF6LxyLPqbxDF6_OW4NPb5lcHuEZA"
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
    <App />
    </SessionContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
