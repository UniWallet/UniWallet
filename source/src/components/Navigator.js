import React, {Component} from 'react';

import { Root, View } from "native-base";
import {StackNavigator } from "react-navigation";
import Welcome from "./welcome/Welcome";
import  * as MyInfoComponent from "./my/MyInfo";

//Jivin add new code from here
import * as GlobalTestComponent from "./test/GlobalTest";
import * as MessageTestComponent from "./test/MessageTest";

import Settings from "./my/Settings";
import SimpleBrowser from "./browser/SimpleBrowser";
import About from "./my/About";
import Language from "./my/Language";
import MessageCenter from "./my/MessageCenter";
import MessageDetails from "./my/MessageDetails";
import  * as CoinUnitComponent from "./my/CoinUnit";
import  * as TestComponent from "./my/Test";
import * as MessageListComponent from "./my/MessageList";
import * as Web3SettingsComponent from "./my/Web3Settings"
import * as ImportComponent from "./import/Import";
import * as ManagerComponent from "./manager/Manager";
import * as Assets_qrcodeComponent from "./acc_qrcode/Assets_qrcode";
import * as Assets_coinactionComponent from "./acc_coinaction/Assets_coinaction";
import * as Assets_cointransferComponent from "./acc_cointransfer/Assets_cointransfer";
import QRCodeScreen from "./qr_reader/QRCodeScreen";
import * as WalletCreateComponent from "./create_wallet/WalletCreate";
import WalletCreateSuccess from "./create_wallet/WalletCreateSuccess";
import * as WalletBackupComponent from "./backup_wallet/WalletBackup";
import connectComponent from '../redux/utils/connectComponent';
import * as UtilsComponent from './common/Utils';
import * as AssetsComponent from './assets/Assets';
import * as ContactComponent from "./contact/Contact";
import * as NewContactComponent from "./contact/NewContact";
import * as SplashComponent from "./splash/splash"
import * as TransactDetailsComponent from "./my/TransactDetails"
import * as MainComponent from "./main/Main";
import Drawer from "./Drawer";

const Utils = connectComponent(UtilsComponent);
const Assets = connectComponent(AssetsComponent);
const Assets_cointransfer = connectComponent(Assets_cointransferComponent);
const Assets_coinaction = connectComponent(Assets_coinactionComponent);
const Contact = connectComponent(ContactComponent);
const NewContact = connectComponent(NewContactComponent);
const WalletCreate = connectComponent(WalletCreateComponent);
const WalletBackup = connectComponent(WalletBackupComponent);
const Assets_qrcode = connectComponent(Assets_qrcodeComponent);

const TransactDetails = connectComponent(TransactDetailsComponent);
const MessageList = connectComponent(MessageListComponent);

const Web3Settings = connectComponent(Web3SettingsComponent);
const CoinUnit = connectComponent(CoinUnitComponent);
const MyInfo = connectComponent(MyInfoComponent);
const Test = connectComponent(TestComponent);

const Import = connectComponent(ImportComponent);
const Manager = connectComponent(ManagerComponent);
const GlobalTest = connectComponent(GlobalTestComponent);
const MessageTest = connectComponent(MessageTestComponent);
const Splash = connectComponent(SplashComponent)
const Main = connectComponent(MainComponent)
const Navigator = StackNavigator(
    {
	    Drawer: { screen: Drawer },
        Splash: { screen: Splash },
        Welcome: { screen: Welcome,},
        Main: { screen: Main, },
        MyInfo: { screen: MyInfo, },
        GlobalTest: { screen: GlobalTest, },
        MessageTest: { screen: MessageTest, },
        About: { screen: About, },
        Settings: { screen: Settings, },
        SimpleBrowser: { screen: SimpleBrowser, },
        Import: { screen: Import, },
        Manager: { screen: Manager, },
        Contact: { screen: Contact, },
        NewContact: { screen: NewContact, },
        Assets: { screen: Assets },
        Assetsqrcode: {screen: Assets_qrcode},
        Assetscoinaction: {screen: Assets_coinaction},
        Assetscointransfer: {screen: Assets_cointransfer},
        QRReader: {screen: QRCodeScreen},
        WalletCreate: {screen: WalletCreate},
        WalletCreateSuccess: {screen: WalletCreateSuccess},
        WalletBackup: {screen: WalletBackup},
        Language:{screen:Language},
        Web3Settings:{screen:Web3Settings},
        CoinUnit:{screen:CoinUnit},
        Test:{screen:Test},
        MessageCenter:{screen:MessageCenter},
        MessageList:{screen:MessageList},
        MessageDetails:{screen:MessageDetails},
        TransactDetails:{screen:TransactDetails},
    },
    {
        initialRouteName: "Splash",
        headerMode: "none",
    }
);

class Navigation extends Component {
    render() {
        return (
            <Root>
                <Navigator/>
                <Utils/>
            </Root>
        )
    }
}

export const WrappedComponent = Navigation;
