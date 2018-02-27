import * as types from '../constants/ActionTypes';
import { View, ListView, StyleSheet, Text } from 'react-native';


const initialState = {
    contacts: null,
    contactId:0,
};


export default function (state = initialState, action) {
    const {payload = {}, meta = {}, error} = action;
    const {sequence = {}} = meta;


    if (sequence.type === 'start' || error) {
        return state;
    }


    switch (action.type) {
        case types.GET_CONTACT_FROM_STORAGE:
            return Object.assign({}, state, {...payload});
        case types.CREATE_CONTACT:
            if (!payload) {
                return state;
            }
            contactId = state.contactId;
            contactId++;
            newContacts = []
            if (state.contacts) {
                newContacts = state.contacts.concat({
                    ...payload, id:contactId,
                })
            } else {
                newContacts = newContacts.concat({
                    ...payload, id:contactId,
                })
            }
            return Object.assign({}, state, { contactId, contacts: newContacts});
        case types.REMOVE_CONTACT:
            if (!payload) {
                return state;
            }
            newContacts = state.contacts.filter((item) => {
                return item.id !== payload.id;
            });
            return Object.assign({}, state, { contacts: newContacts});
        case types.EDIT_CONTACT:
            if (!payload) {
                return state;
            }
            newContacts = state.contacts.map((item) => {
                if (item.id == payload.id) {
                    return payload.value;
                } else {
                    return item
                }
            });
            return Object.assign({}, state, { contacts: newContacts});
        default:
            return state;
    }
}
