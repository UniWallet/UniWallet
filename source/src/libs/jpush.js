import {Platform} from "react-native";
import JPushModule from 'jpush-react-native';

import * as Log from "./Log"
import * as messageConst from '../redux/constants/Message';

class JPush {
    constructor() {
        if (this.initialized) {
            Log.log("Has initialized already")
            return;
        }
        this.initialized = true;
        Log.log("JPush init");
        JPushModule.initPush();
        if (Platform.OS === 'android') {
            //Only android needs this
            JPushModule.notifyJSDidLoad((resultCode) => {
                // do something
                Log.log("notifyJSDidLoad, code:" + resultCode)
            });
        }
        JPushModule.addReceiveCustomMsgListener((msg) => {
            Log.log("recieved message");
            Log.log(msg);
            // { extras: '{"hash":"0xfcfae99efb1381c97c15777bef5cf7a87089fc1cc106e2f1be89e3d3eb34b026","number":121}',
            //     message: 'newblock/newtransaction/confirmtransaction',
            //     id: 0 }
            //TODO:Do more things
            this._handMessage(msg);
        });
        JPushModule.addReceiveNotificationListener((msg) => {
            Log.log("recieved notification");
            Log.log(msg)
            //this._handMessage(msg);
        })

        JPushModule.addReceiveOpenNotificationListener((msg) => {
            Log.log("Opening notification!");
            Log.log("msg:");
            Log.log(msg);
            this._handNotificationOpen(msg)
        })
    }

    _handNotificationOpen(msg) {
        if (!msg || !msg.extras) {
            Log.log("open invalid notification");
            return;
        }
        msg = _getMsgFromNotification(msg.extras);
        if (!msg) {
            Log.log("invalid notification message");
            Log.log(msg);
            return;
        }
        if (this.msgListener) {
            this.msgListener.onMsgNotificationOpen(msg)
        }
    }

    setAlias(alias, callback) {
        Log.log("set alias " + alias);
        JPushModule.setAlias(alias, callback);
    }

    addMsgListener(listener) {
        Log.log("add listener")
        Log.log(listener)
        this.msgListener = listener
    }

    _getJPushMessageType = (type) => {
        if (type == "newtransaction") {
            return messageConst.TYPE_NEWTRANSACTION;
        } else if (type == "confirmtransaction") {
            return messageConst.TYPE_CONFIRMTRANSACTION;
        } else {
            return messageConst.TYPE_UNKNOWN
        }
    }

    _parseJson(extra) {
        //TODO:Only parse two level extra key
        extra = JSON.parse(extra);
        if (extra && extra.extra) {
            extra.extra = JSON.parse(extra.extra)
        }
        return extra;
    }

    _parseMessage(msg) {
        if (!msg || !msg.extras) {
            return null;
        }
        extras = this._parseJson(msg.extras);
        if (!extras || !extras.msgType) {
            Log.log("Invalid jpush message");
            return null;
        }
        msgType = extras.msgType;
        delete extras.msgType;
        newMsg = {
            type: this._getJPushMessageType(msgType),
            from: messageConst.FROM_JPUSH_REMOTE,
            data: extras,
        }
        return newMsg;
    }

    _handMessage(msg) {
        newMsg = this._parseMessage(msg)
        if (!newMsg) {
            Log.log('Invalid message')
            return;
        }
        if (this.msgListener) {
            this.msgListener.onRecieveMsg(newMsg)
        }
    }
}

function _generateNotificationExtraForMessage(msg) {
    //value in extra of Jpush Notification can only be string
    extra = {}
    for (var key in msg) {
        extra[key] = JSON.stringify(msg[key]);
    }
    return extra;
}

function _getMsgFromNotification(extra) {
    extra = JSON.parse(extra)
    msg = {}
    for (var key in extra) {
        msg[key] = JSON.parse(extra[key]);
    }
    return msg;
}

export function pushLocalNotification(id, title, content, msg, style=1) {
    /*'buildId': Number     // 设置通知样式，1 为基础样式，2 为自定义样式。自定义样式需要先调用 setStyleCustom 接口设置自定义样式。(Android Only)
                   *    'id': Number    		// 通知的 id, 可用于取消通知
                   *    'title': String 		// 通知标题
                   *    'content': String  	// 通知内容
                   *	  'extras': Object       // extras 字段
                   *    'fireTime': Number    // 通知触发时间的时间戳（毫秒）
                   * 	  'badge': Number       // 本地推送触发后应用角标的 badge 值  （iOS Only）
                   *    'soundName': String   // 指定推送的音频文件 （iOS Only）
                   *    'subtitle': String    // 子标题 （iOS10+ Only）*/
    Log.log("send local notification title:" + title + " content:" + content);
    extra = _generateNotificationExtraForMessage(msg)
    Log.log(extra);
    notification = {
        buildId:style,
        id:id,
        title:title,
        content:content,
        extra,
    }
    JPushModule.sendLocalNotification(notification);
}

var mInstance = null;
export const getInstance = () => {
    if (mInstance == null) {
        mInstance = new JPush();
    }
    return mInstance;
}
