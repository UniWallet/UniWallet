import React, {Component} from "react";
import {StyleSheet, StatusBar, View, WebView, Image} from 'react-native';

import {
    Container,
    Content,
    Header,
    Text,
    Left,
    Right,
    Button,
    Icon,
    Body,
    Title,
} from "native-base";
import MyHeader from "../common/MyHeader"
import Global from "../common/Global"
import Share, {ShareSheet} from 'react-native-share';

const WEBVIEW_REF = 'webview';

class SimpleBrowser extends Component {
    // eslint-disable-line
    constructor(props) {
        super(props);
        if (this.props.navigation && this.props.navigation.state.params) {
            this.state = {
                url: this.props.navigation.state.params.url,
                title: this.props.navigation.state.params.title,
                share: this.props.navigation.state.params.share,
                refresh: this.props.navigation.state.params.refresh,
            };
        } else {
            this.state = {
                url: 'http://www.baidu.com',
                title: '动态标题',
                share: false,
                refresh: false,
            };
        }
    }

    _reload() {
        this.refs[WEBVIEW_REF].reload();
    }

    _onSharePress() {
        let shareOptions = {
            title: "内容来自:" + this.state.title,
            message: this.state.url
        };

        Share.open(shareOptions)
    }

    render() {
        return (
            <Container>
                <View style={{backgroundColor: "transparent"}}>
                    <View style={{backgroundColor: "transparent", height: StatusBar.currentHeight}}/>
                    <Header noShadow style={{backgroundColor:"white", height:52,
                        paddingLeft: 0, marginRight: 0, paddingRight:0, marginLeft:0,
                        borderBottomWidth: 0, borderBottomColor: 'rgba(0,0,0,0.16)',
                        borderLeftWidth: 0, borderRightWidth: 0}}>
                        <Left style={{flex:1}}>
                            <Button transparent style={{marginLeft:10}} onPress={()=> {
                                this.props.navigation.goBack()
                            }}>
                                <Image source={Global.getImage("back")} style={styles.image}/>
                            </Button>
                        </Left>
                        <Body style={{flex:1.6}}>
                        <Text style={{
                            alignSelf: 'center',
                            color: this.props.titleColor ? this.props.titleColor:'rgba(0,0,0,0.87)',
                            fontSize: 20
                        }}>{this.state.title}</Text>
                        </Body>
                        <Right style={{flex:1}}>
                            {this.state.refresh==true?(<Button transparent onPress={this._reload.bind(this)}>
                                <Image source={Global.getImage("refresh")} style={styles.image}/>
                            </Button>):null}
                            {this.state.share==true?(<Button transparent style={{marginRight:0, paddingLeft:10, paddingRight:20}} onPress={this._onSharePress.bind(this)}>
                                <Image source={Global.getImage("share")} style={styles.image}/>
                            </Button>):null}
                        </Right>
                    </Header>
                    <StatusBar
                      backgroundColor="transparent"
                      translucent={true}
                      hidden={false}
                      animated={true}
                    />
                </View>

                <Content contentContainerStyle={{flex: 1}}>
                    <Content contentContainerStyle={{flex: 1}}>
                        <WebView source={{ uri: this.state.url }} ref={WEBVIEW_REF}/>
                    </Content>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        marginLeft:0,
        width:25,
        height:25,
    },
});

export default SimpleBrowser;