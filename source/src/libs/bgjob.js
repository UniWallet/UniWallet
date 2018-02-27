import * as Log from "./Log"
import { AppRegistry, NativeModules } from 'react-native'

import BackgroundTask from '../bgtask'
import * as Message from "../libs/message"

var bgInit = false;
if (!bgInit) {
    bgInit = true
    //Android can monitor AppBoot event with HeadlessJsTask
    //But IOS lacks of this feature. However, react-native-background-fetch
    //can works well, it is a periodic job framework.
    AppRegistry.registerHeadlessTask('AppBoot', () => fn)
    BackgroundTask.define(async () => {
        Log.log("on background task")
        // Do something
        // Remember to call finish()
        BackgroundTask.finish()
    })
}

const fn = async (data) => {
    onAppBoot(data)
}

function onAppBoot(data) {
    Log.log("AppBoot test")
    Message.getManager();
}

export const schedule= () => {
    // TODO:empty implement
    Log.log("bgjob")
    BackgroundTask.schedule()
}
