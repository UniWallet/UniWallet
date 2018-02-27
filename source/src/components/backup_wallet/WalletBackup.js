import Platform from 'react';
import React, {Component} from 'react';
import {Dimensions, Image, StatusBar, StyleSheet, TextInput, View, ScrollView, Clipboard, Alert} from 'react-native';
import * as etherutils from '../../libs/etherutils';
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
    IconNB,
    Form, Item, Input,
    Switch
} from 'native-base';

import getString from "../../translations";
import MyHeader from "../common/MyHeader";

import Global from "../common/Global";
import * as Log from "../../libs/Log"

import * as WalletUtils from "../common/wallet_utils/wallet_utils"

import Share, {ShareSheet} from 'react-native-share';
import * as Validation from "../../libs/validation"

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default class WalletBackup extends Component {
    constructor(props) {
        super(props);
        this.state = {WalletName: "", WalletNameChanged: false}
    }

    _onSharePress() {
        var wallet = this.props.navigation.state.params.wallet;
        if (!wallet.isBackup) {
            Alert.alert(getString('backup_dialog_hint_title'), getString('backup_dialog_hint_content'), [
                {text: getString('backup_dialog_hint_confirm'), onPress: () => this._backupWallet()}
            ])
        } else {
            this._backupWallet();
        }
    }

    _backupWallet() {
        const {actions} = this.props;
        var wallet = this.props.navigation.state.params.wallet;
        var wallet_name = wallet.name
        Log.log("try to share: " + wallet_name);
        if (wallet_name) {
            var address = wallet.address;
            actions.openUnlock({
                showSwitch: false,
                resolved: (pwd) => {
                    actions.decryptWallet({
                        loading: getString("wallet_export_loading"),
                        wallet: JSON.stringify(wallet.keystore),
                        pwd,
                        resolved: () => {
                            this._toSetBackupState(address, true);
                            let shareOptions = {
                                title: wallet_name,
                                message: JSON.stringify(wallet.keystore)
                            };
                            Share.open(shareOptions)
                        },
                        rejected: () => actions.toast(getString("backup_wallet_password_wrong"))
                    });
                }
            });
        }
    }

    _onDeletePress() {
        const {actions} = this.props;
        var wallet = this.props.navigation.state.params.wallet;
        Log.log("try to delete: " + wallet_name)
        if (wallet.keystore) {
            actions.openUnlock({
                showSwitch: false,
                resolved: (pwd) => {
                    actions.decryptWallet({
                        loading: getString("wallet_delete_loading"),
                        wallet: JSON.stringify(wallet.keystore),
                        pwd,
                        resolved: () => {
                            actions.removeWallet({
                                wallet: wallet,
                                resolved: () => {
                                    if (this.props.wallet.cur_wallet) {
                                        this.props.navigation.goBack();
                                    } else {
                                        Global.resetToPage(this, "Main");
                                    }
                                    Log.log("remove wallet success");
                                },
                                rejected: () => {
                                }
                            });
                        },
                        rejected: () => actions.toast(getString("backup_wallet_password_wrong"))
                    });
                }
            });
        }
    }

    _onWalletNameChanged(value) {
        this.setState({WalletNameChanged: true, WalletName: value});
    }

    _toSetBackupState(address, isBackup) {
        const {actions} = this.props;
        if (!address) {
            return
        }
        actions.setWalletBackup({
            address: address,
            isBackup: isBackup,
            resolved: () => {
                // actions.toast(getString("backup_ok_hint"));
            },
            rejected: () => {
                Log.log("change wallet name error");
            }
        });
    }

    _onCopyPress(address) {
        const {actions} = this.props;
        Clipboard.setString(address);
        actions.toast(getString("assets_qrcode_copy_ok"));
    };

    _save() {
        const {actions} = this.props;
        var wallet = this.props.navigation.state.params.wallet;
        var wallet_name = wallet.name;
        var address = wallet.address;
        var name = this.state.WalletName;
        if (!Validation.checkWalletName(name)) {
            return actions.toast(getString("invalid_wallet_name"));
        }
        if (name&&wallet_name&&(wallet_name==name)) {
            this.props.navigation.goBack();
            return
        }
        if(WalletUtils.hasWalletNameReady(this.props.wallet,name)){
            return actions.toast(getString("wallet_name_already_exist"));
        }
        actions.changeWalletName({
            name: name,
            address: address,
            resolved: () => {
                this.props.navigation.goBack();
            },
            rejected: () => {
                Log.log("change wallet name error");
            }
        });
    }

    render() {
        var wallet = this.props.navigation.state.params.wallet;
        if (!wallet) {
            Log.log("empty");
            return null;
        }
        return (
            <View style={styles.container}>
                <Image source={Global.getImage("copy_top_bg")} style={styles.backgroundImage}>
                    <MyHeader
                        rightText={this.state.WalletNameChanged ? getString("save") : ""}
                        titleColor='#fff'
                        rightTextColor='#fff'
                        actionBarBgColor="transparent"
                        leftImageName='header_back_white'
                        titleName={this.props.navigation.state.params.wallet.name}
                        backgroundColor="transparent"
                        withoutBottom={true}
                        rightOnPress={() => this._save()}
                        {...this.props}
                    />

                    <View style={{
                        alignItems: "center",
                        marginBottom: 27,
                        marginTop: 15,
                        backgroundColor: "transparent",
                    }}>
                        <Image source={Global.getImage("head_management")} style={{width: 55, height: 55}}/>
                        <H3 style={styles.textcolor}>{etherutils.formatBalance(wallet.balance ? wallet.balance : 0, 4)}
                            ether</H3>
                        <Text numberOfLines={1} ellipsizeMode={'middle'}
                              style={styles.address}>{etherutils.toChecksumAddress(wallet.address)}</Text>
                    </View>
                </Image>
                <ScrollView>
                    <View style={{
                        flexDirection: "row",
                        marginTop: 20,
                        paddingBottom: 20,
                        marginBottom: 10,
                    }}>
                        <View style={{alignItems: "center", marginLeft: 20, height: 50, justifyContent: 'center'}}>
                            <Text style={{
                                marginTop: 0,
                                paddingTop: 0,
                                paddingBottom: 0,
                                marginBottom: 0,
                                fontSize: 18,
                                color: Global.primaryContentColor,
                                textAlign: "left",
                                marginLeft: 25,
                            }}>{getString("backup_wallet_name")}</Text>
                        </View>

                        <Form style={{width: 200}}>
                            <Item>
                                <Input style={{
                                    fontSize: 18,
                                    color: Global.primaryContentColor,
                                }}
                                       defaultValue={this.props.navigation.state.params.wallet.name}
                                       onChangeText={(name) => this._onWalletNameChanged(name)}/>
                            </Item>
                        </Form>
                    </View>
                    <View style={{paddingTop: 20, flexDirection: "row", justifyContent: "center"}}>
                        <Button style={{
                            width: 320,
                            elevation: 0, alignItems: 'center',
                            backgroundColor: "rgb(40,217,227)",
                            flexDirection: "row",
                            justifyContent: "center"
                        }} onPress={this._onSharePress.bind(this)}>
                            <Text uppercase={false}
                                  style={styles.text}>{getString("backup_wallet_button_tokeystore")}</Text>
                        </Button>
                    </View>
                    <View style={{paddingTop: 20, flexDirection: "row", justifyContent: "center"}}>
                        <Button style={{
                            width: 320,
                            elevation: 0, alignItems: 'center',
                            backgroundColor: "rgb(40,217,227)",
                            flexDirection: "row",
                            justifyContent: "center"
                        }} onPress={() => this._onCopyPress(wallet.address)}>
                            <Text uppercase={false} style={styles.text}>{getString("wallet_address_copy")}</Text>
                        </Button>
                    </View>
                    <View style={{paddingTop: 20, flexDirection: "row", justifyContent: "center"}}>
                        <Button style={{
                            width: 320,
                            elevation: 0, alignItems: 'center',
                            backgroundColor: "rgba(0,0,0,0.16)",
                            flexDirection: "row",
                            justifyContent: "center"
                        }} onPress={this._onDeletePress.bind(this)}>
                            <Text uppercase={false}
                                  style={styles.text}>{getString("backup_wallet_button_delete")}</Text>
                        </Button>
                    </View>
                </ScrollView>
            </View>


        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },

    backgroundImage: {
        height: deviceHeight * 0.45,
        width: deviceWidth,
        resizeMode: "stretch",
    },
    address: {
        color: "white",
        textAlign: 'right',
        fontSize: 16,
        paddingTop: 5,
        width: deviceWidth / 1.5
    },
    text: {
        color: "white",
        textAlign: 'center',
        fontSize: 16,
        width: deviceWidth / 1.5
    },
    textcolor: {
        color: "white",
        textAlign: 'center',
        fontSize: 30,
        paddingTop: 15,
    },
    content: {
        flex: 1,
    },
});


export const WrappedComponent = WalletBackup;

export function mapStateToProps(state) {
    return {
        wallet: state.wallet,
    }
}