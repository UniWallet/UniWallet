import Platform from 'react';
import React, {Component} from 'react';
import zxcvbn from 'zxcvbn';
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
    Switch
} from 'native-base';

import getString from "../../translations";
import MyHeader from "../common/MyHeader";

import Global from "../common/Global";
import * as Log from "../../libs/Log"
import * as Validation from "../../libs/validation"

var NativeAPI = require('react-native').NativeModules.YiYaNativeAPI;
import {getTimestampInMilliSecond} from "../../libs/utils";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const name_img = require("./img/CREDIT-CARD.png");
const password_img = require("./img/UNLOCK.png");
const password2_img = require("./img/LOCK.png");
const tip_img = require("./img/SPEECH-4.png");
const st = [
    {
        label: 'pwd_weak',
        labelColor: '#fe6c6c',
        icon: "setUp_strong00"
    },
    {
        label: 'pwd_common',
        labelColor: '#ffaabb',
        icon: "setUp_strong01"
    },
    {
        label: 'pwd_good',
        labelColor: '#feb466',
        icon: "setUp_strong02"
    },
    {
        label: 'pwd_very_good',
        labelColor: '#feb466',
        icon: "setUp_strong03"
    },
    {
        label: 'pwd_prefect',
        labelColor: '#52E4E6',
        icon: "setUp_strong04"
    }
];
export default class WalletCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            password: '',
            password2: '',
            tips: '',
            pwdHintShow: false,
            pwdLevelShow: false,
            pwdLevelImgName: st[0].icon,
            pwdLevelHint: st[0].label,
            pwdLevelColor: st[0].labelColor,
        };
    }

    _onCreatePress() {
        let { name, password, password2, tips } = this.state;
        const { actions } = this.props;
        let start = getTimestampInMilliSecond();
        if (!Validation.checkWalletName(name)) {
            return actions.toast(getString("invalid_wallet_name"));
        }
        if (password == "") {
            return actions.toast(getString("unlock_password_isempty"));
        }
        if (password2 == "") {
            return actions.toast(getString("unlock_rpassword_isempty"));
        }
        password = password.trim();
        password2 = password2.trim();
        if (password.length < 8) {
            return actions.toast(getString("create_wallet_pwd_warning"));
        }
        if (password != password2) {
            return actions.toast(getString("different_pwd"));
        }
        // actions.toast(getString("create_wallet_in_progress"));

        // Global.showLoading(getString("wallet_create_loading"));
        actions.createWallet({
            name: this.state.name,
            pwd: this.state.password,
            loading:getString("wallet_create_loading"),
            resolved: (result)=> { //create ok
                Log.log("create wallet: " + this.state.name + " successfully")
                Global.resetToPages(this, [
                    {
                        routeName: "Drawer",
                    }, {
                        routeName: "WalletCreateSuccess",
                        params: {
                            name: this.state.name
                        },
                    }
                ]);
                // Global.hideLoading();
                // this.props.navigation.navigate("WalletCreateSuccess", {'name':this.state.name});
                NativeAPI.reportNewWallet(((getTimestampInMilliSecond()-start)/1000).toString(), ''+1, result.address);
            },
            rejected: () => {
                // Global.hideLoading();
                NativeAPI.reportNewWallet(((getTimestampInMilliSecond()-start)/1000).toString(), ''+2, this.state.name);
            }
        });
    }

    _onChangePassword(password, isValid) {
        if (password) {
            var s = zxcvbn(password).score;
            Log.log("=======================s:" + s)
            this.setState({password: password})
            this.setState({
                pwdHintShow: true,
                pwdLevelShow: true,
                pwdLevelImgName: st[s].icon,
                pwdLevelHint: st[s].label,
                pwdLevelColor: st[s].labelColor,
            })
        } else {
            this.setState({
                pwdHintShow: false,
                pwdLevelShow: false,
            })
        }
    }

    _testScore(str) {
        return zxcvbn(str).score;
    }

    render() {
        return (
            <Container style={styles.container}>

                <View>
                    <MyHeader
                        titleColor='#000000de'
                        actionBarBgColor="transparent"
                        leftImageName="back"
                        titleName={getString("create_wallet")}
                        backgroundColor={Global.primaryColor}
                        {...this.props}
                    />
                    <Form style={{marginLeft: 5, marginRight: 15, paddingTop: 32}}>
                        <Item>
                            <Image source={name_img} style={styles.imageIcon}/>
                            <Input placeholder={getString("create_wallet_name")} placeholderTextColor="#D6D5D5"
                                   onChangeText={(name) => this.setState({name})}
                                   style={styles.inputtext}/>
                        </Item>
                    </Form>
                    <Form style={{marginLeft: 5, marginRight: 15, paddingTop: 16}}>
                        <Item>
                            <Image source={password_img} style={styles.imageIcon}/>
                            <Input secureTextEntry={true} placeholder={getString("create_wallet_passwd")}
                                   placeholderTextColor="#D6D5D5"
                                   onChangeText={(password) => this._onChangePassword(password)}
                                   style={styles.inputtext}/>
                            {this.state.pwdLevelShow ?
                                <View style={{flexDirection: "row"}}>
                                    <Text style={{
                                        textAlign: 'center',
                                        fontSize: 13,
                                        marginRight: 3,
                                        color: this.state.pwdLevelColor,
                                    }}>{getString(this.state.pwdLevelHint)}</Text>
                                    <Image source={Global.getImage(this.state.pwdLevelImgName)}
                                           style={styles.pwdHintIcon}/>
                                </View> : null}
                        </Item>
                    </Form>
                    {this.state.pwdHintShow ?
                        <Text style={styles.hint_password}>{getString("pwd_hint")}</Text> : null}
                    <Form style={{marginLeft: 5, marginRight: 15, paddingTop: 16}}>
                        <Item>
                            <Image source={password2_img} style={styles.imageIcon}/>
                            <Input secureTextEntry={true} placeholder={getString("create_wallet_passwd2")}
                                   placeholderTextColor="#D6D5D5"
                                   onChangeText={(password2) => this.setState({password2})}
                                   style={styles.inputtext}/>
                        </Item>
                    </Form>
                    <View style={{paddingTop: 45, flexDirection: "row", justifyContent: "center"}}>
                        <Button style={{
                            width: 320,
                            elevation: 0,
                            backgroundColor: 'rgb(40, 217, 227)',
                            flexDirection: "row",
                            justifyContent: "center"
                        }} onPress={this._onCreatePress.bind(this)}>
                            <Text uppercase={false} style={{fontSize: 16}}>{getString("create_wallet")}</Text>
                        </Button>
                    </View>
                    <View style={{paddingTop: 19, flexDirection: "row", justifyContent: "center"}}>
                        <Button onPress={() => this.props.navigation.navigate('Import', {'routeName':'Drawer'})} style={{
                            width: 320,
                            elevation: 0,
                            backgroundColor: 'rgba(0,0,0,0.16)',
                            borderWidth: 0,
                            flexDirection: "row",
                            justifyContent: "center"
                        }}>
                            <Text uppercase={false} style={{fontSize: 16}}>{getString("import_wallet")}</Text>
                        </Button>
                    </View>
                </View>
                <View>
                    <Image style={{width: deviceWidth, height: 5}} source={Global.getImage("setUp_bottom_row")}/>
                    <Text style={{
                        backgroundColor: '#B2B2B2',
                        color: "#ffffff",
                        paddingLeft: 15,
                        paddingRight: 15,
                        paddingBottom: 15,
                        paddingTop: 8,
                        fontSize: 12
                    }}>{getString("hint_wallet_backup")}</Text>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-between",
        backgroundColor: "#ffffff"
    },
    imageIcon: {
        width: 20,
        height: 20
    },
    inputtext: {
        textAlign: 'left',
        fontSize: 15,
        marginLeft: 10,
    },
    pwdHintIcon: {
        width: 20,
        height: 20,
        resizeMode: "contain"
    },
    hint_password: {
        marginTop: 10,
        textAlign: 'center',
        fontSize: 13,
        color: 'rgb(40, 217, 227)',
    },
    hint_password_state: {
        textAlign: 'center',
        fontSize: 13,
        color: 'rgb(40, 217, 227)',
    },
    // inputLabel: {
    //     color: 'blue',
    //     fontSize: 14,
    //     backgroundColor: 'red',
    //     width:100,
    //     fontWeight: '600'
    // },
    // textInputWrapper: {
    //     flexDirection: 'row',
    //     justifyContent: 'center',
    //     backgroundColor: 'black',
    //     borderBottomWidth: 0.3,
    //     borderColor: 'rgba(242, 242, 242, 0.5)'
    // },
});

export const WrappedComponent = WalletCreate;

export function mapStateToProps(state) {
    return {
        //wallet: state.wallet,
        //UI: state.walletUI
    }
}