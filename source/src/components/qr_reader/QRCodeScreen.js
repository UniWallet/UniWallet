import React, {Component} from 'react';
import {Dimensions, Image, StatusBar, StyleSheet, View, Vibration} from 'react-native';

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
    Switch} from 'native-base';

// import Camera from 'react-native-camera';
import RNCamera  from 'react-native-camera'
import MyHeader from "../common/MyHeader"
import getString from "../../translations/index";

export default class QRCodeScreen extends Component {
    _onBarCodeRead(result) {
        //TODO:Add vibrate
        Vibration.vibrate();
        if (this.props.navigation && this.props.navigation.state.params && this.props.navigation.state.params.callback) {
            this.props.navigation.goBack();
            this.props.navigation.state.params.callback(this.props.navigation.state.params.code, result);
        }
    }

    render() {
        return (
            <Container style={styles.container}>
              <MyHeader titleName={getString("scan_title")}
                        {...this.props}
              />
                <RNCamera onBarCodeRead={this._onBarCodeRead.bind(this)} style={styles.camera}>
                <View style={styles.rectangleContainer}>
                    <View style={styles.rectangle}/>
                </View>
                </RNCamera>
            </Container>
        );
    }
}

var styles = StyleSheet.create({
  camera: {
    flex:1,
    alignItems: 'center',
  },

  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },

  cancelButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 3,
    padding: 15,
    width: 100,
    bottom: 10,
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#0097CE',
  },
});
