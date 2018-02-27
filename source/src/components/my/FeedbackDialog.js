import React, {Component} from 'react';
import Global from "../common/Global"
import {
    AppRegistry,
    StyleSheet,
    Text,
    Modal,
    Image,
    PixelRatio,
    TouchableOpacity,
    View
} from 'react-native';
import getString from "../../translations/index";


class FeedbackDialog extends Component {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        _dialogLeftBtnAction: React.PropTypes.func.isRequired,  //左点击方法
        _dialogVisible: React.PropTypes.bool,       //显示还是隐藏
    }

    static defaultProps = {
        _dialogVisible: false,
    }

    render() {
        return (
            <Modal
                visible={this.props._dialogVisible}
                transparent={true}
                onRequestClose={() => {
                    this.props._dialogLeftBtnAction();
                }}
            >
            <TouchableOpacity style={{flex: 1}} onPress={ this.props._dialogLeftBtnAction}>
                    <View style={styles.container}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.dialogTitle}>
                                {getString("hint_may_help_you")}
                            </Text>
                            <View style={styles.dialogContent}>
                                <View style={styles.dialogContentItem}>
                                    <Image source={Global.getImage("feedback_report")} style={styles.icon}/>
                                    <Text style={styles.text}>
                                        {getString("report_problem")}</Text>
                                </View>
                                <View style={styles.dialogContentItem}>
                                    <Image source={Global.getImage("feedback_advice")} style={styles.icon}/>
                                    <Text style={styles.text}>
                                        {getString("report_advice")}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
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
    text: {
        fontSize: 20,
        marginLeft: 10,
        paddingBottom: 5,
        color: 'rgba(0,0,0,0.54)',
    },
    icon: {
        width: 20,
        height: 20,
        marginLeft: 10,
        marginTop: 3,
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
        flex: 3,
        justifyContent: 'center',
    },
    dialogContentItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 10,
        marginBottom: 10,
    },
});

export default FeedbackDialog
