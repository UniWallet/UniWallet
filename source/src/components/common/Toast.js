import React, {PropTypes, Component} from 'react';
import config from "../../configs"
import getString from "../../translations";

import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    Animated,
    Modal
} from 'react-native';

const {height, width} = Dimensions.get('window');
const toastWidth = width * 0.7;
const defaultText = 'Toast';
const defaultTimeout = 2000;


class Toast extends Component {
    static propTypes = {
        duration: PropTypes.number
    };


    static defaultProps = {
        duration: 300
    };


    constructor(props) {
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0.4),
            show: false,
            text: defaultText,
            timeout: defaultTimeout
        };
    }


    componentWillUnmount() {
        clearTimeout(this.timeout);
    }


    show(text = defaultText, timeout = defaultTimeout) {
        const {duration} = this.props;
        Animated.timing(this.state.fadeAnim, {
            toValue: 1,
            duration: duration
        }).start();

        this.setState({
            show: true,
            text,
            timeout
        });

        this.timeout = setTimeout(() => {
            Animated.timing(this.state.fadeAnim, {
                toValue: 0,
                duration: duration
            }).start(() => {
                this.setState({
                    show: false
                });
            });
        }, timeout - duration);
    }


    render() {
        const opacity = {
            opacity: this.state.fadeAnim
        };
        if (!this.state.show) {
            if (!config.release) {
                return null;
            } else {
                return (
                    <View style={[styles.watermark]}>
                    <Text style={styles.text}>
                        {getString('release_watermark')}
                    </Text>
                    </View>
                )
            }
        }
        return (
            <Modal
                animationType="fade"
                transparent={true}
                style={{flex: 1}}
                visible={this.state.show}
                onRequestClose={()=>{}}>
                <Animated.View style={[styles.container, this.props.style, opacity]}>
                    <Text style={styles.text}>
                        {this.state.text}
                    </Text>
                </Animated.View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: toastWidth,
        left: (width - toastWidth) / 2,
        top: (height - 60) / 2,
        padding: 20
    },
    watermark: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: toastWidth,
        left: (width - toastWidth) / 2,
        top: height - 200,
        padding: 20
    },

    text: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    }
});


export default Toast;
