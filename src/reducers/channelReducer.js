import * as actionTypes from '../actions/types';

const initialState = {
    currentChannel: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.SET_CURRENT_CHANNEL:
            return {
                currentChannel: action.payload.currentChannel
            }

        default:
            return state;
    }
}