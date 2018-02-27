import Platform from 'react';
import React, {Component} from 'react';
import {Dimensions, Image, StatusBar, StyleSheet, View} from 'react-native';

import {
    Button,
    CheckBox,
    Container,
    Content,
    Header,
    Title,
    ListItem,
    Text,
    Icon,
    Separator,
    Left,
    H3,
    Right,
    Body,
    Form, Item, Input,
    Switch} from 'native-base';

import getString from "../../translations";
import MyHeader from "../common/MyHeader";

import Global from "../common/Global";
import * as Log from "../../libs/Log"
import * as utils from "../../libs/utils"

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

import SplashScreen from 'react-native-splash-screen'
import I18n, { getLanguages } from 'react-native-i18n';
import RNRestart from 'react-native-restart';
import {Alert} from 'react-native';

/*
    Two basic information should be synced before any furthur processing:
    1) token list 2) exchange info.
    Old information can be continued to use. It's better to sync with the latest one.

    **** if those information are not collected completely, show dialog and stop ****

    The whole logic can be expressed as following:

    promise.race - 1) timeout (initialize timeout)
                   2) initialization - 1) init_token_list -> a. storage b. network
                                       2) init_exchange -> a. storage b. network
                                       3) init_wallet  -> a. storage only
                                       4) init_setting -> a. storage only
                                       b) init global -> a. storage only
 */
export default class Splash extends Component {
    componentDidMount() {
        const {actions} = this.props;
        let props = this.props;

        let INIT_TIMEOUT_PERIOD = 5000; //5 seconds timeout

        function init_promises() {
            return new Promise(function(resolve, reject) {
                let tokenListFromStorage = false;
                let tokenListFromNetwork = false;
                let exchangeFromStorage = false;
                let exchangeFromNetwork = false;
                var hasWallet = false;
                var hasWalletTokens = false;
                let messageLoaded = false;
                let settingLoaded = false;

                function checkTokenListFromStorage() {
                    Log.log("check token list from storage ...");
                    return new Promise(function(resolve, reject) {
                        actions.getTokenListFromStorage({
                            resolved: (result) => {
                                Log.log("token list is loaded: " + JSON.stringify(result));
                                /* double check the token list is empty or not */
                                let token_len = 0;
                                if (result && result.tokens) {
                                    for (token in result.tokens) {
                                        token_len ++;
                                    }
                                }
                                if (token_len > 0) {
                                    tokenListFromStorage = true;
                                } else {
                                    tokenListFromStorage = false;
                                }
                                resolve(result);
                            },
                            rejected: (error) => {
                                Log.log("token list is error: " + error);
                                tokenListFromStorage = false;
                                resolve(error);
                            }
                        });
                    });
                }

                function checkTokenListFromNetwork() {
                    Log.log("check token list from network ...");
                    return new Promise(function(resolve, reject) {
                        actions.syncTokenInfo({
                            resolved: (result) => {
                                Log.log("token list is updated: " + JSON.stringify(result));
                                tokenListFromNetwork = true;
                                resolve(result);
                            },
                            rejected: (error) => {
                                Log.log("token list is NOT updated: " + error + " token from storage: " + tokenListFromStorage);
                                tokenListFromNetwork = false;
                                if (tokenListFromStorage) {
                                    resolve(error);
                                } else {
                                    reject(error);
                                }
                            }
                        });
                    });
                }

                function checkExchangeFromStorage() {
                    Log.log("check exchange from storage ...");
                    return new Promise(function(resolve, reject) {
                        actions.getExchangeRateFromStorage({
                            resolved: (result) => {
                                Log.log("exchange list is loaded: " + JSON.stringify(result));
                                exchangeFromStorage = true;
                                utils.updateExchangeRate();
                                resolve(result);
                            },
                            rejected: (error) => {
                                Log.log("exchange list is NOT loaded");
                                exchangeFromStorage = false;
                                resolve(error);
                            }
                        });
                    });
                }

                function checkExchangeFromNetwork() {
                    Log.log("check exchange from network ...");
                    return new Promise(function(resolve, reject) {
                        actions.syncExchangeRate({
                            resolved: (result) => {
                                Log.log("exchange list is updated: " + JSON.stringify(result));
                                exchangeFromNetwork = true;
                                utils.updateExchangeRate();
                                resolve(result);
                            },
                            rejected: (error) => {
                                Log.log("exchange list is NOT updated: " + error);
                                exchangeFromNetwork = false;
                                if (exchangeFromStorage) {
                                    resolve(error);
                                } else {
                                    reject(error);
                                }
                            }
                        });
                    });
                }
                
                function loadWallet() {
                    Log.log("load wallet ...");
                    return new Promise(function (resolve, reject) {
                        if (!props.wallet|| !props.wallet.wallets) {
                            actions.getWalletFromStorage({
                                resolved: (result) => {
                                    Log.log("wallet is loaded: " + JSON.stringify(result));
                                    if (!result || !result.wallets || result.wallets.length == 0) {
                                        Log.log("empty wallet");
                                        hasWallet = false;
                                    } else {
                                        hasWallet = true;
                                        actions.startUpdate();
                                        //update transactions
                                        actions.getTransactionFromStorage();
                                        //update tokens
                                        let current_address = result.cur_wallet.address;
                                        actions.syncTokens({
                                            address: current_address,
                                            resolved: (result) => {
                                                Log.log("wallet tokens is loaded: " + JSON.stringify(result));
                                                hasWalletTokns = true;
                                                resolve();
                                                /* update tokens' balance */
                                                if (result && result.address && result.tokens) {
                                                    let length = result.tokens.length;
                                                    for (i=0; i<length; i++) {
                                                        Log.log("update token balance of: " + result.tokens[i])
                                                        actions.getTokenBalance({address:current_address, token_address:result.tokens[i]});
                                                    }
                                                }
                                            },
                                            rejected: (error) => {
                                                Log.log("load wallet tokens fail: " + error);
                                                hasWalletTokns = false;
                                                resolve();
                                            }
                                        });
                                    }
                                    resolve();
                                },
                                rejected: (error) => {
                                    Log.log("load wallet fail: " + error);
                                    hasWallet = false;
                                    resolve();
                                }
                            });
                        } else {
                            Log.log("wallets is loaded: " + JSON.stringify(props.wallet));
                            hasWallet = true;
                            resolve();
                        }
                        actions.updateGlobalObject({
                            navigation: props.navigation,
                        })
                    });
                }

                // function loadMessage() {
                //     Log.log("load message ...");
                //     return new Promise(function(resolve, reject) {
                //         if (!props.message || !props.message.messages) {
                //             actions.getMessageFromStorage({
                //                 resolved: (result) => {
                //                     Log.log("load message success: " + JSON.stringify(result));
                //                     messageLoaded = true;
                //                     Message.getManager().onMessageLoaded(actions);
                //                     resolve();
                //                 },
                //                 rejected: (error) => {
                //                     Log.log("load message fail: " + error);
                //                     messageLoaded = false;
                //                     resolve();
                //                 }
                //             });
                //         } else {
                //             Log.log("message loaded: " + JSON.stringify(props.message));
                //             Message.getManager().onMessageLoaded(actions);
                //             messageLoaded = true;
                //             resolve();
                //         }
                //     });
                // }

                //TODO:Empty data from storage will throw a exception, so rejected will be called.
                //Change action to return empty data, and check empty in resolve function?
                //Some other actions also has similar policy.
                function loadSetting() {
                    Log.log("load setting ...");
                    return new Promise(function(resolve, reject) {
                        if (!props.setting) {
                            actions.getSettingFromStorage({
                                resolved: (result) => {
                                    Log.log("load setting success: " + JSON.stringify(result));
                                    loadSetting = true;
                                    utils.updateCurrentExchange();
                                    resolve();
                                },
                                rejected: (error) => {
                                    Log.log("load setting fail: " + error);
                                    loadSetting = false;
                                    resolve();
                                }
                            });
                        } else {
                            Log.log("setting loaded: " + JSON.stringify(props.setting));
                            loadSetting = true;
                            resolve();
                        }
                    });
                }

                checkTokenListFromStorage().then(function (result) {
                    return checkTokenListFromNetwork();})
                  .then(function (result) {
                      return checkTokenListFromStorage();})
                  .then(function (result) {
                      return checkExchangeFromStorage();})
                  .then(function (result) {
                      return checkExchangeFromNetwork();})
                  .then(function (result) {
                      return loadWallet();})
                  // .then(function (result) {
                  //     return loadMessage();})
                  .then(function (result) {
                      return loadSetting();})
                  .then(function (result) {
                      resolve({
                          hasWallet:hasWallet
                      }); })
                  .catch(function(error) {
                      if (hasWallet) {
                          Log.log("continue, even with error: " + error);
                          resolve({
                              hasWallet:hasWallet
                          });
                      } else {
                          reject(new Error("init fail"));
                      }
                  });
            });
        }

        Log.log("====== start loading ======");
        function init_timeout_promise() {
            return new Promise(function (resolve, reject) {
                setTimeout(reject, INIT_TIMEOUT_PERIOD, "init timeout")
            })
        }

        let splash_comp = this;
        let checking_promises = [init_promises()];
        if (!__DEV__) {
            checking_promises = [init_promises(), init_timeout_promise()];
        }

        Promise.race(checking_promises)
        .then(function (result) {
            Log.log("init result: " + JSON.stringify(result));
            if (result.hasWallet) {
                Global.resetToPage(splash_comp, "Drawer");
            } else {
                Global.resetToPage(splash_comp, "Main");
            }
            SplashScreen.hide();
        }).catch(function(error){
            Log.log("error: " + error);
            Alert.alert(
              getString('network_error'),
              getString('network_fail_warning'),
              [{
                  text: getString("button_restart"),
                  onPress: () => {
                      RNRestart.Restart();
                  }
              }]
            );
        });
    }

    render() {
        return null;
    }
}

export const WrappedComponent = Splash;

export function mapStateToProps(state) {
    return {
        wallet: state.wallet,
    };
}
