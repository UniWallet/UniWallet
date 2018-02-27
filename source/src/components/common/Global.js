import {NavigationActions } from "react-navigation";
import {Dimensions} from 'react-native';
//exports == module.exports when initializing
exports.primaryColor = "rgb(40,217,227)"
exports.primaryContentColor = "rgba(0,0,0,0.54)"

const images = new Map([
    ["back", require("./res/back.png")],
    ["scan", require("./res/scan.png")],
    ["add", require("./res/add.png")],
    ["arrow_right", require("./res/arrow_right.png")],
    ["nav_assets_cur", require("./res/nav_assets_cur.png")],
    ["nav_assets_def", require("./res/nav_assets_def.png")],
    ["nav_find_cur", require("./res/nav_find_cur.png")],
    ["nav_find_def", require("./res/nav_find_def.png")],
    ["nav_market_cur", require("./res/nav_market_cur.png")],
    ["nav_market_def", require("./res/nav_market_def.png")],
    ["nav_USER_cur", require("./res/nav_USER_cur.png")],
    ["nav_USER_def", require("./res/nav_USER_def.png")],
    ["my_wallet", require("./res/my_wallet.png")],
    ["my_contact", require("./res/my_contact.png")],
    ["my_help", require("./res/my_help.png")],
    ["my_feedback", require("./res/my_feedback.png")],
    ["my_message", require("./res/my_message.png")],
    ["info_myself", require("./res/info_myself.png")],
    ["info_system", require("./res/info_system.png")],
    ["info_circle", require("./res/info_circle.png")],
    ["feedback_advice", require("./res/feedback_advice.png")],
    ["feedback_report", require("./res/feedback_report.png")],
    ["my_record", require("./res/my_record.png")],
    ["my_about", require("./res/my_about.png")],
    ["about_logo", require("./res/ic_launcher.png")],
    ["asset_import", require("./res/asset_import.png")],
    ["asset_setup", require("./res/asset_setup.png")],
    ["help_block", require("./res/help_block.png")],
    ["share", require("./res/share.png")],
    ["refresh", require("./res/refresh.png")],
    ["asset_menu", require("./res/header_menu.png")],
    ["asset_qr", require("./res/header_QR.png")],
    ["side_scan", require("./res/side_asset_scan.png")],
    ["side_qr", require("./res/side_asset_QR.png")],
    ["side_setup", require("./res/side_asset_setup.png")],
    ["side_import", require("./res/side_asset_into.png")],
    ["collect", require("./res/collect.png")],
    ["icon_receipt_small", require("./res/icon_receipt_small.png")],
    ["icon_transfer_small", require("./res/icon_transfer_small.png")],
    ["icon_asset_failed", require("./res/asset_failed.png")],
    ["language_selected", require("./res/language_selected.png")],
    ["copy_user_img", require("./res/copy_user_img.png")],
    ["user_default", require("./res/user_default.png")],
    ["contact_img", require("./res/contact_img.png")],
    ["record_no", require("./res/record_no.png")],
    ["asset_search_ETH", require("./res/asset_search_ETH.png")],
    ["lite_coin", require("./res/lite_coin.jpeg")],
    ["loopring_coin", require("./res/loopring_coin.png")],
    ["dsh_coin", require("./res/dsh_coin.jpeg")],
    ["money", require("./res/money.png")],
    ["in", require("./res/in.png")],
    ["out", require("./res/out.png")],
    ["management_setup", require("./res/management_setup.png")],
    ["management_into", require("./res/management_into.png")],
    ["transfer_address", require("./res/transfer_address.png")],
    ["transfer_sum", require("./res/transfer_sum.png")],
    ["transfer_comments", require("./res/transfer_comments.png")],
    ["settings", require("./res/settings.png")],
    ["wallet_icon_01", require("./res/account_mark01.png")],
    ["wallet_icon_02", require("./res/account_mark02.png")],
    ["wallet_icon_03", require("./res/account_mark07.png")],
    ["account_mark03", require("./res/account_mark03.png")],
    ["account_mark05", require("./res/account_mark05.png")],
    ["account_mark06", require("./res/account_mark06.png")],
    ["header_back_white", require("./res/header_back_white.png")],
    ["copy_top_bg", require("./res/copy_top_bg.png")],
    ["header_add", require("./res/header_add.png")],
    ["own_record_icon", require("./res/own_record_icon.png")],
    ["yiya_coin", require("./res/yiya_coin.png")],
    ["setUp_strong00", require("./res/setUp_strong_00.png")],
    ["setUp_strong01", require("./res/setUp_strong_01.png")],
    ["setUp_strong02", require("./res/setUp_strong_02.png")],
    ["setUp_strong03", require("./res/setUp_strong_03.png")],
    ["setUp_strong04", require("./res/setUp_strong_04.png")],
    ["head_management", require("./res/head_management.png")],
    ["setUp_bottom_row", require("./res/setUp_bottom_row.png")],
    ["head_menu", require("./res/head_menu.png")],
    ["head_payment", require("./res/head_payment.png")],
    ["newmsg", require("./res/newmsg.png")],
    ["close", require("./res/header_transfer_close.png")],
    ["red_point", require("./res/red_point.png")],
])

exports.getImage = function getImage(name) {
    return images.get(name)
}

exports.addressShortenLength = 20

exports.ETH2Wei = 1e18;
exports.GWei2Wei = 1e9;
exports.ETH_GAS_PRICE      = 20*1e9;
exports.ETH_GAS_LIMIT_LOW  = 126;
exports.ETH_GAS_LIMIT_HIGH = 126000;
exports.ETH_GAS_LIMIT_RATIO = 0.31;
exports.TOKEN_GAS_PRICE    = 20*1e9;
exports.TOKEN_GAS_LIMIT_LOW  = 294;
exports.TOKEN_GAS_LIMIT_HIGH = 294000;
exports.TOKEN_GAS_LIMIT_RATIO = 0.31;

exports.ETH_SYMBOL = "ETH"
exports.ETH_ADDRESS = "0x0"
exports.ETH_UNIT = "ether"
exports.ETH_DECIMAL = 18;

exports.DEFAULT_CONCURRENCY = "CNY"
exports.DEFAULT_LOCALE = "zh-CN"
exports.DEFAULT_CONCURRENCY_SYMBOL = "\u00A5"
exports.PRICE_CONCURRENCY = "USD"

exports.deviceWidth = Dimensions.get("window").width;
exports.Dp = Dimensions.get("window").width/160;

exports.getDpSize = function (size) {
   return Dimensions.get("window").width/160 * size;
}
exports.resetToPage = function (owner, routeName, params=null) {
    resetAction = NavigationActions.reset({
        index: 0,
        actions: [
            navigationAction = NavigationActions.navigate({
                routeName: routeName,
                params: Object.assign({
                    quiet: true
                }, params)
            })
        ]
    });
    owner.props.navigation.dispatch(resetAction);
}

exports.resetToPages = function (owner, pages) {
    actions = pages.map((item) => {
        return NavigationActions.navigate({
            routeName: item.routeName,
            params: item.params,
        })
    });

    resetAction = NavigationActions.reset({
        index: (actions.length -1),
        actions:actions,
    });
    owner.props.navigation.dispatch(resetAction);
}