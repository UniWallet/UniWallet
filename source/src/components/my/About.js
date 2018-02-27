import React, {Component} from "react";
import {StatusBar, View, Image, StyleSheet} from 'react-native';
import MyHeader from "../common/MyHeader"
import Dialog from "../common/Dialog";
import {
    Body,
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Header,
    Icon,
    Left,
    List,
    ListItem,
    Right,
    Separator,
    Text,
    Title,
} from "native-base";
import Global from "../common/Global"
import getString from "../../translations/index";

const datas = [
    {
        name: "Ether",
        address: "0x000fdsfds000fdss",
        number: 10000,
        amount: 90000,
        coinName: 'eth'
    },
    {
        name: "BitCoin",
        address: "0x120fdsfds000fdss",
        number: 20000,
        amount: 30000,
        coinName: 'eth'
    },
    {
        name: "LiteCoin",
        address: "0x340fdsfds000fdss",
        number: 40000,
        amount: 100000,
        coinName: 'eth'
    }
];

class About extends Component {
    // eslint-disable-line
    constructor(props) {
        super(props);
        this.state = {showDialog: false,}
    }

    showDialog() {
        this.setState({showDialog: true});
    }

    hideDialog() {
        this.setState({showDialog: false});
    }

    render() {
        return (
            <Container>
                <Dialog
                    _dialogTitle={getString("version_update")}
                    _dialogContent={'- 重置钱包密码功能  \n- 帮助中心改版 \n- 收款地址黑名单过滤功能 '}
                    _dialogLeftBtnTitle={getString("update_later")}
                    _dialogRightBtnTitle={getString("update_now")}
                    _dialogVisible={this.state.showDialog}
                    _dialogLeftBtnAction={() => {
                        this.hideDialog()
                    }}
                    _dialogRightBtnAction={() => {
                        this.hideDialog()
                    }}
                />
                <MyHeader headerColor="#ffffff"
                          titleColor='#000000'
                          iconColor='#000000'
                    // rightIconName="menu"
                          titleName= {getString("about_us")}
                          {...this.props}
                />
                <View style={{flex: 1, backgroundColor: '#ffffff', paddingTop: 15}}>
                    <View style={{backgroundColor: "#FFFFFF"}}>
                        <View style={{alignItems: 'center'}}>
                            <Image source={Global.getImage("about_logo")} style={{width: 64, height: 64}}/>
                            <Text style={{marginTop: 10, color: Global.primaryContentColor}}>{getString("version_now")} 1.0.0</Text>
                        </View>
                        <Text
                            style={{marginLeft: 30, marginTop: 10, marginRight: 30, color: Global.primaryContentColor}}>
                            {getString("app_introduction")}
                        </Text>
                    </View>
                    <View style={{backgroundColor: "#FFFFFF", paddingTop: 20}}>
                        <ListItem onPress={() => this.props.navigation.navigate('SimpleBrowser', {
                            url: "http://static.yiya.io/term_of_service.html",
                            title:getString("protocol"),
                            refresh: false,
                            share: false,
                        })}>
                            <Body>
                            <Text style={styles.text}>{getString("protocol")}</Text>
                            </Body>
                            <Right>
                                <Image source={Global.getImage("arrow_right")} style={styles.icon}/>
                            </Right>
                        </ListItem>
                        <ListItem onPress={() => this.props.navigation.navigate('SimpleBrowser', {
                            url: "http://static.yiya.io/privacy.html",
                            title: getString("privacy_policy"),
                            refresh: false,
                            share: false,
                        })}>
                            <Body>
                            <Text style={styles.text}>{getString("privacy_policy")}</Text>
                            </Body>
                            <Right>
                                <Image source={Global.getImage("arrow_right")} style={styles.icon}/>
                            </Right>
                        </ListItem>
                        {/*<ListItem onPress={() => this.props.navigation.navigate('SimpleBrowser', {*/}
                            {/*url: "http://www.baidu.com",*/}
                            {/*title: getString("version_log"),*/}
                            {/*refresh: false,*/}
                            {/*share: false,*/}
                        {/*})}>*/}
                            {/*<Body>*/}
                            {/*<Text style={styles.text}>{getString("version_log")}</Text>*/}
                            {/*</Body>*/}
                            {/*<Right>*/}
                                {/*<Image source={Global.getImage("arrow_right")} style={styles.icon}/>*/}
                            {/*</Right>*/}
                        {/*</ListItem>*/}
                        {/*<ListItem onPress={() => this.showDialog()}>*/}
                            {/*<Body>*/}
                            {/*<Text style={styles.text}>{getString("new_version_check")}</Text>*/}
                            {/*</Body>*/}
                        {/*</ListItem>*/}
                    </View>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column-reverse',
                        alignItems: 'center',
                        backgroundColor: "white"
                    }}>
                        <Text style={{marginBottom: 25, fontSize: 13, color: Global.primaryContentColor}}>
                            All right reserved
                        </Text>
                        <Text style={{marginBottom: 5, fontSize: 13, color: Global.primaryContentColor}}>
                            Copyright @2017 UniWallet
                        </Text>

                    </View>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    icon: {
        width: 18,
        height: 18,
        marginRight: 5,
    },
    text: {
        fontSize: 16,
    }
});

export default About;