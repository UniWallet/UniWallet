import * as types from '../constants/ActionTypes';


const initialState = {
    createWalletPending: false,
    getEncryptWalletError: false
};


export default function (state = initialState, action) {
    const { meta={}, error } = action;
    const { sequence={} } = meta;
    const status = sequence.type;


    switch (action.type) {
        case types.CREATE_WALLET:
            return {
                ...state,
                createWalletPending: status === 'start'
            };
        case types.GET_WALLET_FROM_STORAGE:
            return {
                ...state,
                getEncryptWalletError: error
            };
        default:
            return state;
    }
}
