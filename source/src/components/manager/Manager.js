import React, {Component} from "react";
import {
    StatusBar,FlatList,
    ListView, StyleSheet, View, Image
} from 'react-native';
import {
    Container,
    Content,
    Header,
    Title,
    Button,
    Icon,
    Right,
    Left,
    List,
    ListItem,
    Card,
    CardItem,
    Separator,
    Body,
    Text,
} from "native-base";
import MyHeader from "../common/MyHeader"
import MyFooterButton from "../common/MyFooterButton";
import Global from "../common/Global"
import getString from "../../translations/index";
import {SwipeListView} from 'react-native-swipe-list-view'
import * as etherutils from '../../libs/etherutils';
import * as Log from "../../libs/Log"

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1.fullName !== r2.fullName
});

class Manager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wallets: [],
        };
    }

    componentDidMount() {
        if (!this.props.wallet || !this.props.wallet.wallets) {
            this.getWallets()
        }
    }

    getWallets() {
        const {actions} = this.props;
        actions.getWalletFromStorage({
            resolved: () => {
                // actions.toast("加载钱包成功");
            },
            rejected: () => {
                this.props.navigation.navigate("WalletCreate");
            }
        });
    }

    _removeItem(wallet) {
        const {actions} = this.props;
        //TODO:need to remove account data
        actions.removeWallet({
            wallet: wallet,
            resolved: () => {
                actions.toast('钱包删除成功');
            }
        });
    }

    _handleItemPress(item) {
        this.props.navigation.navigate("WalletBackup", {'wallet': item})
    }

    _renderRow({item}) {
        return (<ListItem
            style={styles.listItem}
            onPress={() => this._handleItemPress(item)}
        >
            <View style={styles.card}>
                <CardItem style={styles.cardItem}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                    }}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Image source={Global.getImage("head_management")} style={{width: 50, height: 50}}/>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                marginLeft: 5,
                            }}
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                    }}
                                >
                                    <Text ellipsizeMode='middle' numberOfLines={1} style={{ maxWidth:175,color: Global.primaryContentColor}}> {item.name ?item.name : "wallet"}  </Text>
                                    {item.isBackup?null:(<Text style={styles.backup_hint}> {getString("backup_hint")} </Text>)}
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row-reverse',
                                    }}
                                    >
                                        <Image source={Global.getImage("arrow_right")} style={{width: 18, height: 18}}/>
                                    </View>
                                </View>
                                <Text ellipsizeMode='middle' numberOfLines={1}
                                      style={{width: 180, color: Global.primaryContentColor}}> {etherutils.toChecksumAddress(item.address)} </Text>
                            </View>
                        </View>

                        <View style={{height: 1, backgroundColor: '#CCCCCC', marginTop: 15}}/>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginTop: 15,
                                marginBottom: 10,
                            }}
                        >
                            <Text style={{
                                fontSize: 22,
                                textAlign: "center"
                            }}>{etherutils.formatBalance(item.balance ? item.balance : 0,4)} </Text>
                            <Text style={{
                                fontSize: 16,
                                color: Global.primaryContentColor,
                                textAlign: "center",
                                paddingTop: 7
                            }}>{"ether"}</Text>
                        </View>
                    </View>
                </CardItem>
            </View>

        </ListItem>);
    }

    render() {
        this.state.wallets = []
        for (address in this.props.wallet.wallets) {
            this.state.wallets = this.state.wallets.concat(this.props.wallet.wallets[address])
        }
        return (
            <Container>
                <MyHeader titleName={getString("manage_wallet")}
                          titleColor="white"
                          leftImageName='header_back_white'
                          actionBarBgColor={Global.primaryColor}
                          statusBarBgColor={Global.primaryColor}
                          {...this.props}
                />

                <View style={{flexDirection: "column-reverse", flex: 1, backgroundColor: "#EEEEEE"}}>
                    <MyFooterButton
                        {...this.props}
                        button1IconName="management_setup"
                        button1Name={getString("create_wallet_button_create")}
                        button1Navi="WalletCreate"
                        button2IconName="management_into"
                        button2Name={getString("create_wallet_button_import")}
                        button2Navi="Import"
                    />
                    <FlatList
                        style={styles.list}
                        data={this.state.wallets}
                        renderItem={this._renderRow.bind(this)}
                    />
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        flexDirection: "row",
        alignSelf: 'stretch',
        justifyContent: 'center',
        marginTop: 1,
        marginBottom: 1,
        borderWidth: 0,
        borderColor: '#ffffff',
        height: 55,
    },

    image: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },

    text: {
        color: "white",
        textAlign: 'center',
        fontSize: 16,
    },
    backup_hint: {
        borderColor:"rgb(238,181,147)",
        color: "rgb(238,181,147)",
        textAlign: 'center',
        fontSize: 11,
        borderWidth: 1,
        borderRadius: 9,
        height:18,
        width:52,
        paddingTop:1,
        paddingBottom:0,
        textAlign:"center",
        marginLeft:5,
        marginRight:5,
        marginTop:2
    },
    list: {
        flex: 1,
        paddingBottom: 20,
        marginTop: 10,
        marginBottom: 10,
    },

    listItem: {
        marginLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        borderBottomWidth: 0,
        backgroundColor: null
    },

    card: {
        flex: 1,
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
    },

    cardItem: {
        flex: 1,
        borderRadius: 4,
        borderBottomWidth: 0,
    },
});

export default Manager;
export const WrappedComponent = Manager;

export function mapStateToProps(state) {
    return {
        wallet: state.wallet,
    };
}