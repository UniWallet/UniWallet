import getString from "../translations/index";

export const errors = {
    wrong_password : 1,
    send_transaction : 2,
    network : 3,
    open_message:4,
    call_service:5,
    import_wallet_with_same_address: 6,
};

export class Error {
    constructor(code, data) {
        this.code = code;
        this.data = data;
    }

    toString() {
        return getError(this.code);
    }
}

export const getError = (code) => {
    switch(code) {
        case errors.wrong_password:
            return getString("error_wrong_password");
            break;
        case errors.send_transaction:
            return getString("error_send_transaction");
            break;
        case errors.network:
            return getString("error_network");
            break;
        case errors.open_message:
            return getString("error_open_message");
            break;
        case errors.call_service:
            return getString("error_call_service");
            break;
        case errors.import_wallet_with_same_address:
            return getString("error_import_wallet_with_same_address");
        default:
            return getString("error_unknown");
    }
}

export const throwError = (code, data=null) => {
    throw new Error(code, data);
}

export default Error;