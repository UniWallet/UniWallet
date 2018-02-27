import React, {Component} from "react";
import {StatusBar, ScrollView, StyleSheet, View} from 'react-native';
import {
    Container,
    Header,
    Title,
    Button,
    Tabs,
    Icon,
    Tab,
    Right,
    Left,
    Body,
    ScrollableTab,
    Text,
    TabHeading
} from "native-base";

import TabOne from "./tabOne";
import TabTwo from "./tabTwo";
import TabThree from "./tabThree";
import TabFour from "./tabFour";
import MyHeader from "../common/MyHeader"
import Global from "../common/Global"
import ScrollableTabView from 'react-native-scrollable-tab-view'
import getString from "../../translations/index";
import * as Log from "../../libs/Log"
var NativeAPI = require('react-native').NativeModules.YiYaNativeAPI;
import * as importTypes from '../../redux/constants/WalletImportType';
import {getTimestampInMilliSecond} from "../../libs/utils";

const chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const MAX_TRY_TIMES = 10;
const WALLET_NAME_SUFIX_LEN = 4;

class Import extends Component {


    constructor(props) {
        super(props);
        this.state = {tabOneData: "",tabTwoData:""}
        currentPage = 0;
    }

    _generateMixed(n) {
        var res = "";
        for(var i = 0; i < n ; i ++) {
            var id = Math.ceil(Math.random()*35);
            res += chars[id];
        }
        return res;
    }


    _onCommit(data) {
        const {actions} = this.props;
        var name = null;
        for (var i=0; i<MAX_TRY_TIMES; i++) {
            var name = getString("wallet_name_prefix") + this._generateMixed(WALLET_NAME_SUFIX_LEN);
            if (!this.props.wallet || !this.props.wallet.wallets) {
                break;
            }

            var found = false;
            for (wallet in this.props.wallet.wallets) {
                wallet_info = this.props.wallet.wallets[wallet];
                if (wallet_info == name) {
                    found = true;
                    break;
                }
            }
            if (found) {
                name = null;
                continue;
            } else {
                break;
            }
        }
        if (name == null) {
            actions.toast(getString("wallet_generate_name_error"))
            return;
        }

        let start = getTimestampInMilliSecond();
        let action_type = 1;
        if (data.type === importTypes.IMPORT_KEY_STORE) {
            action_type = 1;
        }
        if (data.type === importTypes.IMPORT_PRIVATE_KEY) {
            action_type = 3;
        }
        actions.importWallet({
            loading:getString("wallet_import_loading"),
            input: data.input,
            pwd: data.pwd,
            name:name,
            type: data.type,
            resolved: (result) => {
                actions.toast(getString("import_wallet_ok"));
                //update the tokens
                let current_address = result.address;
                actions.syncTokens({
                    address: current_address,
                    resolved: (result) => {
                        Log.log("wallet tokens is loaded: " + JSON.stringify(result));
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
                    }
                });

                const {params} = this.props.navigation.state;
                // this.props.navigation.navigate('Contact', {update:true})
                if (params && params.routeName) {
                    Global.resetToPage(this, params.routeName);
                } else {
                    this.props.navigation.goBack();
                }
                NativeAPI.reportImportWallet(((getTimestampInMilliSecond()-start)/1000).toString(), ''+action_type, "", ''+1, result.address);
            },
            rejected: (error) => {
                Log.log(error);
                actions.toast(error);
                NativeAPI.reportImportWallet(((getTimestampInMilliSecond()-start)/1000).toString(), ''+action_type, "", ''+2, "");
            }
        });
    }

    _handleScanResult(code, result) {
        if (result && result.data) {
            if(currentPage==0){
                this.setState({tabOneData: result.data})
            }else {
                this.setState({tabTwoData: result.data})

            }
        }
    }

    _jumpToUrl(title, url) {
        this.props.navigation.navigate('SimpleBrowser', {
            url: url, title: title,
            refresh: false,
            share: false,
        });
    }

    render() {

        return (
            <Container>
                <MyHeader rightImageName="scan"
                          titleName={getString("import_wallet")}
                          rightOnPress={() => this.props.navigation.navigate('QRReader', {callback: this._handleScanResult.bind(this)})}
                          {...this.props}
                />
                {/*<ScrollableTabView*/}
                {/*removeClippedSubviews={false}*/}
                {/*style={{backgroundColor: '#FFFFFF', paddingTop: 5}} {...tabProps}*/}
                {/*onChangeTab={(obj) => {*/}
                {/*console.log('current index ： ' + obj.i)*/}
                {/*// this.setState({currentPage:(1-obj.i)})*/}
                {/*this.setState({currentPage: obj.i})*/}
                {/*currentPage = obj.i;*/}
                {/*console.log('currentPage index ： ' + currentPage)*/}
                {/*}}>*/}
                {/*<ScrollView tabLabel={getString("official_wallet")}>*/}
                {/*<TabOne*/}
                {/*scanData={ currentPage == 0 ? this.state.scanData : ""}*/}
                {/*onCommit={this._onCommit.bind(this)}*/}
                {/*jumpToUrl={(title, url) => this._jumpToUrl(title, url)}/>*/}
                {/*</ScrollView>*/}
                {/*/!*<ScrollView tabLabel={getString("mnemonic_word")}>*!/*/}
                {/*/!*<TabTwo onCommit={this._onCommit.bind(this)}/>*!/*/}
                {/*/!*</ScrollView>*!/*/}
                {/*<ScrollView tabLabel={getString("private_key")}>*/}
                {/*<TabThree*/}
                {/*scanData={ currentPage == 1 ? this.state.scanData : ""}*/}
                {/*onCommit={this._onCommit.bind(this)}*/}
                {/*jumpToUrl={(title, url) => this._jumpToUrl(title, url)}/>*/}
                {/*</ScrollView>*/}
                {/*</ScrollableTabView>*/}
                <Tabs contentProps={{keyboardShouldPersistTaps:"always"}} tabBarUnderlineStyle={tabBarUnderlineStyle}
                      onChangeTab={(obj)=>{
                          Log.log('-----------------current index ： ' + obj.i)
                          // this.setState({currentPage:(1-obj.i)})
                          this.setState({currentPage: obj.i})
                          currentPage = obj.i;
                          Log.log('currentPage index ： ' + currentPage)
                      }}>
                    <Tab heading={getString("official_wallet")} {...tabProps}
                         >
                        <TabOne {...this.props} scanData={this.state.tabOneData}
                                onCommit={this._onCommit.bind(this)}
                                jumpToUrl={(title, url) => this._jumpToUrl(title, url)}/>
                    </Tab>
                    <Tab heading={getString("private_key")} {...tabProps}>
                        <TabThree {...this.props} scanData={this.state.tabTwoData}
                                  onCommit={this._onCommit.bind(this)}
                                  jumpToUrl={(title, url) => this._jumpToUrl(title, url)}/>
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}

// const tabProps = {
//     tabBarUnderlineStyle: {backgroundColor: Global.primaryColor, height: 3},
//     tabBarTextStyle: {fontSize: 15},
//     tabBarActiveTextColor: Global.primaryColor,
//     tabBarInactiveTextColor: Global.primaryContentColor,
// };

const tabBarUnderlineStyle = {
    backgroundColor: Global.primaryColor,
    height: 3,
    borderBottomWidth:0,
}

const tabProps = {
    textStyle:{color:Global.primaryContentColor},
    activeTextStyle:{color:Global.primaryColor},
    activeTabStyle:{backgroundColor:'white'} ,
    tabStyle: {backgroundColor:'white'},
};

export default Import;
export const WrappedComponent = Import;

export function mapStateToProps(state) {
    return {
        wallet: state.wallet,
    };
}