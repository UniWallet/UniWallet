/**
 * CoinWallet React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import Platform from 'react';
import React, {Component} from 'react';
import {Dimensions, Image, StatusBar, StyleSheet, View} from 'react-native';
import MyHeader from "../common/MyHeader"
import FeedbackDialog from "./FeedbackDialog"
import getString from "../../translations/index";
import {
    Button, CheckBox, Container,
    Content, Header, ListItem, Text,
    Icon, Separator, Left, Right,
    Body, Switch
} from 'native-base';
import Global from "../common/Global"
import Instabug from 'instabug-reactnative';
import * as messageConst from '../../redux/constants/Message';
import * as Log from "../../libs/Log"
import Badge from 'react-native-smart-badge'
import RNShakeEvent from 'react-native-shake-event';

export default class MyInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkbox: true,
            showDialog: false,
            showTest: false,
        };
    }

    componentWillMount() {
        if (__DEV__) {
            RNShakeEvent.addEventListener('shake', () => {
                this.setState({showTest: true})
            });
        }
    }

    hideDialog(){
        this.setState({showDialog:false})
    }

    showDialog(){
        //this.setState({showDialog:true})
        Instabug.invoke();
    }

    _hasPendingMessage() {
        count = 0;
        if (!this.props.message || !this.props.message.messages) {
            return count;
        }
        for (item of this.props.message.messages) {
            if (item && item.status != messageConst.STATUS_VIEWED) {
                count++;
            }
        }
        return count;
    }

    render() {
        let pendingCount = this._hasPendingMessage();
        return (
            <View style={styles.container}>
                <FeedbackDialog _dialogVisible = {this.state.showDialog} _dialogLeftBtnAction={() => {
                    this.hideDialog()
                }}/>
                <MyHeader titleName={getString("my_account")} titleColor="white" leftIconName='' actionBarBgColor={Global.primaryColor}
                          statusBarBgColor={Global.primaryColor}/>
                <Content>
                    <View style={{backgroundColor: "white"}}>
                        <View style={styles.seperator}/>
                        <ListItem onPress={() => this.props.navigation.navigate('Manager')}>
                            <Image source={Global.getImage("my_wallet")} style={styles.icon}/>
                            <Body>
                            <Text style={styles.text}>{getString("manage_wallet")}</Text>
                            </Body>
                        </ListItem>
                        {/*<ListItem onPress={() => this.props.navigation.navigate('TransactHistory')}>*/}
                            {/*<Image source={Global.getImage("my_record")} style={styles.icon}/>*/}
                            {/*<Body>*/}
                            {/*<Text style={styles.text}>{getString("transaction_records")}</Text>*/}
                            {/*</Body>*/}
                        {/*</ListItem>*/}
                        <View style={styles.seperator}/>

                        <ListItem onPress={() => this.props.navigation.navigate('MessageList', {title: getString("message_center")})}>
                            <Image source={Global.getImage("my_message")} style={styles.icon}/>
                            <Body>
                            <Text style={styles.text}>{getString("message_center")}</Text>
                            </Body>
                            {pendingCount?(
                            <Right>
                                <Badge textStyle={{color: '#fff'}}>
                                    {pendingCount}
                                </Badge>
                            </Right>):null}
                            {/*<Image source={Global.getImage("arrow_right")} style={styles.icon}></Image>*/}
                        </ListItem>
                        <ListItem onPress={() => this.props.navigation.navigate('Contact')}>
                            <Image source={Global.getImage("my_contact")} style={styles.icon}/>
                            <Body>
                            <Text style={styles.text}>{getString("contact")}</Text>
                            </Body>
                        </ListItem>
                        <ListItem onPress={() => this.props.navigation.navigate('Settings')}>
                            <Image source={Global.getImage("settings")} style={styles.icon}/>
                            <Body>
                            <Text style={styles.text}>{getString("system_settings")}</Text>
                            </Body>
                        </ListItem>
                        <View style={styles.seperator}/>
                        <ListItem
                            onPress={() => this.props.navigation.navigate('SimpleBrowser', {
                                url: "http://static.yiya.io/help.html",
                                title:getString("help_center"),
                                refresh: false,
                                share: false,
                            })}>
                            <Image source={Global.getImage("my_help")} style={styles.icon}/>
                            <Body>
                            <Text style={styles.text}>{getString("help_center")}</Text>
                            </Body>
                        </ListItem>
                        <ListItem onPress={() => this.showDialog()}>
                            <Image source={Global.getImage("my_feedback")} style={styles.icon}/>
                            <Body>
                            <Text style={styles.text}>{getString("feed_back")}</Text>
                            </Body>
                        </ListItem>
                        <ListItem onPress={() => this.props.navigation.navigate('About')}>
                            <Image source={Global.getImage("my_about")} style={styles.icon}/>
                            <Body>
                            <Text style={styles.text}>{getString("about_us")}</Text>
                            </Body>
                        </ListItem>
                        {this.state.showTest?
                            <ListItem onPress={() => this.props.navigation.navigate('Test')}>
                                <Image source={Global.getImage("my_feedback")} style={styles.icon}/>
                                <Body>
                                <Text style={styles.text}>{getString("test_center")}</Text>
                                </Body>
                            </ListItem> : null
                        }
                    </View>
                </Content>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#DDDDDD"
    },
    seperator: {
        height: 8,
        backgroundColor: "#DDDDDD"
    },

    header: {
        flexDirection: "column",
        height: 230,
        backgroundColor: "#4bb6d4"
    },
    icon: {
        marginLeft: 10,
        width: 20,
        height: 20,
        marginRight: 5,
    },
    iconImage: {
        width: 50,
        height: 50,
    },
    iconText: {
        marginTop: 5,
        fontSize: 12,
        color: "#ffffff",
    },
    text: {
        color: Global.primaryContentColor,
        fontSize: 15,
    }
});

export const WrappedComponent = MyInfo;
export function mapStateToProps(state) {
    return {
        message: state.message,
    };
}