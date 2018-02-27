const React = require("react-native");

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    content: {
        flex: 1,
        width: null,
        height: null
    },
    backgroundImage: {
        flex: 1,
        width:null,
        resizeMode:"stretch",
    },
    logoContainer: {
        flex: 1,
        marginTop: deviceHeight / 8,
        marginBottom: 30
    },
    logo: {
        position: "absolute",
        left: Platform.OS === "android" ? 40 : 50,
        top: Platform.OS === "android" ? 35 : 60,
        width: 280,
        height: 100
    },

    header: {
        flexDirection: "row",
        justifyContent: 'space-between',
        width: deviceWidth,
        height: 40
    },
    text: {
        alignSelf: "center",
        marginBottom: 7,
        color: "#ffffffde"
    },
    textcolor: {
        alignSelf: "center",
        marginBottom: 7,
        color: "#ffffff8A"
    },
    textcolor2: {
        width:deviceWidth/1.5,
        alignSelf: "center",
        marginBottom: 7,
        color: "#ffffff8A"
    },
    icon: {
        width: 20,
        height: 20,
    },
    foot_icon: {
        width: 23,
        height: 23,
    },
    btn: {
        width: 50,
        height: 50,
    },
    button: {
        backgroundColor: '#ffffffff'
    },
    mb: {
        marginBottom: 15
    },
    itemhead: {
        flex: 1,
        flexDirection:'row',
        justifyContent:"space-between"
    },
    lastitemhead: {
        height: 48,
        justifyContent:"center",
        flexDirection: "row",
        alignItems:"center"
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
    itemicon: {
        width: 40,
        height: 40,
    },
    lastitemicon: {
        flex: 1,
        resizeMode: 'contain',
        width: 20,
        height: 20,
    },
    card: {
        marginTop:0,
        marginBottom: 12,
        elevation:8
    },
    carditem: {

    },
    backup_hint: {
        borderColor:"rgb(238,181,147)",
        color: "rgb(238,181,147)",
        textAlign: 'center',
        fontSize: 6.8,
        borderWidth: 0.5,
        borderRadius: 8,
        height:13,
        width:32,
        paddingTop:1,
        paddingBottom:0,
        marginBottom:6,
        alignSelf:"center",
        textAlign:"center",
    },
};
