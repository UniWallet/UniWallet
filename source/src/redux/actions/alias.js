import { createAction } from 'redux-actions';
import * as types from '../constants/ActionTypes';
import * as storage from '../../services/storage';

export const getAliasFromStorage = createAction(types.GET_ALIAS_FROM_STORAGE, async()=> {
    return storage.getItem('alias')
        .then((result)=> {
            if (!result) {
                console.debug('no alias data')
                result = {}
            }
            return result;
        });
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        resolved,
        rejected
    }
});

export const setAliasData = createAction(types.SET_ALIAS_DATA, async({data, dataTimestamp})=> {
    return {dataTimestamp, data};
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        resolved,
        rejected,
        sync:"alias"
    }
});

export const setAlias = createAction(types.SET_ALIAS, async({uuid, name, timestamp})=> {
    return {uuid, name, timestamp};
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        resolved,
        rejected,
        sync:"alias"
    }
});