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
    Form, Item, Input,
    Title,
} from "native-base";
import MyHeader from "../common/MyHeader"
import Global from "../common/Global"
import getString from "../../translations/index";
import * as utils from '../../libs/utils';
import * as Log from "../../libs/Log"
import I18n, { getLanguages } from 'react-native-i18n';
import * as etherutils from '../../libs/etherutils';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function MySleep(index, delayperiod) {
    await sleep((index-1)*delayperiod)
    return index;
}

class MessageTest extends Component {
    constructor(props) {
        super(props);
        const { actions } = this.props;
        this.state = {
            from: null,
            to: null,
            amount: 1,
            contract_address: "0x917927677ec54edd264da3db3a668088f4810bc3",
            gas_price: 40,
            gas_limit: 60000,
            password: "1234",
            test_count: 2,
            delay_period: 60000,
        };
    }

    _startTransfer(index, thisobj) {
        Log.log("===== " + index + " ========")
        const { actions } = thisobj.props;
        var params = thisobj.props.navigation.state.params;
        var contractParams = null;
        var nonceParams = null;
        let isEth = thisobj.state.contract_address? false:true;
        var address = thisobj.state.to.toLowerCase();
        if (isEth) {
            let gasPrice = thisobj.state.gas_price * Global.GWei2Wei;
            let gasLimit = Math.round(thisobj.state.gas_limit);
            txParams = {
                value: index*Global.ETH2Wei, //this.state.amount*Global.ETH2Wei,
                gasPrice,
                gasLimit,
                to: address,
                data: null
            }
        } else {
            let token_amount = index*Global.ETH2Wei; //this.state.amount*ETH2Wei;
            let gasPrice = thisobj.state.gas_price * Global.GWei2Wei;
            let gasLimit = Math.round(thisobj.state.gas_limit);
            txParams = {
                value: 0,
                gasPrice,
                gasLimit,
                to: this.state.contract_address.toLowerCase(),
                data: etherutils.getTokenTransferABI(thisobj.state.contract_address.toLowerCase(), address, token_amount, thisobj.props.wallet.cur_wallet.address)
            }

            contractParams = {
                value: token_amount,
                to: address,
            }
        }

        /* double check the pending transaction number */
        var pendingNum = etherutils.getTransactionPendingNum(thisobj.props.transaction, thisobj.props.wallet.cur_wallet.address.toLowerCase());
        nonceParams = {
            pendingNum:0
        }
        actions.sendTransaction({
            loading: getString("transaction_send_loading"),
            wallet: this.props.wallet.cur_wallet,
            pwd:this.state.password,
            params: txParams,
            contractParams,
            nonceParams,
            resolved: (result) => {
                Log.log("send transaction success: " + index);
                actions.startUpdate();
            },
            rejected: (error) => {
                if (error) {
                    Log.log("send transaction fail code:" + error.code + " data:" + error.data + " desc:" + error.toString());
                } else {
                    Log.log("send transaction fail");
                }
                if (error) {
                    actions.toast(getString("transfer_error_fail") + ": " + error.toString() + " index: " + index)
                } else {
                    actions.toast(getString("transfer_error_fail: " + index))
                }
            }
        });
    }

    _startTest() {
        Log.log("start testing ...");
        Log.log("total: " + this.state.test_count);

        for (var i=0; i<this.state.test_count; i++) {
            Log.log("testing: " + i);

            let thisobj = this;
            MySleep((i+1), this.state.delay_period).then(
              function (result) {
                  Log.log("result is: " + result);
                  thisobj._startTransfer(result, thisobj);
              }
            );
        }
    }

    render() {
        return (<Container>
            <MyHeader headerColor="#ffffff"
                      titleColor='#000000'
                      iconColor='#000000'
                      titleName={getString("test_message")}
                      rightText={"go"}
                      rightOnPress={()=>this._startTest()}
                      {...this.props}
            />
            <Form style={{marginLeft: 5, marginRight: 15, paddingTop: 6}}>
                <Item>
                    <Text>To: </Text>
                    <Input defaultValue={this.state.to} onChangeText={(to) => this.setState({to})}/>
                </Item>
            </Form>
            <Form style={{marginLeft: 5, marginRight: 15, paddingTop: 6}}>
                <Item>
                    <Text>Amount: </Text>
                    <Input defaultValue={this.state.amount.toString()} onChangeText={(amount) => this.setState({amount})}/>
                </Item>
            </Form>
            <Form style={{marginLeft: 5, marginRight: 15, paddingTop: 6}}>
                <Item>
                    <Text>Contract: </Text>
                    <Input defaultValue={this.state.contract_address} onChangeText={(contract_address) => this.setState({contract_address})}/>
                </Item>
            </Form>
            <Form style={{marginLeft: 5, marginRight: 15, paddingTop: 6}}>
                <Item>
                    <Text>Gas Price: </Text>
                    <Input defaultValue={this.state.gas_price.toString()} onChangeText={(gas_price) => this.setState({gas_price})}/>
                </Item>
            </Form>
            <Form style={{marginLeft: 5, marginRight: 15, paddingTop: 6}}>
                <Item>
                    <Text>Gas Limit: </Text>
                    <Input defaultValue={this.state.gas_limit.toString()} onChangeText={(gas_limit) => this.setState({gas_limit})}/>
                </Item>
            </Form>
            <Form style={{marginLeft: 5, marginRight: 15, paddingTop: 6}}>
                <Item>
                    <Text>Password: </Text>
                    <Input defaultValue={this.state.password.toString()} onChangeText={(password) => this.setState({password})}/>
                </Item>
            </Form>
            <Form style={{marginLeft: 5, marginRight: 15, paddingTop: 6}}>
                <Item>
                    <Text>Test Count: </Text>
                    <Input defaultValue={this.state.test_count.toString()} onChangeText={(test_count) => this.setState({test_count})}/>
                </Item>
            </Form>
            <Form style={{marginLeft: 5, marginRight: 15, paddingTop: 6}}>
                <Item>
                    <Text>Delay Period: </Text>
                    <Input defaultValue={this.state.delay_period.toString()} onChangeText={(delay_period) => this.setState({delay_period})}/>
                </Item>
            </Form>
        </Container>)
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 17,
        color: Global.primaryContentColor,
    },
    image: {
        width: 18,
        height: 18,
    },
});
export default MessageTest;

export const WrappedComponent = MessageTest;
export function mapStateToProps(state) {
    return {
        setting: state.setting,
        wallet: state.wallet,
        transaction: state.transaction,
    }
}