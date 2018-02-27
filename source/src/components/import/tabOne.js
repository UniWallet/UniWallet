import React, {Component} from 'react';
import {StatusBar, StyleSheet, View, Dimensions} from 'react-native';

import {Container, Content, Form, Item, InputGroup, Input, Text, Button} from 'native-base';
import Global from "../common/Global"
import * as importTypes from '../../redux/constants/WalletImportType';
import getString from "../../translations/index";
import * as Validation from "../../libs/validation"

class TabOne extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            pwd: '',
        };
    }

    _onPress() {
        if (this.props.onCommit) {
            const {actions} = this.props;
            if (!Validation.checkKeystore(this.state.input)) {
                actions.toast(getString("invalid_keystore"));
                return
            }
            if (this.state.pwd == "") {
                actions.toast(getString("unlock_password_isempty"));
                return;
            }
            this.props.onCommit({
                input: this.state.input,
                pwd: this.state.pwd,
                type: importTypes.IMPORT_KEY_STORE,
            });
        }
    }

    _jumpToUrl(title, url) {
        if (this.props.jumpToUrl) {
            this.props.jumpToUrl(title, url)
        }
    }

    render() {
        // this.setState({input:_input});
        return (
            <Content keyboardShouldPersistTaps='always'>
                <Text style={styles.guild}>{getString("official_wallet_introduction")}</Text>
                <Input
                    placeholderTextColor={"#b4b4b4"}
                    defaultValue={this.props.scanData}
                    style={styles.input} multiline={true} placeholder={getString("keystore_content")}
                    onChangeText={(input) => this.setState({input})}/>
                <Form style={{marginLeft: 5, marginRight: 15}}>
                    <Item>
                        <Input
                            secureTextEntry={true}
                            placeholderTextColor={"#b4b4b4"}
                            style={styles.text} placeholder={getString("keystore_key")}
                            onChangeText={(pwd) => this.setState({pwd})}/>
                    </Item>
                </Form>
                <View style={{flex: 1, flexDirection: "row", alignSelf: 'stretch', marginTop: 20}}>
                    <Button bordered style={styles.button} onPress={this._onPress.bind(this)}>
                        <Text uppercase={false}  style={{color: "white", fontSize: 15}}>
                            {getString("import_start")}
                        </Text>
                    </Button>
                </View>
                <Text  style={{
                    color: Global.primaryColor,
                    textAlign: 'center',
                    marginTop: 15,
                    fontSize: 14,
                }} onPress={() => this._jumpToUrl("keystore", "http://static.yiya.io/what_is_token.html")}>
                    {getString("hint_what_is_keystore")}
                </Text>
            </Content>
        );
    }
}

const styles = StyleSheet.create({
    guild: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
        marginLeft: 23,
        marginRight: 15,
        color: Global.primaryContentColor,
        fontSize: 15
    },
    input: {
        height: 120,
        paddingLeft: 11,
        marginTop: 30,
        marginBottom: 5,
        marginLeft: 20,
        marginRight: 20,
        borderWidth: 1,
        textAlignVertical: 'top',
        borderColor: "#D6D5D5",
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
        height: 43,
        borderRadius: 3,
        borderWidth: 1,
        backgroundColor: Global.primaryColor,
        borderColor: '#ffffff',
    },

    text: {
        color: "#D6D5D5",
        textAlign: 'left',
        fontSize: 14,
    },
});

export default TabOne;