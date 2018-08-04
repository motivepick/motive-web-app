import { combineReducers } from 'redux';
import { REMOVE_USER, SET_USER } from './actions';

const authentication = (state = {}, action) => {
    if (action.type === SET_USER) {
        const { user } = action;
        return { ...state, user, done: true };
    } else if (action.type === REMOVE_USER) {
        return { ...state, user: undefined };
    } else {
        return state;
    }
};

const stayMotivatedApp = combineReducers({ authentication });

export default stayMotivatedApp;
