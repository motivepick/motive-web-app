import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import stayMotivatedApp from './reducers'
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import {setUser} from "./actions";
import 'bootstrap/dist/css/bootstrap.min.css';

const store = createStore(stayMotivatedApp);

const fetchUser = () => {
    const userId = localStorage.getItem('id');
    if (userId) {
        fetch(`https://api-motiv.yaskovdev.com/users/${userId}`, {
            headers: {
                'Accept': 'application/json',
            }
        }).then(response => response.json()).then(user => store.dispatch(setUser(user)));
    }
};

fetchUser();

ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('root'));
registerServiceWorker();
