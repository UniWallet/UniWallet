import * as types from '../constants/ActionTypes';
import * as Log from "../../libs/Log"
import apis from "../services/index"
import actions from "../actions/index"
import {Error, errors} from '../../libs/Error';
import getString from "../../translations";
import {safeCall} from '../../libs/utils';
import * as utils from '../../libs/utils';

export default ({dispatch, getState}) => next => action => {
    if (action.type !== types.CALL_SERVICE) {
        next(action);
        return;
    }

    Log.log(action);
    const {payload} = action;
    if (!payload) {
        Log.log("Invalid service call, empty payload");
        safeCall(rejected, new Error(errors.call_service, getString("error_call_service_invalid")));
        return;
    }
    const {name, data, meta={}} = payload;
    if (!name || !apis[name]) {
        Log.log("Invalid service name " + name);
        safeCall(rejected, new Error(errors.call_service, getString("error_call_service_invalid")));
        return;
    }
    const state = {...getState()};
    const {resolved, rejected} = meta;
    try {
        apis[name]({dispatch, state, actions, data, meta});
    } catch(error) {
        Log.log("service call error:" + error);
        safeCall(rejected, new Error(errors.call_service, getString("error_call_service_exception")));
    }
}