import { createAction } from 'redux-actions';
import * as types from '../constants/ActionTypes';


export const toast = createAction(types.TOAST, (text, timeout)=> {
    return {
        text,
        timeout,
        id: new Date().getTime()
    }
});

export const updateGlobalObject = createAction(types.UPDATE_GLOBAL_OBJECT, (args)=> {
    return args;
});


export const openUnlock = createAction(types.OPEN_UNLOCK, ({resolved, rejected, showSwitch=true})=> {
    return {
        resolved,
        rejected,
        showSwitch
    }
});

export const showLoading = createAction(types.SHOW_LOADING, ({title=getString("loading_default_title")})=> {
    return {
        title,
    }
});

export const hideLoading = createAction(types.HIDE_LOADING);


export const closeUnlock = createAction(types.CLOSE_UNLOCK);

export const callService = createAction(types.CALL_SERVICE, (name, data, meta)=> {
        return {
            name,
            data,
            meta,
        };
    },
);
