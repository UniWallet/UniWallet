import * as types from '../constants/ActionTypes';
import * as Log from "../../libs/Log"

const defaultUnlock = {
    show: false,
    resolved: null,
    rejected: null,
    showSwitch: true,
};

const initialState = {
    toast: {
        text: null,
        timeout: 2000,
        id: null
    },
    serviceCalls:{},
    unlock: defaultUnlock,
    global:{},
};

var serviceId = 0;

export default function (state = initialState, action) {
    const { payload ={} } = action;
    switch (action.type) {
        case types.CALL_SERVICE:
            //TODO:store call_service log
            return state;
        case types.UPDATE_GLOBAL_OBJECT:
            return {
                ...state,
                global: {
                    ...state.global,
                    ...payload
                }
            };
        case types.TOAST:
            return {
                ...state,
                toast: {
                    ...state.toast,
                    ...payload
                }
            };
        case types.TOAST:
            return {
                ...state,
                toast: {
                    ...state.toast,
                    ...payload
                }
            };
        case types.SHOW_LOADING:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    ...payload,
                    show: true,
                }
            };
        case types.HIDE_LOADING:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    ...payload,
                    show: false,
                }
            };
        case types.OPEN_UNLOCK:
            return {
                ...state,
                unlock: {
                    ...state.unlock,
                    ...payload,
                    show: true
                }
            };
        case types.CLOSE_UNLOCK:
            return {
                ...state,
                unlock: defaultUnlock
            };
        default :
            return state;
    }
}
