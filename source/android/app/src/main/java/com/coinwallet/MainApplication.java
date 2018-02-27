package com.coinwallet;

import cl.json.RNSharePackage;
import android.app.Application;

import com.facebook.react.ReactApplication;
import com.jadsonlourenco.RNShakeEvent.RNShakeEventPackage;
import com.instabug.reactlibrary.RNInstabugReactnativePackage;
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.rnfs.RNFSPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import cn.jpush.reactnativejpush.JPushPackage;
import com.coinwallet.NativeModule.YiYaNativePackage;
import com.coinwallet.NativeModule.AppBootMonitorPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  // 设置为 true 将不弹出 toast
  private boolean SHUTDOWN_TOAST = true;
  // 设置为 true 将不打印 log
  private boolean SHUTDOWN_LOG = false;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNShakeEventPackage(),
            		new RNInstabugReactnativePackage.Builder("b745dbcd4f028d48b070b48fffabe7ba",MainApplication.this)
							.setInvocationEvent("none")
							.setPrimaryColor("#1D82DC")
							.setFloatingEdge("left")
							.setFloatingButtonOffsetFromTop(250)
							.build(),
            new ReactNativeExceptionHandlerPackage(),
            new ReactNativeRestartPackage(),
            new FastImageViewPackage(),
            new RNFSPackage(),
            new RNDeviceInfo(),
            new SplashScreenReactPackage(),
            new RandomBytesPackage(),
            new OrientationPackage(),
            new AppBootMonitorPackage(),
            new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
            new RNI18nPackage(),
            new RCTCameraPackage(),
            new VectorIconsPackage(),
            new RNSharePackage(),
            new YiYaNativePackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    AppBootMonitorPackage.onBoot(this);
  }
}
