import React from 'react';
import ReactDOM from 'react-dom/client';
import './normalize.css';
import './index.css';
import App from "./components/app";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);


// fetch('https://api.themoviedb.org/3/search/movie?query=return&api_key=1ce8507fa682816e1fab555326740ca7')
//     .then((data) => {
//         return data.json()
//     })
//     .then((movies) => {
//         console.log(movies.results)
//     })