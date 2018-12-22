import Platform from 'react';
import React, {Component} from 'react';
import {Dimensions, Image, StatusBar, StyleSheet,
    Modal, View,TouchableOpacity,KeyboardAvoidingView} from 'react-native';
import RadioButton from 'react-native-radio-button'

import {
    Button,
    Radio,
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

import Slider from "react-native-slider";

import MyHeader from "../common/MyHeader";
import MyFooterButton from "../common/MyFooterButton";
import Global from "../common/Global"
import * as Log from "../../libs/Log"
import * as Validation from "../../libs/validation"

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

import getString from "../../translations/index";

import * as etherutils from '../../libs/etherutils';
import * as utils from '../../libs/utils';
var NativeAPI = require('react-native').NativeModules.YiYaNativeAPI;

export default class Assets_cointransfer extends Component {
    isETH() {
        var isETH = this.state.tansfer_type === "DORA"? true:false;
        return isETH;
    }

    constructor(props) {
        super(props);
        this.state = {
            toAddress: this.props.navigation.state.params? this.props.navigation.state.params.address : null,
            amount: this.props.navigation.state.params? this.props.navigation.state.params.amount : null,
            note: null,
            limit: Global.ETH_GAS_LIMIT_HIGH*Global.ETH_GAS_LIMIT_RATIO,
            custom_price: null,
            custom_limit: null,
            custom_data: null,
            tansfer_type: (this.props.navigation.state.params&&this.props.navigation.state.params.title)?this.props.navigation.state.params.title:"ETH",
            advanceOption: false,
            showConfirm: false,
            unit:"ether",
            space:deviceHeight-600,
        };

        //update token's price
        if (! this.isETH()) {
            this.state.limit = Global.TOKEN_GAS_LIMIT_HIGH*Global.TOKEN_GAS_LIMIT_RATIO;

            var params = this.props.navigation.state.params;
            let token_info = utils.getTokenUnitFromAddress(params.contract);
            Log.log(token_info);
            this.state.unit = token_info.unit;
        }
    }

    _onTrnasferPress() {
        if (!this.props.wallet.cur_wallet){
            Log.log("Current wallet null");
            return;
        }
        let { toAddress, amount, note, price } = this.state;
        const { actions } = this.props;
        if (!Validation.checkAddress(toAddress)) {
            actions.toast(getString("invalid_address"));
            return;
        }

        if (toAddress.toLowerCase() == this.props.wallet.cur_wallet.address.toLowerCase()) {
            actions.toast(getString("invalid_transfer_to_self"));
            return;
        }

        if (!Validation.checkNum(amount)) {
            actions.toast(getString("invalid_transfer_num"));
            return;
        }

        if (amount < 0) {
            actions.toast(getString("invalid_transfer_zero"));
            return;
        }
        this.setState({showConfirm:true});
    }

    _handleScanResult(code, result) {
        Log.log("result: " + JSON.stringify(result))

        if (result && result.data) {
            var fields = etherutils.getFieldsFromIBANString(result.data);
            Log.log("fields: " + JSON.stringify(fields))
            try {
                let address =  etherutils.getAddressFromIBAN(fields.address)
                if (address) {
                    if (!Validation.checkAddress(address)) {
                        actions.toast(getString("invalid_address"));
                        return;
                    }
                    var toAddress = etherutils.toChecksumAddress(address);
                    let tokenInfo = utils.getTokenUnitFromSymbol(fields.token);
                    let title = Global.ETH_SYMBOL;
                    if (tokenInfo) {
                        title = fields.token;
                    }
                    this.setState({
                        ...this.state,
                        toAddress: toAddress,
                        contract: tokenInfo.address,
                        amount: fields.amount,
                        unit:tokenInfo.unit,
                    })
                } else {

                }
            }catch (e){
                Log.log("scan error: " + e)
            }
        }
    }

    _onLeftMenuPress() {
    }

    _onConfirmPress() {
        let { toAddress, amount, note, price } = this.state;
        const { actions } = this.props;
        var params = this.props.navigation.state.params;
        var contractParams = null;
        var nonceParams = null;
        let isEth = this.isETH();
        var wallet = this.props.wallet.cur_wallet;
        var balance = isEth ? wallet.balance : wallet.tokens[params.contract].balance;
        var address = toAddress.toLowerCase();
        if (isEth) {
            let gasPrice = this.state.advanceOption ? this.state.custom_price * Global.GWei2Wei : Global.ETH_GAS_PRICE;
            let gasLimit = this.state.advanceOption ? this.state.custom_limit : Math.round(this.state.limit);
            if (balance * Global.ETH2Wei < gasLimit*gasPrice + amount*Global.ETH2Wei) {
                const { actions } = this.props;
                actions.toast(getString("balance_insufficient"));
                return;
            }
            txParams = {
                value: amount*Global.ETH2Wei,
                gasPrice,
                gasLimit,
                to: address,
                data: this.state.advanceOption ? this.state.custom_data : note
            }
        } else {
            let token_amount = amount;
            let rate;
            let token_info = utils.getTokenUnitFromAddress(params.contract);
            if (token_info) {
                let decimal_value = parseInt(token_info.decimal, 10)
                rate = Math.pow(10, decimal_value)
                token_amount = amount * rate;
            }
            let gasPrice = this.state.advanceOption ? this.state.custom_price * Global.GWei2Wei : Global.TOKEN_GAS_PRICE;
            let gasLimit = this.state.advanceOption ? this.state.custom_limit : Math.round(this.state.limit);
            if (balance * rate < gasPrice*gasLimit + token_amount) {
                const { actions } = this.props;
                actions.toast(getString("balance_insufficient"));
                return;
            }
            txParams = {
                value: 0,
                gasPrice,
                gasLimit,
                to: params.contract,
                data: etherutils.getTokenTransferABI(params.contract, address, token_amount, this.props.wallet.cur_wallet.address)
            }

            contractParams = {
                value: token_amount,
                to: address,
            }
        }

        /* double check the pending transaction number */
        var pendingNum = 0; //etherutils.getTransactionPendingNum(this.props.transaction, this.props.wallet.cur_wallet.address.toLowerCase());
        nonceParams = {
            pendingNum:pendingNum
        }

        actions.openUnlock({
            showSwitch: false,
            resolved: (pwd) => {
                actions.sendTransaction({
                    loading: getString("transaction_send_loading"),
                    wallet: this.props.wallet.cur_wallet,
                    pwd:pwd,
                    params: txParams,
                    contractParams,
                    nonceParams,
                    resolved: (result) => {
                        this._onCloseClicked();
                        Log.log("send transaction success");
                        actions.startUpdate();
                        this.props.navigation.goBack();
                        NativeAPI.reportSendCoin(''+1, ''+txParams.gasLimit, ''+txParams.gasPrice, ''+txParams.data, ''+this.props.wallet.cur_wallet.address, ''+txParams.to, ''+txParams.value, ''+this.state.tansfer_type);
                    },
                    rejected: (error) => {
                        if (error) {
                            Log.log("send transaction fail code:" + error.code + " data:" + error.data + " desc:" + error.toString());
                        } else {
                            Log.log("send transaction fail");
                        }
                        if (error) {
                            actions.toast(getString("transfer_error_fail") + ": " + error.toString())
                        } else {
                            actions.toast(getString("transfer_error_fail"))
                        }
                        NativeAPI.reportSendCoin(''+2, ''+txParams.gasLimit, ''+txParams.gasPrice, ''+txParams.data, ''+this.props.wallet.cur_wallet.address, ''+txParams.to, ''+txParams.value, ''+this.state.tansfer_type);
                    }
                });
            },
            rejected: (error) => {
                Log.log("password error: " + error);
                if (!error) { //error is undefined is cancel pressed
                    actions.toast(getString("transfer_error_password_error"));
                }
            }
        });
    }

    _onRightMenuPress() {
        this.props.navigation.navigate("QRReader",{
            code:0,
            callback:this._handleScanResult.bind(this),
        })
    }

    _onContactPress(){
        this.props.navigation.navigate("Contact",{callback:this._onContactSelected.bind(this)})
    }

    _onContactSelected(contact) {
        if (contact && contact.address) {
            this.setState({toAddress: contact.address})
        }
    }

    toggleAdvanceOption() {
        this.setState({
          ...this.state,
          advanceOption: !this.state.advanceOption
        });
    }

    render() {
        let isETHTransfer = this.isETH();
        return (
            <Container style={styles.container}>
                {this._confirm()}
                <MyHeader
                  backgroundColor='#33333344'
                  leftImageName="back"
                  rightImageName="scan"
                  titleName={this.state.tansfer_type+" "+getString("assets_transfer_title")}
                  withoutBottom={false}
                  rightOnPress={this._onRightMenuPress.bind(this)}
                  {...this.props}
                />
                <Form style={{marginLeft: 5, marginRight: 15, paddingTop: 6}}>
                    <Item>
                        <Image source={Global.getImage("transfer_address")} style={styles.imageIcon}/>
                        <Input placeholder={getString("assets_transfer_address")} placeholderTextColor="#D6D5D5" defaultValue={this.state.toAddress} onChangeText={(toAddress) => this.setState({toAddress})}/>
                        <Button  transparent onPress={this._onContactPress.bind(this)}>
                            <Image source={Global.getImage("my_contact")} style={{width:18, height:18,marginTop:5}}/>
                        </Button>
                    </Item>
                </Form>
                <Form style={{marginLeft: 5, marginRight: 15, paddingTop: 6}}>
                    <Item>
                        <Image source={Global.getImage("transfer_sum")} style={styles.imageIcon}/>
                        <Input keyboardType={'decimal-pad'} placeholder={getString("assets_transfer_amount")} placeholderTextColor="#D6D5D5" defaultValue={this.state.amount} onChangeText={(amount) => this.setState({amount})}/>
                    </Item>
                </Form>
                {this.state.advanceOption?
                  (<View>
                    <Form style={{marginLeft: 5, marginRight: 15, paddingTop: 6}}>
                        <Item>
                            <Input placeholder={getString("assets_transfer_gasprice")} placeholderTextColor="#D6D5D5" onChangeText={(custom_price) => this.setState({custom_price})}/>
                            <Text style={{color:'#0000008a'}}>gwei</Text>
                        </Item>
                    </Form>
                    <Form style={{marginLeft: 5, marginRight: 15, paddingTop: 6}}>
                        <Item>
                            <Input placeholder={getString("assets_transfer_gaslimit")} placeholderTextColor="#D6D5D5" onChangeText={(custom_limit) => this.setState({custom_limit})}/>
                        </Item>
                    </Form>
                    <Form style={{marginLeft: 5, marginRight: 15, paddingTop: 6}}>
                          <Item>
                            <Input
                                placeholder={getString("assets_transfer_data")}  placeholderTextColor="#D6D5D5"
                                style={styles.input} multiline={true}
                                onChangeText={(custom_data) => this.setState({custom_data})}/>
                          </Item>
                    </Form>
                </View>):(
                <View style={styles.slidercontainer}>
                    <Text style={styles.costtext}>{getString("assets_transfer_cost")}</Text>
                    <Slider
                        trackStyle={styles.track}
                        thumbStyle={styles.thumb}
                        minimumTrackTintColor={'#4bb6d4'}
                        thumbTintColor={'#4bb6d4'}
                        value={this.state.limit}
                        maximumValue={isETHTransfer? Global.ETH_GAS_LIMIT_HIGH:Global.TOKEN_GAS_LIMIT_HIGH}
                        minimumValue={isETHTransfer? Global.ETH_GAS_LIMIT_LOW:Global.TOKEN_GAS_LIMIT_LOW}
                        onValueChange={limit => this.setState({ limit })}
                    />
                    <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                        <Text style={{color:'#0000008a'}}>
                            {getString("assets_transfer_speed_slow")}
                        </Text>
                        <Text style={{color:'#0000008a'}}>
                            {(this.state.limit*(this.isETH()? Global.ETH_GAS_PRICE:Global.TOKEN_GAS_PRICE)/Global.ETH2Wei).toFixed(9)} ether
                        </Text>
                        <Text style={{color:'#0000008a'}}>
                            {getString("assets_transfer_speed_fast")}
                        </Text>
                    </View>
                </View>)
                }
                <View style={{paddingTop: this.state.advanceOption? 20:130}}>
                    <View style={{flexDirection:"row", justifyContent:'flex-end', alignItems:'center', marginRight: 20}}>
                        <Text style={styles.advancetext} onPress={() => this.toggleAdvanceOption()}>{getString("assets_transfer_advance_options")} </Text>
                        <RadioButton
                          size={10}
                          animation={'bounceIn'}
                          innerColor={Global.primaryColor}
                          outerColor={'#0000008a'}
                          isSelected={this.state.advanceOption}
                          onPress={() => this.toggleAdvanceOption()}
                        />
                    </View>
                <View style={{marginLeft: 20, marginRight: 20, paddingTop: 10, flexDirection: "row"}}>
                    <Content keyboardShouldPersistTaps='always' style={{flex: 1, backgroundColor: "#08c0d4"}}>
                        <Button iconLeft bordered style={styles.button} onPress={this._onTrnasferPress.bind(this)}>
                            <Text uppercase={false} style={styles.text2}>
                                {getString("assets_transfer_next_action")}
                            </Text>
                        </Button>
                    </Content>
                </View>
                </View>
            </Container>
        );
    }

    _onCloseClicked(){
        this.setState({showConfirm:false});
    }
    _confirm() {
        let gasPrice = this.state.advanceOption ? this.state.custom_price * Global.GWei2Wei : Global.TOKEN_GAS_PRICE;
        let gasLimit = this.state.advanceOption ? this.state.custom_limit : Math.round(this.state.limit);
        return (
            <Modal
                animationType="slide"
                transparent={true}
                style={{flex: 1}}
                visible={this.state.showConfirm}
                onRequestClose={() => this._onCloseClicked()}>
                <View
                    style={{flex: 1,paddingTop:deviceHeight-400,
                        backgroundColor: 'rgba(0.1,0.1,0.1,0.5)'}}>
                    <View style={styles.confirm_container}>
                        <View style={{flexDirection: 'row', margin: 15}}>
                            <TouchableOpacity onPress={_ => this._onCloseClicked()}>
                                <Image source={Global.getImage("close")} style={styles.close} />
                            </TouchableOpacity>
                            <View style={{flexDirection: 'row', justifyContent: 'center', flex: 1, marginRight: 30}}>
                                <Text style={{alignSelf: 'center',color: "rgba(0,0,0,0.87)", fontSize: 16}}>{getString("confirm_payment_details")}</Text>
                            </View>
                        </View>
                        <View style={styles.line}/>
                        <View style={styles.item}>
                            <Text numberOfLines={1} style={styles.item_hint}>{getString("confirm_details")}</Text>
                            <Text style={styles.item_value}>{getString("confirm_transfer")}</Text>
                        </View>
                        <View style={styles.line}/>
                        <View style={styles.item}>
                            <Text numberOfLines={1} style={styles.item_hint}>{getString("confirm_to_address")}</Text>
                            <Text style={styles.item_value}>{etherutils.toChecksumAddress(this.state.toAddress)}</Text>
                        </View>
                        <View style={styles.line}/>
                        <View style={styles.item}>
                            <Text numberOfLines={1} style={styles.item_hint}>{getString("confirm_pay_wallet")}</Text>
                            <Text numberOfLines={1} ellipsizeMode={'middle'}  style={styles.item_value}>{etherutils.toChecksumAddress(this.props.wallet.cur_wallet.address)}</Text>
                        </View>
                        <View style={styles.line}/>
                        <View style={styles.item}>
                            <Text numberOfLines={1} style={styles.item_hint}>{getString("assets_transfer_cost")}</Text>

                            <Text style={styles.item_right_value}>  {(gasLimit*gasPrice/Global.ETH2Wei).toFixed(9)} ether</Text>
                        </View>
                        <View style={styles.line}/>
                        <View style={styles.item}>
                            <Text numberOfLines={1} style={styles.item_hint}>{getString("confirm_amount")}</Text>
                            <Text style={styles.item_right_value}>{this.state.amount} {this.state.unit}</Text>
                        </View>
                        <View  style={styles.line}/>
                        <View style={{paddingTop: 18, flexDirection: "row", justifyContent: "center"}}>
                            <Button style={{
                                marginLeft:18,
                                marginRight:18,
                                marginBottom:18,
                                flex:1,
                                elevation: 0,
                                backgroundColor: 'rgb(40, 217, 227)',
                                flexDirection: "row",
                                justifyContent: "center"
                            }} onPress={this._onConfirmPress.bind(this)}>
                                <Text  uppercase={false} style={{color:"#ffffff",fontSize: 14}}>{getString("dialog_default_rightbutton")}</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    slidercontainer: {
        marginTop: 20,
        marginLeft: 22,
        marginRight: 10,
        alignItems: "stretch",
        justifyContent: "center"
    },
    input: {
        height: 100,
        borderWidth: 1,
        textAlignVertical: 'top',
        borderColor: "#D6D5D5",
        color: Global.primaryContentColor,
        fontSize: 14,
    },
    container: {
        flex: 1,
        backgroundColor:"#ffffff"
    },
    confirm_container:{
        width:deviceWidth,
        height:deviceHeight,
        backgroundColor: "#FEFEFE",
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
        marginBottom: 7,
        color: "#ffffffde"
    },
    text2: {
        color: "#FFFFFF",
        textAlign: 'center',
        fontSize: 14,
    },
    button: {
        flexDirection: "row",
        alignSelf: 'stretch',
        justifyContent: 'center',
        marginTop: 1,
        marginBottom: 1,
        borderWidth: 0,
        borderColor: '#ffffff',
    },
    textcolor: {
        alignSelf: "center",
        marginBottom: 7,
        color: "#ffffff8A"
    },
    qr_img: {
        width: deviceWidth/1.5,
        height: deviceWidth/1.5,
    },
    main_content: {
        width: deviceWidth/1.2
    },
    imageIcon: {
        width: 20,
        height: 20
    },
    costtext: {
        fontSize: 17,
        color: '#0000008a',
        textAlign: 'left'
    },
    advancetext: {
        fontSize: 17,
        color: '#0000008a',
        textAlign: 'right',
        marginRight: 6
    },
    close: {
        width: 18,
        height: 18,
        padding:5,
        marginTop: 3,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'flex-end',
        paddingLeft: 20,
        paddingRight:20,
        paddingTop:20,
        paddingBottom:8,
    },
    item_hint: {
        textAlign: 'left',
        color: 'rgba(0,0,0,0.54)',
        alignSelf:"flex-end",
        fontSize: 13,
    },
    item_value:{
        flex:1,
        alignSelf: "flex-end",
        marginLeft:15,
        fontSize: 13,
        color: 'rgba(0,0,0,0.87)',
        justifyContent: 'center',
    },
    item_right_value:{
        flex:1,
        alignSelf: "flex-end",
        textAlign:"right",
        marginLeft:15,
        color: 'rgba(0,0,0,0.87)',
        fontSize: 13,
        justifyContent: 'center',
    },
    line: {backgroundColor: "rgba(0,0,0,0.16)", marginLeft: 18, height: 0.5, marginRight: 18},
    track: {
        height: 2,
        borderRadius: 1,
    },
    thumb: {
        width: 16,
        height: 16,
    }
});

export const WrappedComponent = Assets_cointransfer;

export function mapStateToProps(state) {
    return {
        wallet: state.wallet
    }
}
