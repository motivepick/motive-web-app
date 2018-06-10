import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import stayMotivatedApp from './reducers'
import {Provider} from 'react-redux'
import {createStore} from 'redux'

const store = createStore(stayMotivatedApp);

ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('root'));
registerServiceWorker();
