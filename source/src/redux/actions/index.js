import * as utils from './utils';
import * as wallet from './wallet';
import * as transaction from './transaction';
import * as contact from './contact';
import * as alias from './alias';
import * as setting from './setting';
import * as message from './message';
import * as token from './token';
import * as exchange from './exchange';

export default {
    ...utils,
    ...wallet,
    ...transaction,
    ...contact,
    ...alias,
    ...message,
    ...token,
    ...setting,
    ...exchange,
};


