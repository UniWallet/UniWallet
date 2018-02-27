import Platform from 'react';
import React, {Component} from 'react';
import {Dimensions, Image, StatusBar, StyleSheet, RefreshControl, View, FlatList} from 'react-native';
import {friendlyTime} from "../../libs/utils";

import {
    Button,
    CheckBox,
    Container,
    Content,
    Header,
    Title,
    List,
    ListItem,
    Text,
    Icon,
    Separator,
    Left,
    H3,
    Right,
    Body,
    Form, Item, Input,
    Switch
} from 'native-base';

import MyHeader from "../common/MyHeader";
import MyFooterButton from "../common/MyFooterButton";
import Global from "../common/Global"
import LoadMoreFooter from "../common/LoadMoreFooter"


const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

import * as utils from '../../libs/utils';
import {web3} from "../../libs/web3"

import * as WalletUtils from "../common/wallet_utils/wallet_utils"
import * as Log from "../../libs/Log"
import getString from "../../translations/index";
import * as etherutils from '../../libs/etherutils';
import {formatTransactionBalance} from "../common/wallet_utils/wallet_utils";
import * as Constant from "../../libs/constant"

const datas = [
    {
        hash: '0x2c5dd5b703b10574e2b3c2052952ca0ba4cf0cd4a7095418519e11e517c396aa',
        blockNumber: 21,
        from: '0xCa911963c4Dd30929f0c909818083eA9051200c0',
        to: '0x02bb163Af3c82E085808f68C6Eda055D30A57Ba7',
        gas: 21000,
        gasPrice: '126000',
        value: '500000000',
        nonce: 1,
        timestamp: 1509093475464
    },
    {
        hash: '0x2c5dd5b703b10574e2b3c2052952ca0ba4cf0cd4a7095418519e11e517c396aa',
        blockNumber: 21,
        from: '0xCa911963c4Dd30929f0c909818083eA9051200c0',
        to: '0x02bb163Af3c82E085808f68C6Eda055D30A57Ba7',
        gas: 21000,
        gasPrice: '1260',
        value: '5000000',
        nonce: 1,
        timestamp: 1509093475464
    },
    {
        hash: '0x2c5dd5b703b10574e2b3c2052952ca0ba4cf0cd4a7095418519e11e517c396aa',
        blockNumber: 21,
        from: '0xCa911963c4Dd30929f0c909818083eA9051200c0',
        to: '0x02bb163Af3c82E085808f68C6Eda055D30A57Ba7',
        gas: 21000,
        gasPrice: '12600',
        value: '50',
        nonce: 1,
        timestamp: 1509093475464
    },
];
var offset = -1;
export default class Assets_coinaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,isLoading:false,isLoadAll:false,isLoadFailed:false,
        }
    }

    getDate(timestamp) {
        return friendlyTime(timestamp)
    }

    componentDidMount() {
        this._handleRefresh();
    }

    _handleRefresh() {
        if(this.state.refreshing) {
            return
        }
        Log.log("------------------------------_handleRefresh");
        const { actions } = this.props;
        this.setState({ isLoading: true })
        var wallet = this.props.wallet.cur_wallet;
        var size = 40;
        var params = this.props.navigation.state.params;
        var isToken = (params.contract != null && params.contract != undefined && params.contract != Global.ETH_ADDRESS) ? true : false;
        //update when state changed
        actions.startUpdate();
        actions.updateTransactionList({
            address: wallet.address,
            count: size,
            token:isToken?params.contract:Global.ETH_ADDRESS,
            resolved: (data) => {
                offset=-1;
                Log.log("------------------------------resolved");
                Log.log(data.transactions.length);
                Log.log("------------------------------resolved end");
                this.setState({isLoadAll:data.transactions.length<size})
                this._endLoading()
            },
            rejected: () => {
                this.setState({isLoadFailed:true})
                this._endLoading()
                Log.log("change wallet name error");
            }
        });
    }

    _endLoading() {
        this.setState({
            refreshing: false,
            isLoading:false,
        })
    }

    _onReloadData(){
        if(this.state.isLoadFailed!=true){
            return
        }
        this.setState({isLoadFailed:false});
        this._handleLoadMore();
    }


    _renderRow(rowData) {
        var wallet = this.props.wallet.cur_wallet;
        var status = WalletUtils.getTransactionStatus(rowData);
        return (<ListItem button style={styles.listitem}
                          onPress={() => this.props.navigation.navigate("TransactDetails", {...rowData})}>
            <View style={styles.transaction}>
                <Image
                    source={status.error==1?Global.getImage("icon_asset_failed"):(Global.getImage(rowData.from.toLowerCase() == wallet.address.toLowerCase()?"icon_transfer_small":"icon_receipt_small"))}
                    style={styles.transactionicon}/>
                <View style={{
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    paddingLeft: 10
                }}>
                    <Text numberOfLines={1} ellipsizeMode={'middle'} style={{
                        textAlign: 'left',
                        color: 'rgba(0,0,0,0.45)',
                        fontSize: 15,
                        width: deviceWidth * 0.45
                    }}> {rowData.from.toLowerCase() == wallet.address.toLowerCase() ? etherutils.toChecksumAddress(rowData.type != Constant.TRANSACTION_TYPE_CONTRACT ? rowData.to : rowData.extra.to) : etherutils.toChecksumAddress(rowData.from)} </Text>
                    <Text style={{
                        textAlign: 'left',
                        fontSize: 13,
                        width: deviceWidth * 0.45,
                        marginTop: 10,
                        color: 'rgba(0,0,0,0.45)',
                        paddingLeft: 4
                    }}>
                        {this.getDate(rowData.timestamp)}
                    </Text>
                </View>
                <View style={{
                    flex: 1, flexDirection: "column", alignItems: "flex-end"
                }}>
                    <Text style={{
                        flex: 1,
                        textAlign: 'right',
                        alignSelf: "flex-end",
                        color: rowData.from.toLowerCase() == wallet.address.toLowerCase() ? 'red' : 'rgb(2,204,45)',
                        fontSize: 15
                    }}>{rowData.from.toLowerCase() == wallet.address.toLowerCase() ? "-" : "+"}{formatTransactionBalance(rowData, 4)} {rowData.unit}</Text>
                    <Text style={{
                        flex: 1,
                        textAlign: 'right',
                        alignSelf: "flex-end",
                        fontSize: 13,
                        marginTop: 10,
                        marginRight: 4,
                        color: status.error == 1? 'rgb(40,217,227)':'rgba(0,0,0,0.45)'
                    }}>
                        {status.status}
                    </Text>
                </View>
            </View>
        </ListItem>)
    }


    _handleLoadMore(){
        Log.log("------------------------------_handleLoadMore");
        // 返回没有更多数据视图 缓存的增量数据为0并且页数不是初始页
        // 防止重复申请
        if(this.state.isLoading||this.state.isLoadAll) {
            return
        }
        const { actions } = this.props;
        this.setState({ isLoading: true })
        var wallet = this.props.wallet.cur_wallet;
        var params = this.props.navigation.state.params
        var isToken = (params.contract != null && params.contract != undefined && params.contract != Global.ETH_ADDRESS) ? true : false;
        var size = 40;
        Log.log("------------------------------offset:"+offset);
        var timer = setTimeout(() => {
            this.setState({isLoading: false,isLoadFailed:true})
        }, 15*1000);
        actions.getTransactionList({
            address: wallet.address,
            count: size,
            offset: offset,
            token:isToken?params.contract:Global.ETH_ADDRESS,
            resolved: (data) => {
                Log.log("------------------------------resolved");
                Log.log(data);
                Log.log("------------------------------resolved length:"+data.transactions.length);
                Log.log("------------------------------resolved end");
                offset+=data.transactions.length;
                this._endLoading()
                this.setState({isLoadAll:data.transactions.length<size});
                clearTimeout(timer);
            },
            rejected: () => {
                this._endLoading()
                this.setState({isLoadFailed:true})
                clearTimeout(timer);
                Log.log("change wallet name error");
            }
        });

    }

    _endReached(){
        this._handleLoadMore();
    }

    _resetFooter(){
        var showIndicator = this.state.isLoadAll?false:true;
        var footText = getString(this.state.isLoadAll?'load_all_done':'loading');
        if(this.state.isLoadFailed){
            showIndicator = false;
            footText = getString('loading_failed');
            return (<LoadMoreFooter onFootTextPressed={()=>this._onReloadData()} showIndicator={showIndicator} footText={footText}/>);
        }
      return (<LoadMoreFooter showIndicator={showIndicator} footText={footText}/>);
    }

    _separatorView = () => {
        return (
            <View style={{backgroundColor: "rgba(0,0,0,0.15)",marginLeft:18, height: 0.8}}>
            </View>
        );
    }

    render() {
        var wallet = this.props.wallet.cur_wallet;
        var transaction = this.props.transaction;
        Log.log("+++++++++++++++++++++++++++++++++++++render lihongguo");
        var params = this.props.navigation.state.params
        var title = params.title;
        var amount = params.amount;
        var isToken = (params.contract && params.contract != undefined && params.contract != Global.ETH_ADDRESS) ? true : false;
        var trans = WalletUtils.getTransaction(transaction, wallet.address, params.contract);
        if(offset == -1){
            offset = trans?trans.length:0;
        };
        Log.log("+++++++++++++++++++++++++++++++++++++offset:"+offset);
        var balance = (!isToken) ? wallet.balance : wallet.tokens[params.contract].balance;
        if (!balance) {
            balance = 0;
        }
        let exchange = utils.getExchange(this.props.settings.exchange);
        let currency_symbol = Global.DEFAULT_CONCURRENCY_SYMBOL
        if (exchange && exchange.symbol) {
            currency_symbol = exchange.symbol;
        }
        return (
            <View style={styles.container}>
                <MyHeader
                    {...this.props}
                    iconColor="#FFFFFF"
                    titleColor="#FFFFFF"
                    actionBarBgColor="transparent"
                    leftImageName='header_back_white'
                    titleName={title}
                    withoutBottom={true}
                />
                <View style={{flex: 1, backgroundColor: "#F4F4F4"}}>
                    <View style={{
                        alignItems: "center",
                        marginTop: 10
                    }}>
                        <H3 style={styles.text}>{etherutils.formatBalance(balance, 4).toString()}</H3>
                        <Text numberOfLines={1} ellipsizeMode={'middle'}
                              style={styles.textcolor}>{currency_symbol}{etherutils.formatBalance(amount, 2)}</Text>
                    </View>
                    <View style={{flex: 1, backgroundColor: "#ffffff"}}>
                        <Text style={{
                            paddingTop: 20,
                            paddingLeft: 20,
                            color: Global.primaryContentColor
                        }}>{getString("assets_action_records")}</Text>
                        {(trans && trans.length > 0) ? (
                            <FlatList
                                ItemSeparatorComponent={this._separatorView}
                                onEndReached={() => this._endReached()}
                                onEndReachedThreshold={20}
                                ListFooterComponent={this._resetFooter() }
                                showsVerticalScrollIndicator={false} style={{marginTop: 10, borderRadius: 10}}
                                refreshControl={<RefreshControl refreshing={this.state.refreshing}
                                                                onRefresh={this._handleRefresh.bind(this)}
                                                                progressViewOffset={0}/>}
                                data={utils.fixFlatListData(trans)}
                                renderItem={({item}) => this._renderRow(item)}
                            />) : (<View style={{alignItems: "center"}}>
                            <Image source={Global.getImage("record_no")}
                                   style={{height: 60, width: 60, marginTop: 70}}/>
                            <Text style={styles.hint}>{getString("hint_no_records")}</Text>
                        </View>)}
                    </View>
                </View>
                <MyFooterButton
                    {...this.props}
                    button1IconName="icon_transfer_small"
                    button1Name={getString("assets_action_transfer")}
                    button1Navi="Assetscointransfer"
                    button1NaviParams={{...this.props.navigation.state.params}}
                    button2IconName="icon_receipt_small"
                    button2NaviParams={{...this.props.navigation.state.params}}
                    button2Name={getString("assets_action_receive")}
                    button2Navi="Assetsqrcode"
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Global.primaryColor
    },
    header: {
        flexDirection: "column",
        height: 230,
        backgroundColor: "#4bb6d4"
    },
    icon: {
        flexDirection: "column",
        justifyContent: "center",
        marginLeft: 40,
        marginRight: 40,
    },
    hint: {
        color: "#bbbbbb",
        fontSize: 14,
        height: 100, width: 140, textAlign: "center", marginTop: 10
    },
    iconImage: {
        width: 50,
        height: 50,
    },
    iconText: {
        marginTop: 5,
        fontSize: 12,
        color: "#ffffff",
    },
    text: {
        alignSelf: "center",
        fontSize: 40,
        paddingTop: 25,
        paddingBottom: 5,
        color: 'rgba(0,0,0,0.60)'
    },
    text2: {
        color: "#FFFFFF",
        textAlign: 'center',
        fontSize: 14,
    },
    button: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'center',
        marginTop: 1,
        marginBottom: 1,
        borderWidth: 0,
        borderColor: '#ffffff',
    },
    textcolor: {
        alignSelf: "center",
        marginBottom: 20,
        marginTop: 10,
        fontSize: 18,
        color: "#9A9A9A"
    },
    qr_img: {
        width: deviceWidth / 1.5,
        height: deviceWidth / 1.5,
    },
    main_content: {
        width: deviceWidth / 1.2
    },
    listitem: {
        marginLeft: 0,
        marginRight: 0,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        borderWidth: 0,
        paddingRight: 15,
        borderColor: '#ffffff',
        backgroundColor: "#ffffff"
    },
    transaction: {
        flex: 1,
        flexDirection: 'row',
    },
    transactionicon: {
        width: 30,
        alignSelf: "center",
        height: 30,
    },
});

export const WrappedComponent = Assets_coinaction;

export function mapStateToProps(state) {
    return {
        wallet: state.wallet,
        settings: state.setting,
        transaction: state.transaction
    }
}
