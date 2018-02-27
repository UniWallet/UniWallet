import React, {Component} from "react";
import {
    Title,
    Right,
    Container,
    Text,
} from "native-base";
import {StatusBar, View, StyleSheet,Dimensions, Image,TouchableHighlight} from 'react-native';
import Global from "../common/Global";
import * as Message from "../../redux/constants/Message";


const deviceWidth = Dimensions.get("window").width;
class MessageListCell extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableHighlight onPress={()=> this.props._onSelect(this.props.rowData)} underlayColor={'rgba(0, 0, 0, 0.3)'} >
            <View >
                <View style={this.props.rowData.status== Message.STATUS_VIEWED ?styles.viewed_container:styles.container}>
                    <View >
                        <Text style={styles.text}>{this.props.rowData.title}</Text>
                        <Text
                            ellipsizeMode={"middle"} numberOfLines={1} style={styles.content}>{this.props.rowData.content}</Text>
                    </View>
                    <Text style={styles.date}>{this.props.rowData.date}</Text>
                </View>
                <View style={{backgroundColor: "#dddddd", height: 1}}/>
            </View>
            </TouchableHighlight>
        );
    }
}

const styles = {
    text: {
        fontSize: 16,
        color: "#000000",
    },
    content: {
        width:deviceWidth*0.7,
        fontSize: 15,
        marginTop:10,
        color:"rgba(0,0,0,0.40)",
    },
    container: {
        justifyContent:"space-between",
        flex:1,
        flexDirection: "row",
        height: 80,
        padding: 15,
        backgroundColor:"#ffffff"
    },
    viewed_container: {
        justifyContent:"space-between",
        flex:1,
        flexDirection: "row",
        height: 80,
        padding: 15,
        backgroundColor:"#f3f3f3"
    },
    date: {
        fontSize: 10,
        marginTop:8,
        alignItems:"flex-end",
        textAlign:"right",
        color: "rgba(0,0,0,0.40)",
    },
    image: {
        width: 18,
        height: 18,
    },


}

export default MessageListCell;