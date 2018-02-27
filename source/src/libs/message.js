import * as storageService from '../services/storage';
import * as messageConst from '../redux/constants/Message';
import * as Log from "./Log"
import {pushLocalNotification} from "./jpush"
import * as JPush from "./jpush"
import {getTimestamp} from "./utils";
import * as etherutils from "./etherutils"
import getString from "../translations";
import * as Constant from "./constant"
import {formatTransactionBalance} from "../components/common/wallet_utils/wallet_utils";
import * as types from '../redux/constants/ActionTypes';
import * as utils from '../libs/utils'

export const updateMessage = (oldData, payload) => {
    //TODO:Unknown type message should be also added to state?
    if (!oldData.idCount) {
        idCount = 1;
    } else {
        idCount = oldData.idCount + 1;
    }
    newMessages = []
    message = {
        id:idCount,
        timestamp:getTimestamp(),
        status:messageConst.STATUS_PENDING,
        ...payload
    }
    Log.log("add message")
    Log.log(message)
    if (oldData.messages) {
        newMessages = oldData.messages.concat(message)
    } else {
        newMessages = [].concat(message)
    }
    return [Object.assign({}, oldData, {
        idCount:idCount,
        messages: newMessages
    }), message];
}


export const updateMessageStatus = (oldData, payload) => {
    if (!oldData.messages) {
        return oldData
    }
    newMessages = oldData.messages.map((item) => {
        if (item && item.id == payload.id) {
            item.status = payload.status;
            return item;
        } else {
            return item;
        }
    });
    return Object.assign({}, oldData, {
        messages: newMessages
    });
}

/*
   interface IMessageListener{
         function onRecieveMsg(msg);
         function onMsgNotificationOpen(msg);
   }
*/


class MessageManager {
    constructor() {
        Log.log("MessageManager")
        function MessageListener(manager){   //implements People interface
            this.manager = manager;
        }

        MessageListener.prototype.onRecieveMsg = function(msg){
            this.manager.addMessage({
                msg,
            });
        }

        MessageListener.prototype.onMsgNotificationOpen = function(msg){  //实现必要的方法
            this.manager.onNotificationOpen(msg);
        }
        listener = new MessageListener(this)
        JPush.getInstance().addMsgListener(listener);
    }

    async _addMessageInBg(msg) {
        if (!msg) {
            Log.log("add message error, null msg")
            return;
        }
        data = await storageService.getItem("message")
        if (!data) {
            data = {}
        }
        [newData, msg] = updateMessage(data, msg)
        await storageService.setItem("message", newData)
        this.pushNotification(msg)
        return await this._changeMessageStatusInBg(msg, messageConst.STATUS_NOTIFICATION);
    }

    async _changeMessageStatusInBg(msg, status) {
        if (!msg || !status) {
            return;
        }
        data = await storageService.getItem("message")
        if (!data) {
            return;
        }
        newData = updateMessageStatus(data, {id: msg.id, status})

        await storageService.setItem("message", newData)
        return msg;
    }

    _handlePendingOpenedMsg() {
        if (this.actions && this.pendingOpenedMsg) {
            tmp = this.pendingOpenedMsg
            this.pendingOpenedMsg = null;
            Log.log("Open pending opened msg")
            Log.log(tmp)
            this.onNotificationOpen(tmp);
        }
    }

    onMessageLoaded(actions) {
        this.actions = actions;
        this._handlePendingOpenedMsg();
    }

    addMessage({msg, resolved, rejected}) {
        if(utils.isSupport(msg)){
            if (this.actions) {
                this.actions.addMessage({
                    msg:msg,
                    resolved,
                    rejected,
                })
            } else {
                this._addMessageInBg(msg).then(
                    resolved,
                    rejected,
                )
            }

            /*
                if message is tranaction, check token should be added or not
             */
            if (msg.type == messageConst.TYPE_NEWTRANSACTION) {
                let transaction = msg.data;
                if (transaction && transaction.to) {
                    let tokenInfo = utils.getTokenUnitFromAddress(transaction.to)
                    if (utils.isTokenInfo(tokenInfo)) {
                        utils.pushPendingAction(this.actions, types.PENDING_TOKEN_ADD, {address: transaction.extra.to, token_address: transaction.to});
                    }
                }
            }
        }
    }

    pushNotification(msg) {
        if (!msg || !msg.data) {
            Log.log("Get notification data fail")
            return false;
        }
        if (msg.from !== messageConst.FROM_JPUSH_REMOTE) {
            Log.log("message from is invalid for push notification")
            return false;
        }
        type = msg.type;
        let value = formatTransactionBalance(msg.data, 4)
        let status =  "" + msg.data.status;
        if (type == messageConst.TYPE_NEWTRANSACTION) {
            if (status === '0') {
                content = "" + value + " " + msg.data.unit;
                pushLocalNotification(msg.id, getString('message_type_newtransaction_fail'), content, {id: msg.id})
            } else {
                content = "" + value + " " + msg.data.unit + " " + getString('notification_content_newtransaction');
                pushLocalNotification(msg.id, getString('message_type_newtransaction'), content, {id: msg.id})
            }
            return true;
        } else if (type == messageConst.TYPE_CONFIRMTRANSACTION) {
            if (status === '0') {
                content = "" + value + " " + msg.data.unit;
                pushLocalNotification(msg.id, getString('message_type_confirmtransaction_fail'), content, {id: msg.id})
            } else {
                content = "" + value + " " + msg.data.unit + " " + getString('notification_content_confirmtransaction');
                pushLocalNotification(msg.id, getString('message_type_confirmtransaction'), content, {id: msg.id})
            }
            return true;
        }
        return false;
    }

    onNotificationOpen(msg) {
        if (!msg) {
            Log.log("invalid notification message");
            Log.log(msg);
            return;
        }
        if (!this.actions) {
            this.pendingOpenedMsg = msg;
            Log.log("Wait ui");
            return;
        }
        try {
            this.actions.callService("openMessage", {
                    ...msg,
                }, {
                    resolved: (result) => {
                        Log.log("open message ok from notification");
                    },
                    rejected: (error) => {
                        Log.log("open message error" + error);
                    }
                }
            )
        } catch (error) {
            Log.log("parse message error in open");
            Log.log(msg);
            return;
        }
    }
}

var mInstance = null;
export const getManager = () => {
    if (mInstance == null) {
        mInstance = new MessageManager();
    }
    return mInstance;
}
