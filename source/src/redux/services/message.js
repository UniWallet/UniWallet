import getString from "../../translations";
import * as Log from "../../libs/Log";
import * as messageConst from '../constants/Message';
import * as etherutils from '../../libs/etherutils';
import * as utils from '../../libs/utils';
import {Error, errors} from '../../libs/Error';
import {safeCall} from '../../libs/utils';
import * as Message from '../../libs/message';
var NativeAPI = require('react-native').NativeModules.YiYaNativeAPI;

function _getMessageById(messages, id) {
    for (let item of messages) {
        if (item && item.id == id) {
            return item;
        }
    }
    return null;
}


/*State machine of Message
   1)               -> notification (add message)
                    -> clicked (click message in message page and not show detail)
      Pending
                    -> reviewed (click message in message page and show detail)

   2) notification  -> clicked　(click message notification and not show detail)


   3)clicked        ->  (todo status transfer)
                       reviewed
     notification   ->  (click message notification and show detail)
*/
export const processNewMessage = (args) => {
    const {dispatch, state, actions, meta} = args;
    const {resolved, rejected, loading} = meta;
    const {message} = state;
    if (!message) {
        Log.log("empty message")
        return;
    }
    const {idCount, messages} = message;
    var newMessage = _getMessageById(messages, idCount);
    Log.log("process new message")
    Log.log(newMessage)
    if (newMessage == null || newMessage.status != messageConst.STATUS_PENDING) {
        Log.log("No newest message or done, skip process");
        return;
    }

    /* report new transaction*/
    if (newMessage.type === messageConst.TYPE_NEWTRANSACTION) {
        let transaction = newMessage.data;
        if (transaction) {

            let isToken = false;
            if (transaction.extra && transaction.extra.method && transaction.extra.method === "transfer") {
                isToken = true;
            }

            let tokenName = "ETH";
            let token = utils.getTokenUnitFromAddress(transaction.to);
            if (token) {
                tokenName = token.symbol;
            }
            NativeAPI.reportReceiveCoin(''+transaction.from, (isToken)? ''+transaction.extra._to:''+transaction.to, ''+transaction.value, tokenName);
        }
    }

    const {data, id, type, from} = newMessage;
    if (!data) {
        return;
    }
    if (Message.getManager().pushNotification(newMessage)) {
        Log.log("push notification")
    } else {
        Log.log("not push notification")
    }
}

export const openMessage = (args) => {
    const {dispatch, state, actions, data, meta} = args;
    const {resolved, rejected} = meta;
    const {message} = state;
    if (!message) {
        Log.log("empty message")
        safeCall(rejected, new Error(errors.open_message, getString("error_open_message_data")));
        return;
    }
    if (!data || !data.id) {
        Log.log("no message id");
        safeCall(rejected, new Error(errors.open_message, getString("error_open_message_data")));
        return;
    }
    const {messages} = message;
    try {
        const {id} = data;
        let navigation = data.navigation;
        if (!navigation) {
            navigation = state.utils.global ? state.utils.global.navigation : null;
        }
        var targetMessage = _getMessageById(messages, id);
        if (targetMessage.status == messageConst.STATUS_READ) {
            Log.log("message is alread read")
        }
        if (targetMessage.type == messageConst.TYPE_CONFIRMTRANSACTION || targetMessage.type == messageConst.TYPE_NEWTRANSACTION) {
            if (navigation) {
                navigation.navigate("TransactDetails", {...targetMessage.data})
                dispatch(actions.changeMessageStatus(id, messageConst.STATUS_VIEWED));
                safeCall(resolved, {id})
            } else {
                Log.log("no navigation, skip open notification");
                dispatch(actions.changeMessageStatus(id, messageConst.STATUS_CLICKED));
                safeCall(rejected, new Error(errors.open_message, getString("error_open_message_navigation")));
            }
        }else if(targetMessage.type == TYPE_NEWS||targetMessage.type == TYPE_SYSTEM){
            if (navigation) {
                navigation.navigate("SimpleBrowser", {
                    url: targetMessage.url,
                    title: getString("message_details"),
                    refresh: false,
                    share: false,
                })
                dispatch(actions.changeMessageStatus(id, messageConst.STATUS_VIEWED));
                safeCall(resolved, {id})
            } else {
                Log.log("no navigation, skip open notification");
                dispatch(actions.changeMessageStatus(id, messageConst.STATUS_CLICKED));
                safeCall(rejected, new Error(errors.open_message, getString("error_open_message_navigation")));
            }
        }else {
            Log.log("type:" + targetMessage.type + " is special, no tool to show this message");
            dispatch(actions.changeMessageStatus(id, messageConst.STATUS_CLICKED));
            safeCall(rejected, new Error(errors.open_message, getString("error_open_message_tool")));
        }
    } catch(error) {
        safeCall(rejected, new Error(errors.open_message, getString("error_open_message")));
    }
}
