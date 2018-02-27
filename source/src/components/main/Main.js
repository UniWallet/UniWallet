/**
 * CoinWallet React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from 'react';
import {Dimensions, Image, StatusBar, StyleSheet, View} from 'react-native';

import {Button, CheckBox, Container, Content, Header, ListItem, Text} from 'native-base';

import getString from "../../translations";
import * as Log from "../../libs/Log";
import * as Global from "../common/Global";

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkbox: true,
        };
    }

    _importWallet() {
        if(this._checkAgreeTerms()) {
            Log.log("import wallet");
            //Can't use resetToPages(drawer, import)
            //because drawer will go back to main when wallets is empty
            this.props.navigation.navigate('Import',
                {
                    routeName: "Drawer",
                });
        }
    }

    _checkAgreeTerms(){
        const { actions } = this.props;
        if(!this.state.checkbox){
            actions.toast(getString("accept_terms"));
            return false;
        }
        return true;
    }
    _createWallet() {
        if(this._checkAgreeTerms()){
            Log.log("WalletCreate");
            this.props.navigation.navigate('WalletCreate');
        }
    }

    render() {
        return (
            <Image source={require('./bg.png')} style={styles.backgroundImage}>
                <StatusBar
                    backgroundColor='#00000000'
                    translucent={true}
                    hidden={false}
                    animated={true}
                />
                <View style={styles.container}>

                    <View style={{flexDirection: "row", justifyContent: "center", marginTop:20}}>
                        <Image style={styles.logo}
                               source={require('./logo.png')}
                        />
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "center"}}>

                        <Button bordered style={styles.button} onPress={this._createWallet.bind(this)}>
                            <Text uppercase={false} style={styles.text}>
                                {getString("create_wallet")}
                            </Text>
                        </Button>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "center", marginTop:10}}>

                        <Button bordered style={styles.button} onPress={this._importWallet.bind(this)}>
                            <Text uppercase={false} style={styles.text}>
                                {getString("import_wallet")}
                            </Text>
                        </Button>
                    </View>

                    <View style={{flex:1, flexDirection: "column", justifyContent: "flex-end"}}>
                        <View style={{flexDirection: "row", justifyContent: "center", marginBottom: 50}}>
                            <CheckBox  onPress={()=>{this.setState({checkbox:!this.state.checkbox})}} checked={this.state.checkbox}/>
                            <Text style={{
                                fontSize: 14,
                                marginLeft: 20,
                                color: "#ffffff"
                            }}>
                                {getString("agree_terms")}
                            </Text>
                            <Text style={{
                                marginRight: 12,
                                textAlign: 'center',
                                fontSize: 14,
                                color: "#44C0CD"
                            }} onPress={() => this.props.navigation.navigate('SimpleBrowser', {
                                url: "http://static.yiya.io/term_of_service.html",
                                title:getString("protocol"),
                                refresh: false,
                                share: false,
                            })}>{getString("term_of_service")}</Text>
                        </View>
                    </View>
                </View>
            </Image>
        );
    }
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width:null,
        width:null,
        resizeMode:"stretch",
    },
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    logo: {
        width: 85,
        height: 100,
        marginTop: 140,
        marginBottom: 48,
        justifyContent: 'center',
    },
    button: {
        width: 240,
        height: 48,
        marginTop: 11,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        backgroundColor: '#00000000',
        borderColor: '#ffffff',
    },
    text: {
        width: 240,
        fontSize: 16,
        textAlign: 'center',
        color: '#FFFFFF'
    },
});

export const WrappedComponent = Main;