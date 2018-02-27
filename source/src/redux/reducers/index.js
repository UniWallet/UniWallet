import { combineReducers } from 'redux';
import utils from './utils';
import wallet from './wallet';
import walletUI from './walletUI';
import transaction from './transaction';
import transactionUI from './transactionUI';
import contact from './contact';
import alias from './alias';
import setting from './setting';
import message from './message';
import token from './token';
import exchange from './exchange';

export default combineReducers({
    utils,
    wallet,
    walletUI,
    transaction,
    transactionUI,
    contact,
    alias,
    message,
    token,
    setting,
    exchange,
});
