import { isFSA, createAction } from 'flux-standard-action';
import * as storageService from '../../services/storage';
import * as Log from "../../libs/Log"

export default ({ dispatch, getState }) => next => action => {
    if (!isFSA(action)) {
        return next(action);
    }

    //Log.log("sync middleware");

    const { meta={}, error, payload } = action;
    const { sync, sequence={},} = meta;


    if (meta.syncStatus) {
        let state = getState();
        switch (payload) {
            default:
                if (payload == null) {
                    break;
                }
                // Parse payload path
                // for example contact.contacts
                // data is stored at state['contact']['contacts']
                var value = state[payload];
                if (value) {
                    storageService.setItem(payload, value);
                } else {
                    Log.log("data is null or undefined, syn to storage fail")
                }
        }
    }


    if (!sync || sequence.type == 'start' || error || (payload && payload.next === "function")) {
        return next(action);
    }


    next(action);


    dispatch({
        type: 'SYNC_REDUCER_TO_ASYNC_STORAGE',
        payload: sync,
        meta: {
            syncStatus: true
        }
    });
}
