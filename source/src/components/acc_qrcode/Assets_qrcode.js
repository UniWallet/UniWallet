import Platform from 'react';
import React, {Component} from 'react';
import {Dimensions, Image, StatusBar, StyleSheet,ScrollView, View, Clipboard} from 'react-native';
import QRCode from 'react-native-qrcode';

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
    Right,
    Body,
    Form, Item, Input,
    Switch
} from 'native-base';

import Share, {ShareSheet} from 'react-native-share';


const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

import getString from "../../translations";
import MyHeader from "../common/MyHeader";

import Global from "../common/Global";
import * as Log from "../../libs/Log"
import * as etherutils from '../../libs/etherutils';
import * as Validation from "../../libs/validation"

export default class Assets_qrcode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }

    _onRightMenuPress() {
        var wallet = this.props.wallet.cur_wallet;
        let shareOptions = {
            title: wallet.name,
            message: wallet.address
        };

        setTimeout(() => {
            Share.open(shareOptions)
        }, 300);
    }

    _onCopyPress() {
        const {actions} = this.props;
        var wallet = this.props.wallet.cur_wallet;
        Clipboard.setString(wallet.address);
        actions.toast(getString("assets_qrcode_copy_ok"));
    };

    render() {
        var wallet = this.props.wallet.cur_wallet;
        Log.log("wallet: " + wallet)
        var token = Global.ETH_SYMBOL;
        if(this.props.navigation.state.params&&this.props.navigation.state.params.title){
            token = this.props.navigation.state.params.title
        }
        let value;
        if (Validation.checkNum(this.state.value)) {
            value = this.state.value;
        } else {
            value = 0;
        }
        return (
            <Container style={styles.container}>
                <MyHeader
                    statusBarBgColor="#28D8E2"
                    actionBarBgColor="#28D8E2"
                    iconColor="#FFFFFF"
                    leftImageName='header_back_white'
                    rightTextColor="#FFFFFF"
                    titleColor="#FFFFFF"
                    rightText={getString("share")}
                    titleName={getString("assets_action_receive_code")}
                    rightOnPress={this._onRightMenuPress.bind(this)}
                    {...this.props}
                />
                <ScrollView style={{flex: 1}}>
                <View style={{flex: 0.92, margin: 15, padding: 16,
                    borderRadius: 5, backgroundColor: '#ffffff', alignItems: "center"}}>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <Image style={styles.image} source={Global.getImage("head_management")}/>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            marginLeft: 10,
                            marginRight:5,
                        }}
                        >
                            <Text style={styles.fullName}>{getString("assets_address_mine")} </Text>
                            <Text style={{flexDirection: "row",color:"#A9A9A9",fontSize:13, justifyContent: "flex-start"}}
                                  numberOfLines={2}
                                  ellipsizeMode='middle'>{etherutils.toChecksumAddress(wallet.address)} </Text>
                        </View>
                    </View>
                    <Form style={{width: deviceWidth *0.8}}>
                        <Item>
                            <Input style={{color:"#A9A9A9"}} keyboardType={'decimal-pad'} value = {this.state.value} defaultValue="0" onChangeText={(value) => {
                                    if (!Validation.checkNum(value)) {
                                        const {actions} = this.props;
                                        actions.toast(getString("invalid_num"));
                                    }
                                    this.setState({value})
                            }}/>
                        </Item>
                    </Form>
                    <View style={styles.line}/>
                    <View style={{flexDirection: "row", justifyContent: "center",marginBottom:10}}>
                        <QRCode
                          value={"iban:"+etherutils.getIBANCode(wallet.address) + "?amount=" + value + "&token="+token}
                          size={deviceWidth/1.5}/>
                    </View>
                </View>
                <View style={{paddingTop: 15, flexDirection: "row", justifyContent: "center"}}>
                    <Button style={{
                        width: deviceWidth * 0.8,
                        backgroundColor: "#28D8E2",
                        flexDirection: "row",
                        justifyContent: "center"
                    }} onPress={this._onCopyPress.bind(this)}>
                        <Text uppercase={false} >{getString("assets_address_copy")}</Text>
                    </Button>
                </View>
                </ScrollView>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eeeeee"
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
    iconImage: {
        width: 50,
        height: 50,
    },
    iconText: {
        marginTop: 5,
        fontSize: 12,
        color: "#ffffff",
    },
    qr_img: {
        width: deviceWidth / 1.5,
        height: deviceWidth / 1.5,
    },
    main_content: {
        width: deviceWidth / 1.2
    },
    line: {
        height: 0.5,
        backgroundColor:"#28D8E2",
        marginBottom:10,
    },
    image: {
        width: 50,
        height: 50,
        overflow: "hidden",
        borderRadius: 50,
        marginLeft: 10,
    },
});

export const WrappedComponent = Assets_qrcode;

export function mapStateToProps(state) {
    return {
        wallet: state.wallet
    }
}