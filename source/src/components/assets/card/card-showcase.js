import React, { Component } from "react";
import { Image, ListView, Dimensions } from "react-native";

import {
  Container,
  Header,
  Title,
  Content,
  Button,
    List,
    ListItem,
  Icon,
  Card,
  CardItem,
  Text,
  Thumbnail,
  Left,
  Right,
  Body,
  IconNB,
    View
} from "native-base";

import styles from "./styles";

const deviceWidth = Dimensions.get("window").width;

const logo = require("../img/logo.png");
const cardImage = require("../img/drawer-cover.png");
//const icon1 = require("../img/icon_1.png");
const status = require("../img/ic_sysbar_menu.png");

import * as Log from "../../../libs/Log"
import * as WalletUtils from "../../common/wallet_utils/wallet_utils"

class NHCardShowcase extends Component {
    constructor(props) {
        super(props);

    }
    
    render() {
        Log.log("render ...")
      /*
          TODO add token support
       */
    return (
          <View style={{flex: 1, paddingTop: 2}}>
            <List showsVerticalScrollIndicator={false} style={{borderRadius:10}}
                dataArray={this.state.dataSource}
                renderRow={rowData =>
                    <ListItem button style={styles.listitem}
                        onPress={() => this.props.navigation.navigate("Assetscoinaction")}
                    >
                      <Card style={styles.card}>
                        <CardItem>
                          <Body>
                          <View style={styles.itemhead}>
                            <Image source={logo} style={styles.icon}/>
                            <View style={{flex:1, flexDirection:"row", justifyContent:"flex-start", paddingLeft:10, alignItems:"center"}}>
                              <Text > {rowData.name} </Text>
                            </View>
                            <View>
                            <View style={{flex:1, flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                              <Text> {rowData.balance} </Text>
                              <Text  style={{color: "#00000060"}}>{rowData.amount}</Text>
                            </View>
                            </View>
                          </View>
                          </Body>
                        </CardItem>
                      </Card>
                    </ListItem>}
            />
          </View>
    );
  }
}

export default NHCardShowcase;
