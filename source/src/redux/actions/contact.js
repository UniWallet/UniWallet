import * as types from '../constants/ActionTypes';
import {createAction} from 'redux-actions';
import * as transactionService from '../../services/transaction';
import * as storageService from '../../services/storage';
import * as storage from '../../services/storage';


export const getContactFromStorage = createAction(types.GET_CONTACT_FROM_STORAGE, async()=> {
    return storage.getItem('contact')
        .then((contacts)=> {
            if (!contacts) {
                console.debug('no contacts data')
                contacts = {};
            }
            return contacts;
        });
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        resolved,
        rejected
    }
});

export const createContact = createAction(types.CREATE_CONTACT, async ({contact})=> {
    return {...contact};
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        resolved,
        rejected,
        sync: 'contact',
    }
});

export const removeContact = createAction(types.REMOVE_CONTACT, async ({contact})=> {
    return {
        ...contact,
    };
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        resolved,
        rejected,
        sync: 'contact',
    }
});

export const editContact = createAction(types.EDIT_CONTACT, async ({contact, newContact})=> {
    return {
        ...contact, value:newContact,
    };
}, ({resolved, rejected, loading})=> {
    return {
        loading,
        resolved,
        rejected,
        sync: 'contact',
    }
});