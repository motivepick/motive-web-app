export const SET_USER = 'SET_USER';
export const REMOVE_USER = 'REMOVE_USER';

export const setUser = (user) => ({ type: SET_USER, user });

export const removeUser = () => {
    localStorage.removeItem('id');
    return { type: REMOVE_USER };
};
