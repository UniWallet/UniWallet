package com.coinwallet.NativeModule;

import android.app.Application;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import android.util.Log;
import android.os.Bundle;
import android.content.Intent;

import com.coinwallet.YiYaHeadlessTaskService;

public class AppBootMonitorPackage implements ReactPackage {
    private static final String TAG = "AppBootMonitorPackage";
    public static void onBoot(Application context) {
        Log.d(TAG, "onBoot");
        Intent service = new Intent(context, YiYaHeadlessTaskService.class);
        Bundle headlessExtras = new Bundle();
        headlessExtras.putString("task", "AppBoot");
        headlessExtras.putBoolean("allowForground", true);
        service.putExtras(headlessExtras);
        context.startService(service);
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        return modules;
    }

    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
