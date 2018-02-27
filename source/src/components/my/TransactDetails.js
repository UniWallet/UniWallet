import React, {Component} from "react";
import {Dimensions, Image, StatusBar, StyleSheet, View, ScrollView,Clipboard,TouchableHighlight} from 'react-native';
import * as WalletUtils from "../common/wallet_utils/wallet_utils";
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
import * as etherutils from '../../libs/etherutils';
import MyHeader from "../common/MyHeader"
import Global from "../common/Global"
import QRCode from 'react-native-qrcode';
import getString from "../../translations/index";
import {getDateFromUnix} from "../../libs/utils";
import {formatTransactionBalance} from "../common/wallet_utils/wallet_utils";
import * as Constant from "../../libs/constant"
import config from '../../configs';

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

class TransactDetails extends Component {
    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        if (params != null) {
            this.state = {
                ...params,
            };
        } else {
            this.state = {
                from: "0xxx",
                to: "0xxxx",
                gas: "0x000",
                gasPrice: "0x0",
                value: "0x0",
                hash: "0x0",
                blockNumber: "0x0",
                timestamp: 1509384472,
            };
        }
    }


    _onCopyPress(address) {
        const {actions} = this.props;
        Clipboard.setString(address);
        actions.toast(getString("assets_qrcode_copy_ok"));
    };

    render() {
        const {params} = this.props.navigation.state;
        var url = config.exploreUrl +this.state.hash;
        if (this.state.decimal) {
            value = this.state.value/Math.pow(10, this.state.decimal)
        } else {
            value = this.state.value
        }

        var error = ( this.state.status == 0);
        return (
            <Container style={{backgroundColor: "#F5F5F5"}}>
                <View style={styles.backgroundImage}>
                    <MyHeader
                        titleColor='#fff'
                        rightTextColor='#fff'
                        actionBarBgColor="transparent"
                        leftImageName='header_back_white'
                        titleName={getString("transaction_details")}
                        backgroundColor="transparent"
                        withoutBottom={true}
                        {...this.props}
                    />

                    <View style={{
                        alignItems: "center",
                        marginBottom: 10,
                        marginTop: 10,
                        backgroundColor: "transparent",
                    }}>
                        <Image source={error?Global.getImage("icon_asset_failed"):(Global.getImage("own_record_icon"))}
                               style={{width: deviceWidth * 0.12, height: deviceWidth * 0.12}}/>
                        <Text style={styles.textcolor}>{formatTransactionBalance(this.state, 4)}
                             {" " + this.state.unit}</Text>
                    </View>
                </View>
                <View style={styles.content_erea}>
                    <View style={{paddingLeft: 20, paddingRight: 20}}>
                        <Text style={styles.title}>{getString("from")}</Text>
                        <TouchableHighlight onLongPress={()=>this._onCopyPress(this.state.from)} underlayColor={'rgba(0, 0, 0, 0.3)'} >
                        <Text style={styles.content} >
                            {this.state.from}
                        </Text>
                        </TouchableHighlight>
                        <Text style={styles.title}>{getString("to")}</Text>
                        <TouchableHighlight onLongPress={()=>this._onCopyPress(this.state.to)}underlayColor={'rgba(0, 0, 0, 0.3)'} >
                        <Text style={styles.content} >
                            {this.state.type == Constant.TRANSACTION_TYPE_CONTRACT?this.state.extra.to:this.state.to}
                        </Text>
                        </TouchableHighlight>
                        <Text style={styles.title}>{getString("gas_used")}</Text>
                        <Text style={styles.content}>
                            {(this.state.gasUsed*this.state.gasPrice)/Math.pow(10, Global.ETH_DECIMAL)} {Global.ETH_UNIT}
                        </Text>
                        <Text style={styles.title}>{getString("extra")}</Text>
                        <Text style={styles.content}>
                            {getString("tx_comment_default")}
                            {/*{this.state.type == Constant.TRANSACTION_TYPE_CONTRACT ? this.state.extra.input : this.state.input}*/}
                        </Text>
                    </View>
                    <View style={styles.line}/>
                    <ScrollView>
                        <View style={{flexDirection: "row", paddingLeft: 20, paddingRight: 20}}>
                            <View>
                                <Text style={styles.title}>{getString("hash")}</Text>
                                <Text numberOfLines={1} ellipsizeMode={'middle'} style={styles.transaction_content}
                                      onPress={() => this.props.navigation.navigate("SimpleBrowser", {
                                          title: getString("hash"), url: url, refresh: false,
                                          share: false
                                      })}>
                                    {this.state.hash}
                                </Text>
                                <Text style={styles.title}>{getString("block_number")}</Text>
                                <Text numberOfLines={1} ellipsizeMode={'middle'} style={styles.content_bottom}>
                                    {this.state.blockNumber ? this.state.blockNumber : " "}
                                </Text>
                                <Text style={styles.title}>{getString("timestamp")}</Text>
                                <Text numberOfLines={3} style={styles.content_bottom}>
                                    {getDateFromUnix(this.state.timestamp, "hh:mm:ss DD/MM/YYYY")}
                                </Text>
                            </View>
                            <View style={styles.qrErea}>
                                <QRCode
                                    value={url}
                                    size={deviceHeight * 0.19}/>
                                <Text style={styles.qr_copy} onPress={()=>this._onCopyPress(url)}>{getString("copy_url")}</Text>
                                <View style={styles.qr_line}/>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    textcolor: {
        color: "white",
        textAlign: 'center',
        fontSize: 25,
        paddingTop: 15,
    },
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    qrCode: {
        width: 0.15 * deviceWidth,
        height: 0.15 * deviceWidth,
    },
    qrErea: {
        marginTop: 8,
        width: 0.5 * deviceWidth,
        alignItems: "center"
    },
    qr_line: {
        height: 0.5,
        width: deviceWidth * 0.3,
        backgroundColor: "#28D8E2",
    },
    qr_copy: {
        marginTop: 8, fontSize: 14,
        color: "#28D8E2",
    },
    backgroundImage: {
        backgroundColor: "#28D8E2",
        width: deviceWidth,
        flex: 0.35,
        resizeMode: "stretch",
    },
    content_erea: {
        width: deviceWidth,
        flex: 0.65,
    },
    line: {
        height: 0.5,
        marginTop: 8,
        marginBottom: 8,
        backgroundColor: "#D1D1D1",
    },
    transaction_content: {
        textAlign: 'left', width: deviceWidth * 0.4, fontSize: 13,
        color: "#28D8E2",
    },
    title: {color: 'rgba(0,0,0,0.45)', width: deviceWidth * 0.45, marginTop: 10, fontSize: 14},
    content: {textAlign: 'left', marginTop: 2, fontSize: 13, color: '#696969',},
    content_bottom: {textAlign: 'left', width: deviceWidth * 0.4, fontSize: 13, marginTop: 2, color: '#696969',},
});

export const WrappedComponent = TransactDetails;
