import React, {Component} from "react";
import {StatusBar, View, StyleSheet, Image} from 'react-native';
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

class MessageDetails extends Component {

    constructor(props) {
        super(props);
        if (this.props.navigation && this.props.navigation.state.params) {
            this.state = {
                title: this.props.navigation.state.params.title,
                date: this.props.navigation.state.params.date,
                content: this.props.navigation.state.params.content,
                author: this.props.navigation.state.params.author,
            };
        }
    }

    render() {
        return (<Container>
            <MyHeader headerColor="#ffffff"
                      titleColor='#000000'
                      iconColor='#000000'
                      titleName={getString("message_details")}
                      {...this.props}
            />
            <View style={{flex: 1, backgroundColor: "#FFFFFF", padding: 20}}>
                <Text style={styles.text}>{this.state.title}</Text>
                <Text style={styles.date}>{this.state.date}</Text>
                <Text style={styles.content}>{this.state.content}</Text>
                <Text style={styles.foot}>{this.state.author}</Text>
            </View>
        </Container>)
    }

}

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
    },
    date: {
        fontSize: 14,
        marginTop: 5,
        color: Global.primaryContentColor,
        // textAlign: 'left',
    },
    content: {
        fontSize: 16,
        marginTop: 10,
        lineHeight:20,
        color: Global.primaryContentColor,
    },
    foot: {
        marginTop: 10,
        fontSize: 15,
        color: Global.primaryContentColor,
        textAlign: 'right',
    },

});

export default MessageDetails;