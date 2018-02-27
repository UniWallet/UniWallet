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
import {LineDotsLoader, LinesLoader, RotationCircleLoader, BubblesLoader, EatBeanLoader, CirclesLoader, PulseLoader, TextLoader, DotsLoader} from 'react-native-indicator';
const { height, width } = Dimensions.get('window');
const modalWidth = width * 0.8;


class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pwd: ''
        };
    }


    render() {
        if (!this.props.show) {
            return null;
        }
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={true}
                onRequestClose={() => {
                }}>
                <KeyboardAvoidingView behavior="padding" style={styles.container}>

                    <View style={styles.body}>
                        <Text style={{
                            color: "black",
                            marginTop: 7,
                            marginLeft: 2,
                            fontSize: 16
                        }}>{this.props.title}
                        </Text>
                        <View style={{marginTop:20}}>
                            <BubblesLoader size={40} color="#1e90ff"/>
                        </View>
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
        alignItems:"center",
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


export const WrappedComponent = Loading;
export function mapStateToProps(state) {
    return {
        ...state.utils.loading
    }
}
