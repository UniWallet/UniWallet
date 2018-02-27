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
    Input,
    Form,
    Item,

    Separator,
    Text,
    Title,
} from "native-base";
import MyHeader from "../common/MyHeader"
import Global from "../common/Global"
import {web3} from "../../libs/web3";
import getString from "../../translations/index";
import config from '../../configs';
import * as Validation from "../../libs/validation";
import * as Log from "../../libs/Log";

class Web3Settings extends Component {
    constructor(props){
        super(props);
        if (this.props.setting && this.props.setting.web3url) {
            this.state = {web3url: this.props.setting.web3url}
        } else {
            this.state = {web3url: config.web3Url}
        }

        if (this.props.setting && this.props.setting.apiurl) {
            this.state = {
              ...this.state,
                apiurl: this.props.setting.apiurl}
        } else {
            this.state = {
                ...this.state,
                apiurl: config.apiUrl}
        }
    }

    _setDefaultUrl(){
        Log.log("restore url: " + config.web3Url + " " + config.apiUrl)
        this.setState({web3url:config.web3Url, apiurl:config.apiUrl});
    }

    _save(){
        const {actions} = this.props;
        if (Validation.checkUrl(this.state.web3url) && Validation.checkUrl(this.state.apiurl)) {
            actions.updateSetting({
                web3url: this.state.web3url,
                apiurl: this.state.apiurl
            })
            this.props.navigation.goBack()
        } else {
            actions.toast(getString("invalid_url"))
        }
    }

    _updateUrls() {
        if (this.props.setting && this.props.setting.web3url && this.props.setting.apiurl) {
            Log.log("set: " + this.props.setting.web3url + " " + this.props.setting.apiurl);
            this.setState({web3url: this.props.setting.web3url, apiurl: this.props.setting.apiurl});
        } else {
            this._setDefaultUrl();
        }
    }

    componentWillReceiveProps(nextProps){
        Log.log("componentWillReceiveProps")
        Log.log(this.props.setting)
        if ((nextProps.setting.web3url == this.props.setting.web3url) && (nextProps.setting.apiurl == this.props.setting.apiurl)) {
            return;
        }
        this._updateUrls();
    }

    render() {
        return (<Container>
            <MyHeader headerColor="#ffffff"
                      titleColor='#000000'
                      iconColor='#000000'
                // rightIconName="menu"
                      titleName={getString("web3_settings")}
                      rightText={getString("save")}
                      rightOnPress={()=>this._save()}
                      {...this.props}
            />
            <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
                <Text style={styles.text}>Web3 Url</Text>
                <Form>
                    <Item>
                        <Input style={styles.input_text} value={this.state.web3url} onChangeText={(web3url)=>{this.setState({web3url})}} />
                    </Item>
                </Form>
                <Text style={styles.text}>API Url</Text>
                <Form>
                    <Item>
                        <Input style={styles.input_text} value={this.state.apiurl} onChangeText={(apiurl)=>{this.setState({apiurl})}} />
                    </Item>
                </Form>
                <Text style={styles.default_url} onPress={()=>this._setDefaultUrl()}>{getString("set_as_default_url")}</Text>
            </View>
        </Container>)
    }

}

const styles = StyleSheet.create({
    text: {
        fontSize: 15,
        textAlign:"left",
        paddingLeft: 20,
        paddingTop: 15,
        color: "rgba(0, 0, 0, 0.87)",
    },
    default_url: {
        fontSize: 16,
        textAlign: "center",
        padding: 15,
        color: Global.primaryColor,
    },
    input_text: {
        fontSize: 15,
        color: "rgba(0, 0, 0, 0.54)",
    },
    image: {
        width: 18,
        height: 18,
    },
});

export default Web3Settings;

export const WrappedComponent = Web3Settings;
export function mapStateToProps(state) {
    return {
        setting: state.setting,
    }
}