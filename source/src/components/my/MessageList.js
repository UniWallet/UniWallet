import React, {Component} from "react";
import {StatusBar, View, StyleSheet, Image,Dimensions} from 'react-native';
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

import MessageListCell from "./MessageListCell";
import getString from "../../translations/index";
import {
    ListView
} from 'react-native';
import MyHeader from "../common/MyHeader"
import Global from "../common/Global"
import * as messageConst from '../../redux/constants/Message';
import * as etherutils from '../../libs/etherutils';
import {getDateFromUnix} from "../../libs/utils";
import * as Log from "../../libs/Log"
import {formatTransactionBalance} from "../common/wallet_utils/wallet_utils";

const deviceHeight = Dimensions.get("window").height;

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1.id !== r2.id
});

class MessageList extends Component {

    constructor(props) {
        super(props);
        var title = "";
        if (this.props.navigation && this.props.navigation.state.params) {
            title = this.props.navigation.state.params.title;
        }
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            title: title,
            dataSource: null
        };
    }

    _onItemClicked(rowData) {
        const {actions} = this.props;
        actions.callService("openMessage", {
            id: rowData.id,
            navigation: this.props.navigation,
        },{
            resolved:(result) => {
                Log.log("open message success")
            },
            rejected:(error) => {
                Log.log("open message fail, " + error + error.data)
            },
        });
    }

    _generateMessageContent(msg) {
        if (msg.type == messageConst.TYPE_NEWTRANSACTION) {
            return getString("receiver")  + " : " +  msg.data.from;
        } else if (msg.type == messageConst.TYPE_CONFIRMTRANSACTION) {
            return   getString("sender") + " : " + msg.data.to;
        } else {
            //TODO:
            return ""+msg.description;
        }
    }
    _generateMessageTitle(msg) {
        if (msg.type == messageConst.TYPE_NEWTRANSACTION) {
            return getString("receivables_notice")  + ": " + formatTransactionBalance(msg.data, 4) + " " + msg.data.unit;
        } else if (msg.type == messageConst.TYPE_CONFIRMTRANSACTION) {
            return   getString("transfer_notice") + ": " + formatTransactionBalance(msg.data, 4) + " " + msg.data.unit ;
        } else {
            //TODO:
            return messageConst.getMessageTypeString(msg.type);
        }
    }

    _message_compare(a,b) {
        if (a.timestamp < b.timestamp)
            return 1;
        if (a.timestamp > b.timestamp)
            return -1;
        return 0;
    }

    _generateSource() {
        this.state.dataSource = []
        if(this.props.message.messages) {
            this.state.dataSource = []
            messages = this.props.message.messages.sort(this._message_compare.bind(this))
            for (let msg of messages) {
                if (msg.type == messageConst.TYPE_CONFIRMTRANSACTION
                    || msg.type == messageConst.TYPE_NEWTRANSACTION
                    || msg.type == messageConst.TYPE_SYSTEM
                    || msg.type == messageConst.TYPE_NEWS) {
                    Log.log(msg);
                    item = {
                        ...msg,
                        date: getDateFromUnix(msg.timestamp, "DD/MM/YYYY"),
                        title: this._generateMessageTitle(msg),
                        content: this._generateMessageContent(msg),
                    }
                    this.state.dataSource.push(item)
                }
            }
        }
    }

    _readAll(){
        if(this.state.dataSource===null||this.state.dataSource==='undefined'){
            return;
        }
        const {actions} = this.props;
        for(var i=0;i<this.state.dataSource.length;i++){
            var message = this.state.dataSource[i];
            if(message.status!=messageConst.STATUS_VIEWED){
                actions.changeMessageStatus(message.id, messageConst.STATUS_VIEWED)
            }
        }
    }

    render() {
        this._generateSource();
        return (<Container>
            <MyHeader headerColor="#ffffff"
                      titleColor='#000000'
                      iconColor='#000000'
                      rightText={getString('message_mark_all_read')}
                      titleName={this.state.title}
                      rightOnPress={()=>this._readAll()}
                      {...this.props}
            />
            <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
                    {(this.state.dataSource && this.state.dataSource.length > 0)?(<ListView
                        dataSource={ds.cloneWithRows(this.state.dataSource)}
                        renderRow={(rowData) => <MessageListCell rowData={rowData}
                        _onSelect={() => this._onItemClicked(rowData)} />} ></ListView>): (<View style={{flex:1,alignItems: "center"}}>
                        <Image source={Global.getImage("record_no")} style={{height: 60, width: 60,marginTop:deviceHeight*0.3}}/>
                        <Text style={styles.hint}>{getString("hint_no_records")}</Text>
                    </View>)}
            </View>
        </Container>)
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
    },
    date: {
        fontSize: 15,
        marginTop: 10,
        color: Global.primaryContentColor,
        // textAlign: 'left',
    },
    hint: {
        color: "#bbbbbb",
        fontSize: 14,
        height: 100, width: 140, textAlign: "center", marginTop: 10
    },
    icon: {
        width: 20,
        height: 20,
    },
    image: {
        width: 18,
        height: 18,
    },

});

export default MessageList;

export const WrappedComponent = MessageList;

export function mapStateToProps(state) {
    return {
        message: state.message,
    };
}