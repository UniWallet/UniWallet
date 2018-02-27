import * as types from '../constants/ActionTypes';
import * as Log from "../../libs/Log"

const initialState = {
    name:null,
    uuid:null,
    data:null,
};

export default function (state = initialState, action) {
    const {payload = {}, meta = {}, error} = action;
    const {sequence = {}} = meta;


    if (sequence.type === 'start' || error) {
        return state;
    }

    switch (action.type) {
        case types.SET_ALIAS:
            return {
                ...state,
                ...payload,
            };
        case types.SET_ALIAS_DATA:
            return {
                ...state,
                ...payload,
            };
        case types.GET_ALIAS_FROM_STORAGE:
            return Object.assign({}, state, {...payload});
        default :
            return state;
    }
}