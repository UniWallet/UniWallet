import React, {Component} from 'react';
import Global from './Global'
import {
  AppRegistry,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  NativeModules,
  processColor,
  View
} from 'react-native';

import {
  Container,
  Header,
  Title,
  Text,
  Body,
  Left,
  Right,
  Button,
  IconNB,
  Icon
} from "native-base";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

/*
    Two components are specified in the header:
    1) Header
        leftIconName
        leftImageName
        titleName
        rightIconName
        rightImageName
        withBottom
    2) Status Bar
        backgroundColor
        translucent

 */
export default class MyHeader extends Component {
    constructor(props) {
        super(props);
        if ((this.props.leftIconName === '' && this.props.leftImageName === '')
          || (this.props.leftIconName === '' && !this.props.leftImageName)
          || (!this.props.leftIconName && this.props.leftImageName === '')) {
            //Empty leftIcon and leftImage is invalid
            //Empty leftImageName and leftIcon is invalid
            //Hidden Left button
            this.state = {showLeftButton:false}
        } else {
            this.state = {showLeftButton:true}
        }
    }

  render() {
    return (
        <View>
          {!this.props.noStatusBar?(<View style={{backgroundColor: this.props.statusBarBgColor ? this.props.statusBarBgColor:"transparent", elevation: 0, height: StatusBar.currentHeight}}/>):null}
          {!this.props.noActionBar?(<Header noShadow style={{backgroundColor:this.props.actionBarBgColor ? this.props.actionBarBgColor:"white",
                                                    height:52,
                                                    paddingLeft: 0, marginRight: 0, paddingRight:0, marginLeft:0,
                                                    borderBottomWidth: this.props.withoutBottom? 0:1, borderBottomColor: '#00000029',
                                                    borderLeftWidth: 0, borderRightWidth: 0}}>
              <Left style={{flex:1}}>
                {this.state.showLeftButton? (<Button style={{marginRight:0, paddingLeft:8, paddingRight:10, marginLeft:8}} iconLeft transparent onPress={
                  () => this.props.leftOnPress? this.props.leftOnPress():this.props.navigation.goBack()}>
                    {this.props.leftIconName?
                        <Icon name={this.props.leftIconName}
                            style={{color: this.props.iconColor ? this.props.iconColor : '#242424'}}/>:null
                    }
                    {/*
                        leftImage cases:
                        1)has leftImage, show it
                        2)no leftImage, has leftIconName, hidden
                        3)no leftImage, no leftIconName, show default leftImage(back)
                     */}
                    {(this.props.leftImageName || !this.props.leftIconName) ?
                        <Image source={this.props.leftImageName ? Global.getImage(this.props.leftImageName) : Global.getImage('back')}
                               style={styles.iconImage}/>:null
                    }
                </Button>) : null}
              </Left>
              <Body style={{flex:1.6}}>
              {this.props.titleName ? (<Text numberOfLines={1} ellipsizeMode={'middle'} style={{
                alignSelf: 'center',
                color: this.props.titleColor ? this.props.titleColor:'rgba(0,0,0,0.87)',
                fontSize: 20
              }}>{this.props.titleName}</Text>) : null}
              </Body>
              <Right style={{flex:1.1}}>
                {this.props.rightIconName || this.props.rightImageName || this.props.rightText? (<Button iconRight transparent onPress={
                  () => this.props.rightOnPress? this.props.rightOnPress():{}}
                     style={{paddingLeft:5, paddingRight:5, marginLeft:8, marginRight:8}}>
                    {this.props.rightIconName?
                        <Icon name={this.props.rightIconName}
                          style={{color: this.props.iconColor ? this.props.iconColor : '#242424'}}/>:null
                    }
                    {
                        this.props.rightImageName? <Image source={Global.getImage(this.props.rightImageName)} style={styles.iconImage}/>:null
                    }
                    {
                        this.props.rightText? (
                            <Text uppercase={false} style={{alignItems:'center',
                                paddingRight:5,paddingLeft:5,
                                paddingTop:5,paddingBottom:5,
                                color:this.props.rightTextColor?
                                this.props.rightTextColor:
                                Global.primaryColor}}>{this.props.rightText}</Text>):null
                    }
                </Button>) : null}
              </Right>
          </Header>):null}
          <StatusBar
              backgroundColor={this.props.backgroundColor ? (this.props.backgroundColor) : "transparent"}
              translucent={this.props.trunslucent ? (this.props.trunslucent) : true}
              hidden={this.props.statusBarHidden ? this.props.statusBarHidden : false}
              animated={true}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
    iconImage: {
        paddingLeft: 0,
        marginLeft: 0,
        width: 20,
        height: 20,
    },
});