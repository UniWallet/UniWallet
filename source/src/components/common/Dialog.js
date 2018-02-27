import React, {Component} from 'react';
import Global from "../common/Global"
import {
    AppRegistry,
    StyleSheet,
    Text,
    Modal,
    PixelRatio,
    View
} from 'react-native';

import getString from "../../translations";

class Dialog extends Component {

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
    }

    static propTypes = {
        _dialogTitle: React.PropTypes.string, //标题
        _dialogContent: React.PropTypes.string, //内容
        _dialogLeftBtnTitle: React.PropTypes.string,    //左按键标题
        _dialogRightBtnTitle: React.PropTypes.string,   //右按键标题
        _dialogLeftBtnAction: React.PropTypes.func.isRequired,  //左点击方法
        _dialogRightBtnAction: React.PropTypes.func.isRequired, //右点击方法
        _dialogVisible: React.PropTypes.bool,       //显示还是隐藏
    }

    static defaultProps = {
        _dialogTitle: getString("dialog_default_title"),
        _dialogContent: getString("dialog_default_content"),
        _dialogLeftBtnTitle: getString("dialog_default_leftbutton"),
        _dialogRightBtnTitle: getString("dialog_default_rightbutton"),
        _dialogVisible: false,
    }

    render() {
        return (
            <Modal
                visible={this.props._dialogVisible}
                transparent={true}
                onRequestClose={() => {
                }} //如果是Android设备 必须有此方法
            >
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.dialogTitle}>
                            {this.props._dialogTitle}
                        </Text>
                        <Text style={styles.dialogContent}>
                            {this.props._dialogContent}
                        </Text>
                        <View style={styles.dialogSelection}>
                            <Text style={styles.negativeeButton}
                                                onPress={this.props._dialogLeftBtnAction}>
                                <Text style={styles.leftButton}>
                                    {this.props._dialogLeftBtnTitle}
                                </Text>
                            </Text>
                            <Text style={styles.positiveBotton}
                                                onPress={this.props._dialogRightBtnAction}>
                                <Text style={styles.rightButton}>
                                    {this.props._dialogRightBtnTitle}
                                </Text>
                            </Text>
                        </View>

                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    innerContainer: {
        flex: 0.3,
        borderRadius: 5,
        backgroundColor: '#fff',
        padding: 20,
    },
    dialogTitle: {
        flex: 1,
        flexDirection: 'row',
        textAlign: 'left',
        color: 'rgba(0,0,0,0.87)',
        fontSize: 20,
    },
    dialogContent: {
        flex: 2,
        textAlign: 'left',
        justifyContent: 'center',
        color: 'rgba(0,0,0,0.54)',
        fontSize: 18,
        marginBottom: 10,
        lineHeight: 28,
    },
    dialogSelection: {
        flex: 0.45,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    positiveBotton: {
        flex: 1,
        fontSize: 16,
        color: Global.primaryColor,
        textAlign: 'center',
    },
    negativeeButton: {
        flex: 1,
        color: 'rgba(0,0,0,0.54)',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Dialog
