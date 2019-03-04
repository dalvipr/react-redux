import * as actionTypes from '../actions/types';

const initialState = {
    currentUser: null,
    isLoading: true
}

export default function (state= initialState, action) {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                isLoading: false,
                currentUser: action.payload.currentUser
            }

        case actionTypes.CLEAR_USER:
            return {
                isLoading: false,
                currentUser: action.payload.currentUser
            }

    
        default:
            return state;
    }
}