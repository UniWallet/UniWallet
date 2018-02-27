import { createAction } from 'redux-actions';
import * as types from '../constants/ActionTypes';
import * as storage from '../../services/storage';

export const getMessageFromStorage = createAction(types.GET_MESSAGE_FROM_STORAGE, async()=> {
    return storage.getItem('message')
        .then((result)=> {
            if (!result) {
                console.debug('no message data')
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

export const addMessage = createAction(types.ADD_MESSAGE, async({msg})=> {
    return {...msg};
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        resolved,
        rejected,
        sync:"message"
    }
});

export const removeMessage = createAction(types.REMOVE_MESSAGE, async({id})=> {
    return {id};
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        resolved,
        rejected,
        sync:"message"
    }
});

export const changeMessageStatus = createAction(types.CHANGE_MESSAGE_STATUS, async(id, status)=> {
    return {id, status};
}, ()=> {
    return {
        sync:"message"
    }
});