import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    StatusBar,
    Image,
    NativeModules,
    processColor,
    View,
    FlatList,
    Dimensions
} from 'react-native';

import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Footer,
    FooterTab,
    List,
    ListItem,
    Card,
    CardItem,
    Text,
    Fab,
    Body,
    Left,
    Right,
    H3,
    Switch,
    IconNB,
    Icon
} from "native-base";

import getString from "../../translations";
import MyHeader from "../common/MyHeader";

import Global from "../common/Global";
import * as Log from "../../libs/Log"
import * as utils from "../../libs/utils"
import FastImage from 'react-native-fast-image'
var NativeAPI = require('react-native').NativeModules.YiYaNativeAPI;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default class NewAssets extends Component {
    _generateNewAssets(inited) {
        let wallet = this.props.wallet.cur_wallet;
        let tokens = wallet.tokens;
        var token_list = this.props.token.tokens;
        let newassets = [];
        if (token_list && token_list[Global.ETH_ADDRESS]) {
            newassets = newassets.concat({
                icon: token_list[Global.ETH_ADDRESS].icon,
                address: token_list[Global.ETH_ADDRESS].address,
                name: token_list[Global.ETH_ADDRESS].name,
                symbol: token_list[Global.ETH_ADDRESS].symbol,
                switch_enable: false,
                switch: false,
            })
        }
        for (token in token_list) {
            var token_info = token_list[token];
            if (token_info.address === Global.ETH_ADDRESS) continue;

            newassets = newassets.concat({
                icon: token_list[token].icon,
                address: token_list[token].address,
                name: token_list[token].name,
                symbol: token_list[token].symbol,
                switch_enable: true,
                switch: false,
            })
        }
        let length = newassets.length;
        for (let i = 0; i < length; i++) {
            let tk = newassets[i];
            if (tokens && tokens[tk.address]) {
                tk.switch = true;
            } else {
                tk.switch = false;
            }
        }

        return newassets;
    }

    constructor(props) {
        super(props);

        this.state = {
            data: this._generateNewAssets(true)
        }
    }

    _handleSwitch(symbol, value) {
        const { actions } = this.props;
        var wallet = this.props.wallet.cur_wallet;

        var tokens = [];
        var length = this.state.data.length;
        for (var i = 0; i < length; i++) {
            var tk = this.state.data[i];
            if (tk.symbol === symbol) {
                tk.switch = value;
            }
            if (tk.switch) {
                tokens = tokens.concat([tk.address]);
            }
        }

        actions.configToken({
            address: wallet.address,
            tokens: tokens,
            resolved: ()=> { //config ok
                this.setState({
                    data: this._generateNewAssets(false)
                });

                NativeAPI.reportModCoin(symbol, value? ''+1:''+2);
            }
        });

        if (value) {
            token_info = utils.getTokenUnitFromSymbol(symbol);
            actions.getTokenBalance({
                token_symbol: token_info.symbol,
                token_address: token_info.address,
                address: wallet.address
            });
        }
    }

    render() {
        this.state.data = this._generateNewAssets(true);
        return (
          <Container style={{flex:1, backgroundColor:'white'}}>
              <MyHeader
                titleColor='rgba(0,0,0,0.87)'
                actionBarBgColor="transparent"
                leftImageName="back"
                titleName={getString("newassets_title")}
                backgroundColor={Global.primaryColor}
                {...this.props}
              />
              <FlatList style={{borderRadius:10, paddingTop: 10}}
                    data={utils.fixFlatListData(this.state.data)}
                    renderItem={({ item }) => (
                      <ListItem button style={styles.listitem}>
                          <View style={styles.assets}>
                              <FastImage source={{uri:item.icon}} style={styles.assets_icon}/>
                              <View style={{flexDirection:"column", paddingLeft: 10}}>
                                  <Text style={{textAlign: 'left', width: deviceWidth/2, paddingLeft: 0}}> {item.symbol} </Text>
                                  <Text style={{textAlign: 'left', width: deviceWidth/2, color:'rgba(0,0,0,0.45)', paddingLeft: 4}}>
                                      {item.name}
                                  </Text>
                              </View>
                              <View style={{flex:1}}>
                              </View>
                              <View>
                                  {item.switch_enable? <Switch value={item.switch} onTintColor="#50B948" onValueChange={(value) => this._handleSwitch(item.symbol, value)}/> : null}
                              </View>
                          </View>
                      </ListItem>)}
              />
          </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:Global.primaryColor
    },
    listitem: {
        height: 88,
        marginLeft:0,
        marginRight:0,
        borderBottomWidth:1,
        paddingTop:1,
        paddingBottom:1,
        paddingLeft:15,
        paddingRight:1
    },
    assets: {
        flex: 1,
        flexDirection:'row'
    },
    assets_icon: {
        width: 40,
        height: 40,
    },
});

export const WrappedComponent = NewAssets;

export function mapStateToProps(state) {
    return {
        wallet: state.wallet,
        token: state.token
    }
}
