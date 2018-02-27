import React, {Component} from "react";
import * as WalletUtils from "../common/wallet_utils/wallet_utils"
import {Dimensions, Image, StatusBar, StyleSheet, RefreshControl, View,FlatList} from 'react-native';
import {friendlyTime} from "../../libs/utils";
import {
    Container,
    Content,
    Header,
    Title,
    Button,
    Icon,
    Right,
    Left,
    List,
    ListItem,
    Card,
    CardItem,
    Separator,
    Body,
    Text,
} from "native-base";

import MyHeader from "../common/MyHeader"
import Global from "../common/Global"
import LoadMoreFooter from "../common/LoadMoreFooter"
import getString from "../../translations/index";
import {formatTransactionBalance} from "../common/wallet_utils/wallet_utils";
import * as etherutils from '../../libs/etherutils';
import * as Constant from "../../libs/constant"
import * as Log from "../../libs/Log"

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

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
var offset = -1;
class TransactHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,isLoading:false,isLoadAll:false,isLoadFailed:false,
        }
    }

    // eslint-disable-line
    getDate(timestamp) {
        return friendlyTime(timestamp)
    }


    componentDidMount() {
        this._handleRefresh();
    }

    _handleRefresh () {
        if(this.state.refreshing) {
            return
        }
        Log.log("------------------------------_handleRefresh");
        const { actions } = this.props;
        this.setState({ isLoading: true })
        var wallet = this.props.wallet.cur_wallet;
        var size = 40;
        //update when state changed
        actions.startUpdate();
        actions.updateTransactionList({
            address: wallet.address,
            count: size,
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

    _endLoading () {
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
        var size = 40;
        Log.log("------------------------------offset:"+offset);
        var timer = setTimeout(() => {
            this.setState({isLoading: false,isLoadFailed:true})
        }, 15*1000);
        actions.getTransactionList({
            address: wallet.address,
            count: size,
            offset: offset,
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
                clearTimeout(timer);
                Log.log("change wallet name error");
            }
        });
    }

    _renderFooter(){
        var showIndicator = this.state.isLoadAll?false:true;
        var footText = getString(this.state.isLoadAll?'load_all_done':'loading');
        if(this.state.isLoadFailed){
            showIndicator = false;
            footText = getString('loading_failed');
            return (<LoadMoreFooter onFootTextPressed={()=>this._onReloadData()} showIndicator={showIndicator} footText={footText}/>);
        }
        return (<LoadMoreFooter showIndicator={showIndicator} footText={footText}/>);
    }

    _endReached(){
        // 防止重复申请
        this._handleLoadMore();
    }

    _renderRow(rowData) {
        var wallet = this.props.wallet.cur_wallet;
        var status = WalletUtils.getTransactionStatus(rowData);
        return (<ListItem button style={styles.listitem} onPress={()=>this.props.navigation.navigate("TransactDetails",{...rowData})}>
            <View style={styles.transaction}>
                <Image source={status.error==1?Global.getImage("icon_asset_failed"):(Global.getImage(rowData.from.toLowerCase() == wallet.address.toLowerCase()?"icon_transfer_small":"icon_receipt_small"))} style={styles.transactionicon}/>
                <View style={{flexDirection:"column", justifyContent:"flex-start",alignItems:"flex-start",paddingLeft: 10}}>
                    <Text numberOfLines={1} ellipsizeMode={'middle'} style={{textAlign: 'left', color:'rgba(0,0,0,0.45)',fontSize:15, width: deviceWidth*0.45}}> {rowData.from.toLowerCase() == wallet.address.toLowerCase()?etherutils.toChecksumAddress(rowData.type != Constant.TRANSACTION_TYPE_CONTRACT ? rowData.to : rowData.extra.to):etherutils.toChecksumAddress(rowData.from)} </Text>
                    <Text style={{textAlign: 'left', fontSize:13, width: deviceWidth*0.45,marginTop:10, color:'rgba(0,0,0,0.45)', paddingLeft: 4}}>
                        {this.getDate(rowData.timestamp)}
                    </Text>
                </View>

                <View style={{
                    flex: 1,flexDirection:"column", alignItems:"flex-end"}}>
                    <Text style={ {textAlign: 'right', alignSelf:"flex-end",color: rowData.from.toLowerCase() == wallet.address.toLowerCase()? 'red':'rgb(2,204,45)',fontSize:15}}>{ rowData.from.toLowerCase() == wallet.address.toLowerCase()?"-":"+"}{formatTransactionBalance(rowData, 4)} {rowData.unit}</Text>
                    <Text style={{textAlign: 'right', alignSelf:"flex-end",fontSize:13,marginTop:10,marginRight:4,color:status.error == 1? 'rgb(40,217,227)':'rgba(0,0,0,0.45)'}}>
                        {status.status}
                    </Text>
                </View>
            </View>
        </ListItem>)
    }

    render() {
        var wallet = this.props.wallet.cur_wallet;
        var transaction = this.props.transaction;
        var trans = WalletUtils.getTransaction(transaction, wallet.address);
        if(offset == -1){
            offset = trans?trans.length:0;
        };
        Log.log("------------------------------render offset:"+offset);
        return (
            <Container >
                <MyHeader titleName={getString("transaction_records")}
                          {...this.props}
                />
                {
                    (trans&&trans.length>0)? (<List
                        style={styles.list}
                        dataArray={trans}
                        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._handleRefresh.bind(this)} progressViewOffset={0}/>}
                        renderRow={this._renderRow.bind(this)}
                        onEndReached={() => this._endReached()}
                        onEndReachedThreshold={10}
                        renderFooter={() => this._renderFooter()}
                    />): (<View style={{flex:1,backgroundColor:"#F5F5F5",alignItems: "center"}}>
                        <Image source={Global.getImage("record_no")} style={{height: 60, width: 60,marginTop:deviceHeight*0.3}}/>
                        <Text style={styles.hint}>{getString("hint_no_records")}</Text>
                    </View>)}
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingBottom: 20,
    },
    line:{
        height: 0.5,
        backgroundColor:  "#D1D1D1",
    },
    card: {
        flex: 1,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        borderRadius: 0,
    },
    cardItem: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    container: {
        flex: 1,
        backgroundColor:Global.primaryColor
    },
    header: {
        flexDirection: "column",
        height: 230,
        backgroundColor:"#4bb6d4"
    },
    icon: {
        flexDirection: "column",
        justifyContent: "center",
        marginLeft:40,
        marginRight:40,
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
        paddingTop:25,
        paddingBottom: 5,
        fontWeight:'bold',
        color: '#000000de'
    },
    text2: {
        color: "#FFFFFF",
        textAlign: 'center',
        fontSize: 14,
    },
    button: {
        flex: 1,
        flexDirection: "row",
        alignSelf: 'stretch',
        justifyContent: 'center',
        marginTop: 1,
        marginBottom: 1,
        borderWidth: 0,
        borderColor: '#ffffff',
    },
    textcolor: {
        width:deviceWidth/1.5,
        alignSelf: "center",
        marginBottom: 30,
        marginTop:20,
        color: "#9A9A9A"
    },
    qr_img: {
        width: deviceWidth/1.5,
        height: deviceWidth/1.5,
    },
    main_content: {
        width: deviceWidth/1.2
    },
    listitem: {
        marginLeft:0,
        marginRight:0,
        borderBottomWidth:0.5,
        borderColor:"rgba(0,0,0,0.15)",
        paddingTop:15,
        paddingBottom:15,
        paddingLeft:15,
        paddingRight:15
    },
    transaction: {
        flex: 1,
        flexDirection:'row',
    },
    transactionicon: {
        width: 30,
        alignSelf: "center",
        height: 30,
    },
});

export const WrappedComponent = TransactHistory;
export function mapStateToProps(state) {
    return {
        wallet: state.wallet,
        transaction: state.transaction
    }
}
