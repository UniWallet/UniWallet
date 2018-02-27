import React, {Component} from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    KeyboardAvoidingView,
    Switch
} from 'react-native';

import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/Ionicons';

import getString from "../../translations";

import Global from "./Global";
import * as Log from "../../libs/Log"

const { height, width } = Dimensions.get('window');
const modalWidth = width * 0.8;
const modalHeight = 160;
const switchONText = getString("unlock_cache_on")
const switchOFFText = getString("unlock_cache_off")

class Unlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pwd: ''
        };
    }


    _resetPwd() {
        this.setState({
            pwd: '',
            shouldUnlockWallet: false
        });
    }


    _onPress() {
        const { resolved, actions, wallet } = this.props;
        const { pwd } = this.state;
        if (!pwd) {
            return actions.toast(getString("unlock_password_isempty"));
        }
        if (this.state.shouldUnlockWallet) {
            actions.decryptWallet({
                pwd,
                encryptWallet: wallet.encryptWallet
            });
        }
        resolved && resolved(this.state.pwd);
        actions.closeUnlock();
        this._resetPwd();
    }


    _close() {
        const { rejected, actions } = this.props;
        rejected && rejected();
        actions.closeUnlock();
        this._resetPwd();
    }


    render() {
        const unlockWallet = (
            <View style={ styles.unlockWallet}>
                <Switch
                    onValueChange={(value) => this.setState({shouldUnlockWallet: value})}
                    style={ styles.switchBtn }
                    value={this.state.shouldUnlockWallet}/>
                <Text style={ styles.unlockWalletText }>
                    { this.state.shouldUnlockWallet ? switchONText : switchOFFText }
                </Text>
            </View>
        );

        if (!this.props.show) {
            return null;
        }
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={true}
                onRequestClose={() => {
                    this._close();
                }}>
                <KeyboardAvoidingView behavior="padding" style={styles.container}>

                    <View style={styles.body}>
                        <Text style={{
                            color: "black",
                            marginTop: 7,
                            marginLeft: 2,
                            fontSize: 16
                        }}>{getString("unlock_input_password")}
                        </Text>
                        <TextInput
                            underlineColorAndroid="rgba(0,0,0,0.15)"
                            style={styles.input}
                            onChangeText={(text) => this.setState({
                                pwd: text
                            })}
                            value={this.state.pwd}
                            secureTextEntry={true}
                            selectionColor="#4845aa"
                            // autoFocus={true}
                        />
                        <View style={styles.toolbar}>
                            <View style={{flex: 1}}>
                                <Button style={{color: Global.primaryContentColor, fontSize: 14}}
                                        onPress={this._close.bind(this)}>
                                    {getString("cancel")}
                                </Button>
                            </View>
                            <View style={{flex: 1}}>

                                <Button style={{color: Global.primaryColor, fontSize: 14}}
                                        onPress={this._onPress.bind(this)}>
                                    {getString("ok")}
                                </Button>
                            </View>
                        </View>

                        {/*{ this.props.showSwitch && unlockWallet }*/}
                    </View>
                </KeyboardAvoidingView>

            </Modal>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.3)',

        height,
        width,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    body: {
        borderRadius: 5,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: 'white',
        width: modalWidth
    },
    input: {
        borderColor: 'rgba(0,0,0,0.3)',
        paddingLeft: 10,
        paddingRight: 10,
        color:Global.primaryContentColor,
    },
    toolbar: {
        marginTop: 20,
        flexDirection: 'row',
    },
    iconWrapper: {
        position: 'absolute',
        top: -(10 + 26),
        right: 0,
        backgroundColor: 'transparent',
    },
    closeIcon: {
        color: 'white'
    },
    unlockWallet: {
        width: modalWidth - 20 * 2,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    switchBtn: {
        flex: 2
    },
    unlockWalletText: {
        flex: 5,
        textAlign: 'right',
        color: '#00000080'
    }
});


export const WrappedComponent = Unlock;
export function mapStateToProps(state) {
    return {
        wallet: state.wallet,
        ...state.utils.unlock
    }
}
