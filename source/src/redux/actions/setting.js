import { createAction } from 'redux-actions';
import * as types from '../constants/ActionTypes';
import * as storage from '../../services/storage';

export const getSettingFromStorage = createAction(types.GET_SETTING_FROM_STORAGE, async()=> {
    return storage.getItem('setting')
        .then((data)=> {
            if (!data) {
                console.debug('no setting data')
                throw new Error("no setting data");
            }
            return {...data, loaddedFromStorage:true};
        });
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        resolved,
        rejected
    }
});

export const updateSetting = createAction(types.UPDATE_SETTING, async(data)=> {
    return data;
}, ({resolved, rejected})=> {
    return {
        sync:"setting",
        resolved,
        rejected
    }
});