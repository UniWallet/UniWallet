import React,{
    Component
} from 'react';
import { Provider } from 'react-redux';
import configureStore from '../redux/store/configureStore';
import connectComponent from '../redux/utils/connectComponent';
import * as NavigationLayout from './Navigator';
import Orientation from 'react-native-orientation';
import * as bgjob from '../libs/bgjob';

const store = configureStore();

const AppNavigation = connectComponent(NavigationLayout);

import {Alert} from 'react-native';
import RNRestart from 'react-native-restart';
import {setJSExceptionHandler} from 'react-native-exception-handler';
import {setNativeExceptionHandler} from 'react-native-exception-handler/index';

class App extends Component {
    componentDidMount() {
        // this locks the view to Portrait Mode
        Orientation.lockToPortrait();

        // this locks the view to Landscape Mode
        // Orientation.lockToLandscape();

        // this unlocks any previous locks to all Orientations
        // Orientation.unlockAllOrientations();

        Orientation.addOrientationListener(this._orientationDidChange);
        bgjob.schedule();

        //error handling
        const errorHandler = (error, isFatal) => {
            if (isFatal) {
                if (__DEV__) {
                    Alert.alert(
                      'Unexpected error occurred',
                      `Error: ${(isFatal) ? 'Fatal:' : ''} ${error.name} ${error.message} ${error.stack}`,
                      [{
                          text: 'Restart',
                          onPress: () => {
                              RNRestart.Restart();
                          }
                      }]
                    );
                } else {
                    RNRestart.Restart();
                }
            } else {
                console.log(error);
            }
        };

        //enable exception handling even in dev mode
        setJSExceptionHandler(errorHandler, false);

        setNativeExceptionHandler((errorString) => {
            //report error
        });
    }

    _orientationDidChange = (orientation) => {
        if (orientation === 'LANDSCAPE') {
            // do something with landscape layout
        } else {
            // do something with portrait layout
        }
    }

    render() {
        return (
          <Provider store={store}>
              <AppNavigation/>
          </Provider>
        );
    }
}

export default App;
