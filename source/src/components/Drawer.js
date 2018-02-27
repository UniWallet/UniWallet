import React from "react";
import { DrawerNavigator } from "react-navigation";
const Reactx = require("react-native");
const { StyleSheet, Dimensions, Platform } = Reactx;

import * as ImportComponent from "./import/Import";
import * as Assets_qrcodeComponent from "./acc_qrcode/Assets_qrcode";
import * as WalletCreateComponent from "./create_wallet/WalletCreate";
import connectComponent from '../redux/utils/connectComponent';
import * as AssetsComponent from './assets/Assets';
import * as NewAssetsComponent from './assets/NewAssets';
import * as SideBarComponent from "./sidebar/SideBar";
import * as TransactHistoryComponent from "./my/TransactHistory"

const Assets = connectComponent(AssetsComponent);
const NewAssets = connectComponent(NewAssetsComponent);
const WalletCreate = connectComponent(WalletCreateComponent);
const Import = connectComponent(ImportComponent);
const SideBar = connectComponent(SideBarComponent);
const Assets_qrcode = connectComponent(Assets_qrcodeComponent);
import QRCodeScreen from "./qr_reader/QRCodeScreen";
const TransactHistory = connectComponent(TransactHistoryComponent);

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const AssetsDrawer = DrawerNavigator(
  {
        Import: { screen: Import,
            navigationOptions: ({navigation}) => ({
                drawerLockMode: 'locked-closed'
            })
        },
        Assets: { screen: Assets },
        NewAssets: { screen: NewAssets,
            navigationOptions: ({navigation}) => ({
                drawerLockMode: 'locked-closed'
            })},
        Assetsqrcode: {screen: Assets_qrcode,
            navigationOptions: ({navigation}) => ({
                drawerLockMode: 'locked-closed'
            })},
        WalletCreate: {screen: WalletCreate,
            navigationOptions: ({navigation}) => ({
                drawerLockMode: 'locked-closed'
            })},
        QRCodeScreen: {screen: QRCodeScreen,
            navigationOptions: ({navigation}) => ({
                drawerLockMode: 'locked-closed'
            })},
      TransactHistory: { screen: TransactHistory,
          navigationOptions: ({navigation}) => ({
              drawerLockMode: 'locked-closed'
          })}
  },
  {
    initialRouteName: "Assets",
    contentOptions: {
        activeTintColor: "#e91e63"
    },
    drawerWidth: deviceWidth*0.6,
    contentComponent: props => <SideBar {...props} />
  }
);

export default AssetsDrawer;
