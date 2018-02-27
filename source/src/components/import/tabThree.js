import React, {Component} from 'react';
import {StatusBar, Image, StyleSheet, View, Dimensions, Picker} from 'react-native';

import {Container, Content, Form, Item, InputGroup, Input, Text, Button} from 'native-base';
import Global from "../common/Global"
import * as importTypes from '../../redux/constants/WalletImportType';
import getString from "../../translations/index";
import * as Validation from "../../libs/validation"
import zxcvbn from 'zxcvbn';

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
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
export default class TabTwo extends Component {
    // eslint-disable-line
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            pwd: '',
            rpwd: '',
            pwdHintShow: false,
            pwdLevelShow: false,
            pwdLevelImgName: st[0].icon,
            pwdLevelHint: st[0].label,
            pwdLevelColor: st[0].labelColor,
        };
    }

    _onPress() {
        console.debug("import private key start...")
        if (this.props.onCommit) {
            const {actions} = this.props;
            if (!Validation.checkPrivateKey(this.state.input)) {
                actions.toast(getString("invalid_privatekey"));
                return
            }
            if (this.state.pwd == "") {
                actions.toast(getString("unlock_password_isempty"));
                return;
            }
            if (this.state.rpwd == "") {
                actions.toast(getString("unlock_rpassword_isempty"));
                return;
            }
            if (this.state.pwd !== this.state.rpwd) {
                actions.toast(getString("different_pwd"))
                return;
            }
            this.props.onCommit({
                rpwdCheck: true,
                input: this.state.input,
                pwd: this.state.pwd,
                rpwd: this.state.rpwd,
                type: importTypes.IMPORT_PRIVATE_KEY,
            });
        }
    }

    _jumpToUrl(title, url) {
        if (this.props.jumpToUrl) {
            this.props.jumpToUrl(title, url)
        }
    }
    _testScore(str) {
        return zxcvbn(str).score;
    }
    _onChangePassword(password, isValid) {
        if (password) {
            var s = zxcvbn(password).score;
            this.setState({pwd: password})
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

    render() {
        // var _input=this.props.input?this.props.input:"";
        // this.setState({input:_input});
        // eslint-disable-line
        return (
            <Container style={styles.container} keyboardShouldPersistTaps='always'>
                <View>
                    <Form style={{
                        marginLeft: 5, marginRight: 15,
                    }}>
                        <Item  style={{margin:0,padding:0}}>
                            <Input
                                defaultValue={this.props.scanData}
                                placeholderTextColor={"#b4b4b4"} style={{
                                height: 90,
                                marginTop: 20,
                                paddingLeft: 11,
                                paddingRight: 11,
                                borderWidth: 1,
                                textAlignVertical: 'top',
                                borderColor: "#D1D1D1",
                                color: Global.primaryContentColor,
                                fontSize: 14,
                            }} multiline={true} placeholder={getString("private_key")}
                                onChangeText={(input) => this.setState({input})}/>
                        </Item>
                    </Form>
                    <Form style={styles.form}>
                        <Item>
                            <Input secureTextEntry={true} password={true} placeholderTextColor={"#b4b4b4"}
                                   style={styles.input} placeholder={getString("create_wallet_passwd")}
                                   onChangeText={(password) => this._onChangePassword(password)}/>
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
                    <Form style={styles.form}>
                        <Item>
                            <Input secureTextEntry={true} password={true} placeholderTextColor={"#b4b4b4"}
                                   style={styles.input} placeholder={getString("create_wallet_passwd2")}
                                   onChangeText={(rpwd) => this.setState({rpwd})}/>
                        </Item>
                    </Form>
                    <View style={{flex: 1, flexDirection: "row", alignSelf: 'stretch', marginTop: 20}}>
                        <Button bordered style={styles.button} onPress={this._onPress.bind(this)}>
                            <Text uppercase={false} style={styles.text}>
                                {getString("import_start")}
                            </Text>
                        </Button>
                    </View>
                    <Text style={{
                        color: Global.primaryColor,
                        textAlign: 'center',
                        marginTop: 70,
                        fontSize: 14,
                    }} onPress={() => this._jumpToUrl("PrivateKey", "http://static.yiya.io/what_is_private_key.html")}>
                        {getString("hint_what_is_private_key")}
                    </Text>
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
    form: {
        marginLeft: 5, marginRight: 15
    },
    container: {
        flex: 1,
        justifyContent: "space-between",
    },
    input: {
        color: Global.primaryContentColor,
        fontSize: 14,
    },

    button: {
        flex: 1,
        flexDirection: "row",
        alignSelf: 'stretch',
        justifyContent: 'center',
        marginTop: 11,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 4,
        borderWidth: 1,
        backgroundColor: Global.primaryColor,
        borderColor: '#ffffff',
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
        marginLeft:5,
        color: 'rgb(40, 217, 227)',
    },
    hint_password_state: {
        textAlign: 'center',
        fontSize: 13,
        color: 'rgb(40, 217, 227)',
    },
    text: {
        color: "#FFFFFF",
        textAlign: 'center',
        fontSize: 15,
    },
});
