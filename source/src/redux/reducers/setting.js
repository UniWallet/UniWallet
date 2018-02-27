import * as types from '../constants/ActionTypes';
import * as Log from "../../libs/Log"

const initialState = {
};

export default function (state = initialState, action) {
    const {payload = {}, meta = {}, error} = action;
    const {sequence = {}} = meta;

    if (sequence.type === 'start' || error) {
        return state;
    }

    switch (action.type) {
        case types.UPDATE_SETTING:
            Log.log("reducer setting")
            Log.log(payload)
            return {
                ...state,
                ...payload,
            };
        case types.GET_SETTING_FROM_STORAGE:
            return {
                ...state,
                ...payload
            };
        default :
            return state;
    }
}