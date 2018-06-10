import {combineReducers} from 'redux'
import {REMOVE_USER, SET_USER} from './actions'

const authentication = (state = {}, action) => {
    if (action.type === SET_USER) {
        const {user} = action;
        console.log('going to set user', user);
        return {...state, user};
    } else if (action.type === REMOVE_USER) {
        console.log('going to remove user');
        return {...state, user: undefined};
    } else {
        return state;
    }
};

const stayMotivatedApp = combineReducers({authentication});

export default stayMotivatedApp;
