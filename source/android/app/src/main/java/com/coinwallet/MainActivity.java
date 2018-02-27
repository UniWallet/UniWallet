package com.coinwallet;

import com.facebook.react.ReactActivity;
import android.os.Bundle;
import android.content.Intent; // <--- import
import android.content.res.Configuration; // <--- import
import org.devio.rn.splashscreen.SplashScreen; // here
import com.baidu.mobstat.StatService; //baidu mtj
import com.facebook.react.ReactInstanceManager;

public class MainActivity extends ReactActivity {
    static String currentLocale;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
            SplashScreen.show(this);  // here
            super.onCreate(savedInstanceState);

            StatService.start(this);

            if (BuildConfig.DEBUG) { //if debug, start the baidu mtj debug
                StatService.setDebugOn(true);
            }

            //update the current locale
            MainActivity.currentLocale = getResources().getConfiguration().locale.toString();
    }
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "CoinWallet";
    }

    @Override
      public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);

        String locale = newConfig.locale.toString();
        if (!MainActivity.currentLocale.equals(locale)) {
            MainActivity.currentLocale = locale;
            final ReactInstanceManager instanceManager = getReactInstanceManager();
            instanceManager.recreateReactContextInBackground();
        }
    }
}
