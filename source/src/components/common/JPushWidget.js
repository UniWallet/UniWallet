import React, {Component} from 'react';

import * as Log from "../../libs/Log"
import * as utils from "../../libs/utils"
import * as JPush from "../../libs/jpush"
import config from '../../configs';
import * as request from '../../services/request'

var DeviceInfo = require('react-native-device-info');

const ALIAS_UPDATE_TIME = 60*60*24*1;//unix timestamp, 1 days
const SAME_ALIAS_UPDATE_TIME = 60*60*24*10;//unix timestamp, 10 days
const MAX_RETRY_TIMES = 5;
const RETRY_PERIODIC  = 1000*30;//30s

class JPushWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        const {actions} = this.props;
        if (this.state.alias === undefined) {
            this.state.alias = "";
            actions.getAliasFromStorage({
                resolved:(result) => {
                    Log.log("get alias success");
                    Log.log(result);
                    if (!result || !result.name || !result.uuid || result.uuid != this._getUUID()) {
                        Log.log("alias empty");
                        this.state.alias = "";
                        this.state.timestamp = 0;
                        this._registerAlias();
                    } else {
                        this.state.alias = result.name;
                        this.state.uuid = result.uuid;
                        this.state.timestamp = result.timestamp;
                        if ((utils.getTimestamp() - this.state.timestamp) > ALIAS_UPDATE_TIME) {
                            Log.log("alias is expired, register alias again");
                            this._registerAlias();
                        } else {
                            Log.log("alias existed");
                        }
                    }
                },
                rejected:(error) => {
                    Log.log("get alias error");
                    this.state.alias = "";
                    this.state.timestamp = 0;
                    this._registerAlias();
                }
            });
        }
    }

    componentWillUnmount() {
    }

    async _confirmAlias(uuid, alias) {
        try {
            params = {
                uuid:uuid,
                alias: alias,
            }
            let data = await request.get("confirmAlias", params);
            Log.log("confirm alias result");
            Log.log(data);
            this.state.alias = alias;
            this.state.uuid = uuid;
            const timestamp = utils.getTimestamp();
            this.state.timestamp = timestamp;
            const {actions} = this.props;
            actions.setAlias({
                name:alias,
                uuid,
                timestamp,
                resolved:(result) => {
                },
                rejected:(error) => {
                }
            });
        } catch(error) {
            Log.log(error);
        }
    }

    _getUUID() {
        return DeviceInfo.getUniqueID();
    }

    async _registerAlias() {
        Log.log("set alias begin");
        let alias = null;
        const uuid = this._getUUID();
        try {
            params = {
                uuid:uuid,
            }
            let data = await request.get("setAlias", params);
            Log.log(data);
            alias = data.alias;
        } catch (error) {
            Log.log(error);
        }
        if (!alias) {
            Log.log("no given alias, fail")
            return;
        }
        if (alias === this.state.alias && (utils.getTimestamp() - this.state.timestamp) < SAME_ALIAS_UPDATE_TIME) {
            Log.log("same alias");
            return;
        }
        this._setJPushAlias(uuid, alias);
    }

    _setJPushAlias(uuid, alias) {
        JPush.getInstance().setAlias(alias, (map) => {
            if (map.errorCode === 0) {
                Log.log("set alias succeed for " + alias);
                this.retryTimes = 0;
                this._confirmAlias(uuid, alias);
            } else {
                if (!this.retryTimes) {
                    this.retryTimes = 0;
                }
                this._retrySetAlias(uuid, alias);
                Log.log("set alias failed, times: " + this.retryTimes);
                Log.log(map);
            }
        });
    }

    _retrySetAlias(uuid, alias) {
        if (this.retryTimes < MAX_RETRY_TIMES) {
            Log.log("retrySetAlias");
            this.retryTimes++
            //retry 10s later
            setTimeout(() => {
                this._setJPushAlias(uuid, alias);
            }, RETRY_PERIODIC);
        }
    }

    render() {
        return null;
    }
}

export const WrappedComponent = JPushWidget;

export function mapStateToProps(state) {
    return {
        wallet: state.wallet,
        alias: state.alias,
    }
}