import Platform from 'react';
import React, {Component} from 'react';
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
    IconNB,
    Form, Item, Input,
    Switch} from 'native-base';

import getString from "../../translations";
import MyHeader from "../common/MyHeader";

import Global from "../common/Global";
import * as Log from "../../libs/Log"

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default class WalletCreateSuccess extends Component {
    _onBackupPress() {
        Log.log("try to backup: " + this.props.navigation.state.params.name)
        Global.resetToPages(this, [
            {
                routeName:"Drawer",
            },{
                routeName:"WalletBackup",
                params:{
                    name: this.props.navigation.state.params.name
                },
            }
        ]);
        // this.props.navigation.navigate("WalletBackup", {'name': this.props.navigation.state.params.name})
    }

    render() {
        return (
            <Container style={styles.container}>
                <MyHeader
                  titleColor='rgba(0，0，0，0.87)'
                  actionBarBgColor="transparent"
                  leftImageName="back"
                  titleName={getString("create_wallet_success_title")}
                  backgroundColor={Global.primaryColor}
                  {...this.props}
                />
                <View style={{flex:1}}>
                <View style={{paddingTop: 71, flexDirection: "row", justifyContent: "center"}}>
                    <Image source={require('./img/setUp_sucess.png')} style={styles.iconImage} />
                </View>
                <View style={{
                    alignItems: "center",
                    marginBottom: 27,
                    marginTop: 21,
                    backgroundColor: "transparent",
                }} >
                    <H3 style={styles.textcolor}>{getString("create_wallet_success")}</H3>
                    <Text style={{paddingTop:5, color:'#00000080'}}>{getString("create_wallet_please_backup")}</Text>
                </View>
                <View style={{paddingTop: 19, flexDirection: "row", justifyContent: "center"}}>
                    <Button style={{width: 320, elevation: 0, backgroundColor:'rgb(40,217,227)', borderWidth: 0, flexDirection: "row", justifyContent: "center"}}  onPress={this._onBackupPress.bind(this)} >
                        <Text uppercase={false} style={{fontSize:16}}>{getString("create_wallet_button_backup")}</Text>
                    </Button>
                </View>
                <View style={{paddingTop: 19, flexDirection: "row", justifyContent: "center"}}>
                    <Button style={{width: 320, elevation: 0, backgroundColor:'rgba(0,0,0,0.16)', borderWidth: 0, flexDirection: "row", justifyContent: "center"}}  onPress={() => this.props.navigation.navigate("Drawer")} >
                        <Text uppercase={false} style={{fontSize:16}}>{getString("create_wallet_button_ignore")}</Text>
                    </Button>
                </View>
                <View  style={{paddingTop: 19, flexDirection: "row", justifyContent: "center"}}>
                    <Text
                        onPress={() => this.props.navigation.navigate('SimpleBrowser', {
                            url: "http://static.yiya.io/how_to_backup.html",
                            title:getString("how_to_backup_title"),
                            refresh: false,
                            share: false,
                        })}
                        style={{color:'rgb(40,217,227)'}}>{getString("create_wallet_button_howtobackup") }</Text>
                </View>
                  </View>
                <View style={{alignSelf: "flex-end"}}>
                    <Image style={{width:deviceWidth,height:5}} source={Global.getImage("setUp_bottom_row")}/>
                    <Text style={{backgroundColor:'#B2B2B2',color:"#ffffff", paddingLeft: 15,paddingRight:15,paddingBottom:15,paddingTop:8,fontSize:12}}>{getString("hint_wallet_backup")}</Text>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:"#ffffff"
    },
    textcolor: {
        color: '#0000008a'
    },
    iconImage: {
        width: 69,
        height: 69,
    },
});