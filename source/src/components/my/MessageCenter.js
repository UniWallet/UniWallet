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

class MessageCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {newAnnouncement: false, newMessage: false}
    }

    _onMessageClicked() {
        this.props.navigation.navigate('MessageList', {title: getString("my_message")})
    }

    _onAnnouncementClicked() {
        this.props.navigation.navigate('MessageList', {title: getString("system_announcement")})
    }

    render() {
        return (<Container>
            <MyHeader headerColor="#ffffff"
                      titleColor='#000000'
                      iconColor='#000000'
                // rightIconName="menu"
                      titleName={getString("message_center")}
                      statusBarBgColor= "#000000"
                      {...this.props}
            />
            <View style={{flex: 1, backgroundColor: '#EEEEEE'}}>
                <View style={{backgroundColor: "#FFFFFF"}}>
                    <View style={{backgroundColor: "#EEEEEE", height: 10}}/>
                    <ListItem onPress={() => this._onAnnouncementClicked()}>
                        <View style={styles.iconParent}>
                            <Image source={Global.getImage("info_system")} style={styles.icon}/>
                            {this.state.newAnnouncement == true ? (
                                <Image source={Global.getImage("info_circle")} style={styles.dot}/>) : null}
                        </View>
                        <Body>
                        <Text style={styles.text}>{getString("system_announcement")}</Text>
                        </Body>
                        <Right>
                            <Image source={Global.getImage("arrow_right")} style={styles.image}/>
                        </Right>
                    </ListItem>
                    <ListItem onPress={() => this._onMessageClicked()}>
                        <View style={styles.iconParent}>
                            <Image source={Global.getImage("info_myself")} style={styles.icon}/>
                            {this.state.newMessage == true ? (
                                <Image source={Global.getImage("info_circle")} style={styles.dot}/>) : null}
                        </View>
                        <Body>
                        <Text style={styles.text}>{getString("my_message")}</Text>
                        </Body>
                        <Right>
                            <Image source={Global.getImage("arrow_right")} style={styles.image}/>
                        </Right>
                    </ListItem>
                </View>
            </View>
        </Container>)
    }

}

const styles = StyleSheet.create({
    text: {
        fontSize: 17,
        color: Global.primaryContentColor,
    },
    dot: {
        width: 3,
        height: 3,
    },
    icon: {
        width: 20,
        height: 20,
    },
    iconParent: {
        marginLeft: 10,
        flexDirection: "row",
        width: 30,
        height: 20,
    },
    image: {
        width: 18,
        height: 18,
    },

});

export default MessageCenter;