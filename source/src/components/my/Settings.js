import React, {Component} from "react";
import {StatusBar, View, StyleSheet, Image} from 'react-native';
import RNShakeEvent from 'react-native-shake-event';

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
import MyHeader from "../common/MyHeader"
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

class Settings extends Component {
    constructor(props) {
        super(props);
        const { actions } = this.props;
        this.state = {
            showUrlSetting: false
        };
    }

    componentWillMount() {
        if (__DEV__) {
            RNShakeEvent.addEventListener('shake', () => {
                this.setState({showUrlSetting: true})
            });
        }
    }

    componentWillUnmount() {
        if (__DEV__) {
            RNShakeEvent.removeEventListener('shake');
        }
    }

    render() {
        return (
            <Container>
                <MyHeader headerColor="#ffffff"
                          titleColor='#000000'
                          iconColor='#000000'
                    // rightIconName="menu"
                          titleName={getString("system_settings")}
                          {...this.props}
                />
                <View style={{flex: 1, backgroundColor: '#EEEEEE'}}>

                    <View style={{backgroundColor: "#FFFFFF"}}>
                        <View style={{backgroundColor: "#EEEEEE", height: 10}}/>
                        {/*<ListItem onPress={() => this.props.navigation.navigate('Language')}>*/}
                            {/*<Body>*/}
                                {/*<Text style={styles.text}>{getString("multilingual")}</Text>*/}
                            {/*</Body>*/}
                            {/*<Right>*/}
                                {/*<Image source={Global.getImage("arrow_right")} style={styles.image}/>*/}
                            {/*</Right>*/}
                        {/*</ListItem>*/}
                        <ListItem  onPress={() => this.props.navigation.navigate('CoinUnit')}>
                            <Body>
                            <Text style={styles.text}>{getString("currency_unit")}</Text>
                            </Body>
                            <Right>
                                <Image source={Global.getImage("arrow_right")} style={styles.image}/>
                            </Right>
                        </ListItem>
                        {this.state.showUrlSetting?
                            <ListItem onPress={() => this.props.navigation.navigate('Web3Settings')}>
                                <Body>
                                <Text style={styles.text}>{getString("web3_settings")}</Text>
                                </Body>
                                <Right>
                                    <Image source={Global.getImage("arrow_right")} style={styles.image}/>
                                </Right>
                            </ListItem> : null
                        }
                    </View>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 17,
        color:Global.primaryContentColor,
    },
    image: {
        width:18,
        height:18,
    },
});
export default Settings;