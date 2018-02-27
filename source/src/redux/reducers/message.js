import * as types from '../constants/ActionTypes';
import * as messageConst from '../constants/Message';
import * as Log from "../../libs/Log"
import {getTimestamp} from "../../libs/utils";
import {updateMessage, updateMessageStatus} from "../../libs/message";

const initialState = {
    idCount: 0,
    messages:null,
};


export default function (state = initialState, action) {
    const {payload = {}, meta = {}, error} = action;
    const {sequence = {}} = meta;

    if (sequence.type === 'start' || error) {
        return state;
    }

    switch (action.type) {
        case types.GET_MESSAGE_FROM_STORAGE:
            return Object.assign({}, state, {...payload});
        case types.ADD_MESSAGE:
            const [newState, _] = updateMessage(state, payload)
            if (!newState) {
                return state;
            } else {
                return newState;
            }
        case types.REMOVE_MESSAGE:
            if (!payload) {
                return state;
            }
            newMessages = state.messages.filter((item) => {
                return item.id !== payload.id;
            });
            return Object.assign({}, state, { messages: newMessages});
        case types.CHANGE_MESSAGE_STATUS:
            if (!payload) {
                return state;
            }
            return updateMessageStatus(state, payload);
        default:
            return state;
    }
}
