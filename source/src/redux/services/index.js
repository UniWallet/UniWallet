import * as wallet from './wallet';
import * as alias from './alias';
import * as message from './message';
import * as utils from './utils';

export default {
    ...wallet,
    ...alias,
    ...message,
    ...utils,
};