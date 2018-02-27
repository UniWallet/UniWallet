import React, {Component} from "react";
import {Platform} from "react-native";
import {
    Container,
} from "native-base";
import MyHeader from "../common/MyHeader"

import JPushModule from 'jpush-react-native';
// ...the rest of your code
import * as transactionService from "../../services/transaction"
import crypto from 'crypto'
import {web3} from "../../libs/web3"
const EthereumTx = require('ethereumjs-tx')
import * as importTypes from '../../redux/constants/WalletImportType';
import * as Log from "../../libs/Log"

import * as storageService from '../../services/storage';
const datas = [
    {
        hash: '0x2c5dd5b703b10574e2b3c2052952ca0ba4cf0cd4a7095418519e11e517c396aa',
        block: 21,
        from: '0xCa911963c4Dd30929f0c909818083eA9051200c0',
        to: '0x02bb163Af3c82E085808f68C6Eda055D30A57Ba7',
        gas: 21000,
        gasPrice: '1260000000000000',
        value: '5000000000000000000',
        nonce: 1,
        timestamp: 1509093475464
    },
    {
        hash: '0x2c5dd5b703b10574e2b3c2052952ca0ba4cf0cd4a7095418519e11e517c396aa',
        block: 21,
        from: '0x02bb163Af3c82E085808f68C6Eda055D30A57Ba7',
        to: '0x02bb163Af3c82E085808f68C6Eda055D30A57Ba7',
        gas: 21000,
        gasPrice: '1260000000000000',
        value: '5000000000000000000',
        nonce: 1,
        timestamp: 1509093475464
    },
    {
        hash: '0x2c5dd5b703b10574e2b3c2052952ca0ba4cf0cd4a7095418519e11e517c396aa',
        block: 21,
        from: '0x02bb163Af3c82E085808f68C6Eda055D30A57Ba7',
        to : '0xCa911963c4Dd30929f0c909818083eA9051200c0',
        gas: 21000,
        gasPrice: '1260000000000000',
        value: '5000000000000000000',
        nonce: 1,
        timestamp: 1509093475464
    },
];

class GlobalTest extends Component {
    constructor(props) {
        super(props);
    }

    __loadDefaultWallet() {
        const testKeyStore = "{\"address\":\"4dacd41b0fd2c7ad3f02c74236871a3854016979\",\"crypto\":{\"cipher\":\"aes-128-ctr\",\"ciphertext\":\"7f0cdb11c7210af3eea9f2832db567382db40c170d8c42f8c325da7ffcfa59d8\",\"cipherparams\":{\"iv\":\"1dc2322c7fbce5d27bd0516857cc9aa2\"},\"kdf\":\"scrypt\",\"kdfparams\":{\"dklen\":32,\"n\":262144,\"p\":1,\"r\":8,\"salt\":\"2990168875c53c448d668d0c93539d3e85278778c94cf6aa43a22fae63c7fd37\"},\"mac\":\"ff1ad03ad49ed336d66b240fc56b05647044dda6cbf186c00c692f3b9b317107\"},\"id\":\"0953cda8-5640-4c3b-b5b2-8ea511dd496f\",\"version\":3}";
        const testPassword = '1234';
        console.log("加载测试钱包");
        actions.importWallet({
            input: JSON.parse(testKeyStore),
            pwd: testPassword,
            type: importTypes.IMPORT_KEY_STORE,
            resolved: ()=> {
                actions.toast(getString(import_wallet_ok));
            }
        });
    }

    componentDidMount() {
	if (Platform.OS === 'android') {
	    //Only android needs this
	    JPushModule.notifyJSDidLoad((resultCode) => {
		// do something
	    });
	}
        JPushModule.addReceiveCustomMsgListener((message) => {
            this.setState({pushMsg: message});
        });
        JPushModule.addReceiveNotificationListener((message) => {
            console.log("receive notification: " + message);
        })
        JPushModule.addReceiveOpenNotificationListener((map) => {
            console.log("Opening notification!");
            console.log("map.extra: " + map.extras);
        });
        const { actions } = this.props;
        actions.getWalletFromStorage({
            resolved: (result)=> {
                if (result) {
                    Log.log(result);
                    actions.toast("加载钱包成功");
                } else {
                    const testKeyStore = "{\"address\":\"4dacd41b0fd2c7ad3f02c74236871a3854016979\",\"crypto\":{\"cipher\":\"aes-128-ctr\",\"ciphertext\":\"7f0cdb11c7210af3eea9f2832db567382db40c170d8c42f8c325da7ffcfa59d8\",\"cipherparams\":{\"iv\":\"1dc2322c7fbce5d27bd0516857cc9aa2\"},\"kdf\":\"scrypt\",\"kdfparams\":{\"dklen\":32,\"n\":262144,\"p\":1,\"r\":8,\"salt\":\"2990168875c53c448d668d0c93539d3e85278778c94cf6aa43a22fae63c7fd37\"},\"mac\":\"ff1ad03ad49ed336d66b240fc56b05647044dda6cbf186c00c692f3b9b317107\"},\"id\":\"0953cda8-5640-4c3b-b5b2-8ea511dd496f\",\"version\":3}";
                    const testPassword = '1234';
                    console.log("加载测试钱包");
                    actions.importWallet({
                        input: JSON.parse(testKeyStore),
                        pwd: testPassword,
                        type: importTypes.IMPORT_KEY_STORE,
                        resolved: ()=> {
                            actions.toast('导入测试钱包成功');
                        }
                    });
                }
            },
            rejected: ()=> {
                const testKeyStore = "{\"address\":\"4dacd41b0fd2c7ad3f02c74236871a3854016979\",\"crypto\":{\"cipher\":\"aes-128-ctr\",\"ciphertext\":\"7f0cdb11c7210af3eea9f2832db567382db40c170d8c42f8c325da7ffcfa59d8\",\"cipherparams\":{\"iv\":\"1dc2322c7fbce5d27bd0516857cc9aa2\"},\"kdf\":\"scrypt\",\"kdfparams\":{\"dklen\":32,\"n\":262144,\"p\":1,\"r\":8,\"salt\":\"2990168875c53c448d668d0c93539d3e85278778c94cf6aa43a22fae63c7fd37\"},\"mac\":\"ff1ad03ad49ed336d66b240fc56b05647044dda6cbf186c00c692f3b9b317107\"},\"id\":\"0953cda8-5640-4c3b-b5b2-8ea511dd496f\",\"version\":3}";
                const testPassword = '1234';
                console.log("加载测试钱包");
                actions.importWallet({
                    input: JSON.parse(testKeyStore),
                    pwd: testPassword,
                    type: importTypes.IMPORT_KEY_STORE,
                    resolved: ()=> {
                        actions.toast(getString(import_wallet_ok));
                    }
                });
            },
        });
    }

    componentWillUnmount() {
        JPushModule.removeReceiveCustomMsgListener();
        JPushModule.removeReceiveNotificationListener();
    }

    _onRightPress() {
        const txParams = {
            value: '0x080',
            gasPrice: '0x09184e72a000',
            gasLimit: '0x271000',
            to: '0x81bc96f4469b73aacbc215f7e14366848ab0f52f',
            data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
        }
        this.props.actions.send(txParams);
        // const privateKey = '0xe331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109';
        // web3.eth.accounts.signTransaction(txParams, privateKey).
        // then(
        //   (result) => {
        //       console.log(result);
        //       web3.eth.sendSignedTransaction(result.rawTransaction)
        //   },
        //   (error) => {
        //       console.log(error);
        //   }).then(
        //   (hash)=> {
        //     console.log(hash);
        //     web3.eth.getTransaction(hash)
        //   },
        //   (error) => {
        //       console.log(error);
        //   });

        // const privateKey = Buffer.from('cdd0d0f5c7d39b7f56a55a17e56cffcb102541c8d7721a903cc4dd088a567ebc', 'hex')
        // const tx = new EthereumTx(txParams)
        // tx.sign(privateKey)
        // const serializedTx = tx.serialize().toString('hex')
        // const txRaw = '0x' + serializedTx
        //     web3.eth.sendSignedTransaction(txRaw).then(
        //       (result) => {
        //           console.log(result);
        //           web3.eth.getTransaction(result.transactionHash)
        //             .then(
        //               (ret) => {
        //                   console.log(ret);
        //               },
        //               (error) => {
        //                   console.log(error);
        //               },
        //             );
        //       },
        //       (error) => {
        //           console.log(error);
        //       }
        //     )
        // });
    }

    async _testStorage(){
        Log.log("*********************************************************")
        Log.log("_testStorge start:"+new Date().getTime());
        const tmp = await storageService.setItem("tmp",{storage:"storage test string"});
        Log.log("_testStorge set ok:"+new Date().getTime()+",value:"+tmp.storage);
        const tmp2 = await storageService.getItem("tmp");
        Log.log("_testStorge get ok:"+new Date().getTime()+",value:"+tmp2.storage);
        Log.log("==========================================================")
    }

    render() {
        // use crypto
        console.log("random:")
        console.log(crypto.randomBytes(32).toString('hex'))


        const privateKey = Buffer.from('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex')
        const txParams = {
            nonce: '0x00',
            gasPrice: '0x09184e72a000',
            gasLimit: '0x2710',
            to: '0x0000000000000000000000000000000000000000',
            value: '0x00',
            data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
        }
        const tx = new EthereumTx(txParams)
        tx.sign(privateKey)
        const serializedTx = tx.serialize().toString('hex')
        console.log("EthereumTx:")
        console.log(serializedTx)


        // 连接到以太坊节点
        var balance = web3.eth.getBalance("0x81bc96f4469b73aacbc215f7e14366848ab0f52f");
        balance.then((result) => {
              console.log("web3 balance:")
              console.log(result); // instanceof BigNumber
          },
          (result) => {
              console.log(result); // instanceof BigNumber
          }
        )
        //    .then((result) => {
        //       console.log("new account")
        //       console.log(result); // instanceof BigNumber
        //   },
        //   (result) => {
        //       console.log(result); // instanceof BigNumber
        //   }
        // )

        transactionService.getBalanceByAddress("0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a").then((data) => {
            console.log("etherscan balance:")
            console.log("balance result");
            console.log(data);
        })

        transactionService.getTransactionList("0x4dacd41b0fd2c7ad3f02c74236871a3854016979").then((data) => {
            console.log("web3 tx:")
            console.log("TransactionList result");
            console.log(data);
        });

        return (
            <Container>
                <MyHeader rightText="测试交易"
                          titleName="测试程序"
                          rightOnPress={this._onRightPress.bind(this)}
                          {...this.props}
                />
            </Container>
        );
    }
}

export default GlobalTest;
export const WrappedComponent = GlobalTest;