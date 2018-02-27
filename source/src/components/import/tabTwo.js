import React, { Component } from 'react';
import {StatusBar, StyleSheet, View, Dimensions, Picker} from 'react-native';

import { Container,Content, Form, Item, InputGroup, Input, Text, Button} from 'native-base';
import Global from "../common/Global"
import getString from "../../translations/index";

export default class TabTwo extends Component {
    // eslint-disable-line

    render() {
        // eslint-disable-line
        return (
        <Content keyboardShouldPersistTaps='always'>
            <Input style={{
                height: 90,
                marginTop: 20,
                marginBottom: 5,
                marginLeft: 20,
                paddingLeft: 11,
                marginRight: 20,
                borderWidth: 1,
                textAlignVertical: 'top',
                borderColor: "#D1D1D1",
                color: Global.primaryContentColor,
                fontSize: 14,
            }} multiline={true} placeholder={getString("hint_mnemonic_word_split_by_space")}/>
            <Form style={{marginLeft: 20, marginRight: 15}}>
                <Picker
                style={{color: Global.primaryContentColor}}
                mode="dropdown"
                headerStyle={{backgroundColor: "#b95dd3"}}
                headerBackButtonTextStyle={{color: "#ffffff"}}
                headerTitleStyle={{color: "#ffffff"}}
                selectedValue={"key0"}>
                    <Item label="m/44/60/0/0" value="key0"/>
                    <Item label="ATM Card" value="key1"/>
                    <Item label="Debit Card" value="key2"/>
                    <Item label="Credit Card" value="key3"/>
                    <Item label="Net Banking" value="key4"/>
                </Picker>
            </Form>
            <Form style={styles.form}>
                <Item>
                    <Input style={styles.input} placeholder={getString("create_wallet_passwd")}/>
                </Item>
            </Form>
            <Form style={styles.form}>
                <Item>
                    <Input style={styles.input} placeholder={getString("create_wallet_passwd2")}/>
                </Item>
            </Form>
            <Form style={styles.form}>
                <Item>
                    <Input style={styles.input} placeholder={getString("hint_pwd")}/>
                </Item>
            </Form>
            <View style={{flex: 1, flexDirection: "row", alignSelf: 'stretch', marginTop: 20}}>
                <Button bordered style={styles.button}>
                    <Text style={styles.text}>
                        {getString("import_start")}
                    </Text>
                </Button>
            </View>
            <Text style={{
                color: Global.primaryColor,
                textAlign: 'center',
                marginTop: 11,
                fontSize: 14,
            }}>
                {getString("hint_what_is_mnemonic_word")}
            </Text>
        </Content>
        );
    }
}

const styles = StyleSheet.create({
    form: {
        marginLeft: 10,
        marginRight: 15,
        color:Global.primaryContentColor,
    },

    input: {
        color:Global.primaryContentColor,
        fontSize:14,
    },

    button: {
        flex:1,
        flexDirection: "row",
        alignSelf: 'stretch',
        justifyContent: 'center',
        marginTop: 11,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 6,
        borderWidth: 1,
        backgroundColor: Global.primaryColor,
        borderColor: '#ffffff',
    },

    text: {
        color:"#FFFFFF",
        textAlign:'center',
        fontSize: 14,
    },
});
