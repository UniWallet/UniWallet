import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    StatusBar,
    Image,
    FlatList,
    NativeModules,
    processColor,
    RefreshControl,
    View
} from 'react-native';

import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Footer,
    FooterTab,
    List,
    ListItem,
    Card,
    CardItem,
    Text,
    Fab,
    Body,
    Left,
    Right,
    H3,
    IconNB,
    Icon
} from "native-base";

import  * as MyInfoComponent from "../my/MyInfo";
import connectComponent from '../../redux/utils/connectComponent';

import NHCardList from "./card/card-list";
import NHCardShowcase from "./card/card-showcase";
import BasicFab from "./fab/basic";
const MyInfo = connectComponent(MyInfoComponent);

import styles from "./styles";

import FastImage from 'react-native-fast-image'

const assetsBg = require("./img/asset_bg.png");
const camera_img = require("./img/two_code.png");
const menu_img = require("./img/ic_menu.png");

import getString from "../../translations";
import MyHeader from "../common/MyHeader";

import Global from "../common/Global";
import * as Log from "../../libs/Log"
import * as Message from "../../libs/message"

const cardImage = require("./img/drawer-cover.png");
const status = require("./img/ic_sysbar_menu.png");

import * as WalletUtils from "../common/wallet_utils/wallet_utils"

import * as etherutils from '../../libs/etherutils';
import * as utils from '../../libs/utils';

import * as messageConst from '../../redux/constants/Message';
//import Badge from 'react-native-smart-badge'
import I18n, { getLanguages } from 'react-native-i18n';

var NativeAPI = require('react-native').NativeModules.YiYaNativeAPI;
//import PTRView from 'react-native-pull-to-refresh';

/*
    TODO query new assets from store
 */
const new_assets = []

const last_assets = [
    {
        icon: "add",
        isLast: true
    }
]

const REFRESH_TIMEOUT = 100 //refresh timeout

class MyAssets extends Component {
    _updateNewAssets() {
        var wallet = this.props.wallet.cur_wallet;
        var token_list = this.props.token.tokens;
        var tokens = wallet.tokens;
        var newassets = [];

        let exchange_name = utils.getExchangeFromCurrentLocale();
        let exchange = utils.getExchange(this.props.settings.exchange? this.props.settings.exchange:exchange_name);
        let exchange_rate = 1.0;
        if (exchange && exchange.name != Global.PRICE_CONCURRENCY) {
            exchange_rate = exchange.value;
        }
        Log.log("exchange_rate: " + exchange_rate);
        if (token_list && token_list[Global.ETH_ADDRESS]) {
            newassets = newassets.concat({
                icon: token_list[Global.ETH_ADDRESS].icon,
                name: token_list[Global.ETH_ADDRESS].name,
                symbol: token_list[Global.ETH_ADDRESS].symbol,
                address: token_list[Global.ETH_ADDRESS].address,
                balance: wallet.balance,
                amount: wallet.balance*exchange_rate * token_list[Global.ETH_ADDRESS].price,
            })
        }
        if (tokens) {
            for(token in tokens) {
                var token_info = token_list[token];
                if (! token_info) break;

                if (token_info.address === Global.ETH_ADDRESS) continue;
                if (token_info) {
                    balance = wallet.tokens && wallet.tokens[token_info.address]? wallet.tokens[token_info.address].balance:0;
                    if (!balance) {
                        balance = 0;
                    }
                    newassets = newassets.concat({
                        icon: token_info.icon,
                        address: token_info.address,
                        name: token_info.name,
                        symbol: token_info.symbol,
                        balance: balance,
                        amount: balance*exchange_rate*token_info.price
                    })
                }
            }
        }
        newassets = newassets.concat(last_assets)
        //update assets array
        this.state.data = newassets;

        var amount = 0;
        arrayLength = newassets.length;
        for (var i = 0; i < arrayLength; i++) {
            var wt = newassets[i];
            if (wt.amount) {
                amount += wt.amount;
            }
        }
        //update amount
        this.state.amount = amount;
    }

    componentWillReceiveProps(nextProps) {
        //Log.log("will receive props: " + JSON.stringify(nextProps))
    }

    constructor(props) {
        super(props);
        /*
            TODO add tokens
         */
        this.state = {
            data: null,
            amount: 0,
            refreshing: false
        }

        this._updateNewAssets();
    }

    _onLeftMenuPress() {
        this.props.navigation.navigate("DrawerOpen")
    }

    _onRightMenuPress() {
        this.props.navigation.navigate("Assetsqrcode")
    }

    _updateBalance() {
        const { actions } = this.props;
        actions.callService("updateBalance")
    }

    componentDidMount() {
        const { actions } = this.props;
        var wallet = this.props.wallet.cur_wallet;
        let wallet_count = 0;
        for (wt in this.props.wallet.wallets) {
            wallet_count ++;
        }
        NativeAPI.reportActiveClient(''+wallet_count, wallet? wallet.address: "", ''+1);
        actions.callService("updateBalance")

        if (!this.props.message || !this.props.message.messages) {
            actions.getMessageFromStorage({
                resolved: (result) => {
                    Log.log("load message success: " + JSON.stringify(result));
                    Message.getManager().onMessageLoaded(actions);
                },
                rejected: (error) => {
                    Log.log("load message fail: " + error);
                }
            });
        } else {
            Log.log("message loaded: " + JSON.stringify(this.props.message));
            Message.getManager().onMessageLoaded(actions);
        }
    }

    _handleRefresh () {
        this.setState({ refreshing: true })
        return new Promise((resolve) => {
            Promise.all([
                this._handleRefreshInner(resolve)
            ])
              .then(() => {
                  this._endLoading()
              })
        })
    }

    _endLoading () {
        this.setState({
            refreshing: false
        })
    }

    _onBackupPressed(){
        this.props.navigation.navigate("WalletBackup",{'wallet': this.props.wallet.cur_wallet})
    }

    _handleRefreshInner(resolve) {
        return new Promise((resolve) => {
            //handle refresh
            const { actions } = this.props;
            //get balance of tokens
            var assets_length = this.state.data.length;
            for (i=0; i<assets_length; i++) {
                if (this.state.data[i].address) {
                    actions.getTokenBalance({
                        address: this.props.wallet.cur_wallet.address,
                        token_address: this.state.data[i].address,
                        token_symbol: this.state.data[i].symbol
                    });
                }
            }
            //get balance of eth
            actions.getBalance({
                address:this.props.wallet.cur_wallet.address,
                resolved:(result) => {
                    Log.log("refresh success");
                },
                rejected:(error) => {
                    Log.log("refresh fail");
                    actions.toast(getString("error_refresh"));
                }
            })
            setTimeout(()=>{
                resolve()
            }, REFRESH_TIMEOUT);
        });
    }

    render() {
        const { actions } = this.props;
        var wallet = this.props.wallet.cur_wallet;
        this._updateNewAssets();
        let exchange = utils.getExchange(this.props.settings.exchange);
        let currency_symbol = Global.DEFAULT_CONCURRENCY_SYMBOL
        if (exchange && exchange.symbol) {
            currency_symbol = exchange.symbol;
        }
        return (
            <Container style={styles.container}>
                <View style={styles.content}>
                    <Image source={assetsBg} style={styles.backgroundImage}>
                        <MyHeader
                            iconColor="#FFFFFF"
                            titleColor="#FFFFFF"
                            actionBarBgColor="transparent"
                            leftImageName="asset_menu"
                            rightImageName="asset_qr"
                            titleName={wallet.name}
                            withoutBottom={true}
                            leftOnPress={this._onLeftMenuPress.bind(this)}
                            rightOnPress={this._onRightMenuPress.bind(this)}
                            {...this.props}
                        />
                        <View style={{
                            alignItems: "center",
                            marginBottom: 27,
                            marginTop: 20,
                            backgroundColor: "transparent",
                        }} >
                            <H3 style={styles.textcolor}>{getString("assets_total")} </H3>
                            <H3 style={styles.text}>{currency_symbol} {etherutils.formatBalance(this.state.amount, 2).toString()}</H3>
                            <View  style={{
                                flexDirection: 'row',
                            }}>
                                <Text numberOfLines={1} ellipsizeMode={'middle'} style={styles.textcolor2} onPress={() => this.props.navigation.navigate('Assetsqrcode')}>{etherutils.toChecksumAddress(wallet.address)}</Text>
                            {wallet.isBackup?null:(<Text style={styles.backup_hint} onPress={()=>this._onBackupPressed()}> {getString("backup_hint")} </Text>)}
                            </View>
                        </View>
                        <View style={{flex: 1, paddingTop: 2}}>
                            <FlatList style={{borderRadius:10}}
                                      refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._handleRefresh.bind(this)} progressViewOffset={0}/>}
                                      data={utils.fixFlatListData(this.state.data)}
                                      renderItem={({ item }) => (
                                    <ListItem button style={styles.listitem}
                                              onPress={() => (item.isLast? this.props.navigation.navigate("NewAssets") : this.props.navigation.navigate("Assetscoinaction", {title: item.symbol, amount: item.amount,contract: item.address}))}
                                    >
                                        <Card style={styles.card}>
                                            <CardItem>
                                                <Body>
                                                { item.isLast?
                                                  ( <View style={styles.lastitemhead}>
                                                        <Image source={Global.getImage(item.icon)} style={styles.lastitemicon}/>
                                                    </View>) : (
                                                    <View style={styles.itemhead}>
                                                        <FastImage source={{uri:item.icon}}
                                                               style={styles.itemicon}/>
                                                        <View style={{
                                                            flex: 1,
                                                            flexDirection: "row",
                                                            justifyContent: "flex-start",
                                                            paddingLeft: 10,
                                                            alignItems: "center"
                                                        }}>
                                                            <Text> {item.symbol} </Text>
                                                        </View>
                                                        <View>
                                                            <View style={{
                                                                flex: 1,
                                                                flexDirection: "column",
                                                                justifyContent: "center",
                                                            }}>
                                                                <Text style={{textAlign:"right"}}>{etherutils.formatBalance(item.balance, 4)}</Text>
                                                                <Text
                                                                  style={{color: "#00000060",textAlign:"right"}}>{currency_symbol} {etherutils.formatBalance(item.amount, 2)}</Text>
                                                            </View>
                                                        </View>
                                                    </View> )
                                                }
                                                </Body>
                                            </CardItem>
                                        </Card>
                                    </ListItem>)}
                            />
                        </View>
                    </Image>
                </View>
            </Container>
        );
    }
}


export default class Assets extends Component {

    constructor(props) {
        super(props);
        this.state = { selectedTab: 'myassets' };
    }

    componentDidMount() {
        if (this.props.wallet == null || this.props.wallet.cur_wallet == null) {
            Global.resetToPage(this, "Main");
            return null;
        }
    }

    renderSelectedTab()
    {
        switch (this.state.selectedTab) {
            case 'myassets':
                return (
                    <MyAssets {...this.props}/>);
                break;
            case 'marketing':
                return (<Content>
                    <Text>Marketing</Text>
                </Content>);
                break;
            case 'find':
                const { actions } = this.props;
                actions.toast('Empty page')
                return (<Content>
                    <Text>Found</Text>
                </Content>);
                break;
            case 'me':
                // Must pass this.props here
                // it seems props.navigator doesn't pass to child component
                return (
                    <MyInfo {...this.props}/>
                );
                break;
            default:
        }
    }

    _hasPendingMessage() {
        let count = 0;
        if (!this.props.message || !this.props.message.messages) {
            return count;
        }
        for (item of this.props.message.messages) {
            if (item && item.status != messageConst.STATUS_VIEWED) {
                count++;
            }
        }
        return count;
    }

    render() {
        let pendingCount = this._hasPendingMessage();
        if (this.props.wallet == null || this.props.wallet.cur_wallet == null) {
            return null;
        }
        return (
            <Container style={{flex:1}}>
                {this.renderSelectedTab()}
                <Footer>
                    <FooterTab>
                        <Button borderRadius={0} androidRippleColor='#4acbe1' style={{backgroundColor:'#ffffff'}} active={this.state.selectedTab==='myassets'} onPress={() => this.setState({selectedTab: 'myassets'})}>
                            <Image source={this.state.selectedTab==='myassets'? Global.getImage("nav_assets_cur") : Global.getImage("nav_assets_def")} style={styles.foot_icon}/>
                            <Text uppercase={false} style={{color:'#00000050'}}>{getString("assets_tab_assets")}</Text>
                        </Button>
                    </FooterTab>
                    <FooterTab>
                        <Button borderRadius={0} androidRippleColor='#4acbe1' style={{backgroundColor:'#ffffff'}} active={this.state.selectedTab==='me'} onPress={() => this.setState({selectedTab: 'me'})}>
                            <Image source={this.state.selectedTab==='me'? Global.getImage("nav_USER_cur") : Global.getImage("nav_USER_def")} style={styles.foot_icon}/>
                            <Text uppercase={false} style={{color:'#00000050'}}>{getString("assets_tab_me")}</Text>
                            {pendingCount>0?
                            <View>
                                <Image style={{width:8, height:8, position: 'absolute', right: -18, top: -40}} source={Global.getImage("red_point")}/>
                            </View>:null}
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}

export const WrappedComponent = Assets;

export function mapStateToProps(state) {
    return {
        wallet: state.wallet,
        token: state.token,
        settings: state.setting,
        message: state.message
    }
}
