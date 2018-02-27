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
    Content,
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
    You can specified buttons are you expected. The maximum button num is 2.
    1) button1IconName
    2) button1Name
    2*) button1Navi
    3) button2IconName
    4) button2Name
    ...

 */
export default class MyFooterButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{flexDirection: "row"}}>
                <Content style={styles.buttonbackground1}>
                    <Button iconLeft bordered  style={styles.button1} onPress={() => {this.props.button1Navi? this.props.navigation.navigate(this.props.button1Navi, this.props.button1NaviParams? this.props.button1NaviParams:null):null}}>
                        {this.props.button1IconName? (<Image source={this.props.button1IconName ? Global.getImage(this.props.button1IconName) : Global.getImage('back')}
                                                             style={styles.iconImage}/>):null}
                        {this.props.button1Name? (
                            <Text uppercase={false} style={styles.text}>
                                {this.props.button1Name}
                            </Text>):null}
                    </Button>
                </Content>
                <Content style={styles.buttonbackground2}>
                    <Button iconLeft bordered style={styles.button2} onPress={() => {this.props.button2Navi? this.props.navigation.navigate(this.props.button2Navi, this.props.button2NaviParams? this.props.button2NaviParams:null):null}}>
                        {this.props.button2IconName? (<Image source={this.props.button2IconName ? Global.getImage(this.props.button2IconName) : Global.getImage('back')}
                                                             style={styles.iconImage}/>):null}
                        {this.props.button2Name? (
                            <Text uppercase={false}  style={styles.text}>
                                {this.props.button2Name}
                            </Text>):null}
                    </Button>
                </Content>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonbackground1:{
        flex: 1,
        backgroundColor: "#28D8E2"
    },
    buttonbackground2:{
        flex: 1,
        backgroundColor: "#FBB82D"
    },
    iconImage: {
        paddingLeft: 0,
        marginLeft: 0,
        width: 28,
        resizeMode:'contain',
        height: 28,
    },
    text: {
        color: "white",
        textAlign: 'center',
        fontSize: 16,
    },
    button1: {
        flex: 1,
        flexDirection: "row",
        alignSelf: 'stretch',
        justifyContent: 'center',
        marginTop: 1,
        marginBottom: 1,
        borderWidth: 0,
        borderColor: '#ffffff',
        height:55
    },
    button2: {
        flex: 1,
        flexDirection: "row",
        alignSelf: 'stretch',
        justifyContent: 'center',
        marginTop: 1,
        marginBottom: 1,
        borderWidth: 0,
        borderColor: '#ffffff',
        height:55
    }
});