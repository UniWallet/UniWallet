const React = require("react-native");

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
    container: {
        backgroundColor: "#FFF"
    },
    text: {
        alignSelf: "center",
        marginBottom: 7
    },
    icon: {
        width: 60,
        height: 60,
    },
    hinticon: {
        width: 3,
        height: 13,
    },
    itemhead: {
        flex: 1,
        flexDirection:'row',
        justifyContent:"space-between"
    },
    listitem: {
        marginLeft:0,
        marginRight:0,
        borderBottomWidth:0,
        paddingTop:1,
        paddingBottom:1,
        paddingLeft:18,
        paddingRight:18,
        backgroundColor: "transparent"
    },
    card: {
        marginTop:0,
        marginBottom: 12,
        elevation:8
    },
    carditem: {

    }
};
