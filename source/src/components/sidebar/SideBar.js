import Platform from 'react';
import React, {Component} from 'react';
import {Dimensions, Image, StatusBar, StyleSheet, View, FlatList} from 'react-native';

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
    Badge,
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

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

import * as etherutils from '../../libs/etherutils';
import * as utils from '../../libs/utils';

const datas = [
    {
        line:true,
    },
    {
        name:  getString("create_wallet"),
        route: "WalletCreate",
        icon: Global.getImage("side_setup")
    },
    {
        name: getString("import_wallet"),
        route: "Import",
        icon: Global.getImage("side_import")
    },
    {   line:true,
    },
    {
        name: getString("sidebar_scan"),
        route: "QRCodeScreen",
        icon: Global.getImage("side_scan")
    },
    {
        name: getString("sidebar_my_receipt_code"),
        route: "Assetsqrcode",
        icon: Global.getImage("side_qr")
    },
    {
        name: getString("transaction_records"),
        route: "TransactHistory",
        icon: Global.getImage("my_record")
    },

];

export default class SideBar extends Component {
    _generateLists() {
        var wallets = this.props.wallet.wallets;
        var newlists = [];
        if (wallets) {
            for (wallet in wallets) {
                newlists = newlists.concat(wallets[wallet]);
            }
            newlists = newlists.concat(datas);
        } else {
            newlists = [].concat(datas);
        }
        return newlists;
    }


    constructor(props) {
        super(props);
        this.state = {
            data: this._generateLists(),
        }
    }

    _handleScanResult(code, result) {
        Log.log("result: " + JSON.stringify(result))

        if (result && result.data) {
            var fields = etherutils.getFieldsFromIBANString(result.data);
            Log.log("fields: " + JSON.stringify(fields))
            try {
                let address =  etherutils.getAddressFromIBAN(fields.address);
                if (address) {
                    let tokenInfo = utils.getTokenUnitFromSymbol(fields.token);
                    let title = Global.ETH_SYMBOL;
                    if (tokenInfo) {
                        title = fields.token;
                    }
                    this.props.navigation.navigate("Assetscointransfer", {
                        title: title,
                        address: address,
                        contract: tokenInfo.address,
                        amount: fields.amount
                    })
                } else {

                }
            }catch (e){
                Log.log("scan error: " + e)
            }
        }
    }

    _handleWalletPress(rowData) {
        const { actions } = this.props;
        if (rowData.route) {
            if (rowData.route === "QRCodeScreen") {
                this.props.navigation.navigate(rowData.route, {
                    code:0,
                    callback:this._handleScanResult.bind(this),
                });
            } else {
                this.props.navigation.navigate(rowData.route);
            }
        } else {
                //switch the current wallet
                actions.switchWallet({
                      wallet: rowData,
                      resolved: () => { //create ok
                          this.props.navigation.navigate("DrawerClose");
                      }
                  }
                );
        }
    }

    render() {
        //updat the data
        this.state.data = this._generateLists();
        var currentAddress = this.props.wallet.cur_wallet? this.props.wallet.cur_wallet.address:null;
        return (
            <Container style={styles.container}>
                <View style={{paddingTop:48}}>
                {(this.props.wallet && this.props.wallet.wallets)? (
                    <FlatList
                        data={utils.fixFlatListData(this.state.data)}
                        renderItem={({ item }) =>
                            (item.line?(<View style={styles.line}/>):(
                                <ListItem style={{marginLeft:0,paddingLeft:30,backgroundColor: currentAddress==item.address?"#d0d0d0":"#F4F4F4"}}  button noBorder onPress={() => this._handleWalletPress(item)}>
                                    <Left>
                                        <Image source={item.icon? item.icon:Global.getImage("head_menu")} style={{ height: item.route? 24:24, width: item.route? 24:24 }} />
                                        <Text style={styles.badgeText}>{item.name}</Text>
                                    </Left>
                                </ListItem>))}
                    />) : null
                }
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:"#F4F4F4"
    },
    line: {
        backgroundColor:"#f3f3f3",
        height:1,
    },
    badgeText: {
        flex: 1,
        fontSize: Platform.OS === "ios" ? 18 : 16,
        fontWeight: "400",
        textAlign: "left",
        color: 'rgba(0, 0, 0, 0.87)',
        paddingLeft: 16,
        marginTop: Platform.OS === "android" ? 0 : undefined
    }
});

export const WrappedComponent = SideBar;

export function mapStateToProps(state) {
    return {
        wallet: state.wallet
    }
}