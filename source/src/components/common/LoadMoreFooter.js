import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,Dimensions
} from 'react-native';
import getString from "../../translations/index";

const deviceWidth = Dimensions.get("window").width;
class LoadMoreFooter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.footer}>
                {this.props.showIndicator?(<ActivityIndicator/>):null}
                <Text onPress={() => this.props.onFootTextPressed!=null?this.props.onFootTextPressed():null} style={this.props.footTextStyle==null?styles.footerTitle:this.props.footTextStyle}>{this.props.footText}</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        paddingBottom:10,
        width:deviceWidth,
        backgroundColor: "#ffffff",
    },
    footerTitle: {
        marginLeft: 10,
        fontSize: 15,
        color: 'gray'
    }
})

export default LoadMoreFooter