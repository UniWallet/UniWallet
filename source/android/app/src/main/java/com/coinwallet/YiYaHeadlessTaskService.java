package com.coinwallet;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.util.Log;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.facebook.react.HeadlessJsTaskService;
import java.util.concurrent.TimeUnit;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.jstasks.HeadlessJsTaskEventListener;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.facebook.react.jstasks.HeadlessJsTaskContext;
import com.facebook.react.ReactInstanceManager;
import java.lang.reflect.Method;

public class YiYaHeadlessTaskService extends HeadlessJsTaskService {
    private static final String TAG = "YiYaHeadlessTaskService";
    private static final boolean FIX_HEADLESS_UI_THREAD_ISSUE_FOR_048 = true;
    private Method mStartMethod = null;

    @Override
    public void onCreate() {
        initHook();
        super.onCreate();
    }

    private void initHook() {
        try {
            mStartMethod = HeadlessJsTaskService.class.getDeclaredMethod("invokeStartTask",
                    new Class[] { ReactContext.class, HeadlessJsTaskConfig.class });
            mStartMethod.setAccessible(true);
        } catch(Exception e) {
            Log.d(TAG, "init hooker fail", e);
        }
    }

    private void invokeStartTask(ReactContext reactContext, HeadlessJsTaskConfig taskConfig) {
        if (mStartMethod != null) {
            try {
                mStartMethod.invoke(this, new Object[] {reactContext, taskConfig});
            } catch(Exception e) {
                Log.d(TAG, "call invokeStartTask fail", e);
            }
        }
    }

    @Override
    protected void startTask(final HeadlessJsTaskConfig taskConfig) {
        if (!FIX_HEADLESS_UI_THREAD_ISSUE_FOR_048) {
            super.startTask(taskConfig);
            return;
        }
        UiThreadUtil.assertOnUiThread();
        acquireWakeLockNow(this);
        final ReactInstanceManager reactInstanceManager =
          getReactNativeHost().getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
        if (reactContext == null) {
          reactInstanceManager
            .addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
              @Override
              public void onReactContextInitialized(final ReactContext reactContext) {
                UiThreadUtil.runOnUiThread(
                  new Runnable() {
                    @Override
                    public void run() {
                        invokeStartTask(reactContext, taskConfig);
                    }
                  }
                );
                reactInstanceManager.removeReactInstanceEventListener(this);
            }});
          if (!reactInstanceManager.hasStartedCreatingInitialContext()) {
            reactInstanceManager.createReactContextInBackground();
          }
        } else {
          invokeStartTask(reactContext, taskConfig);
        }
    }

    @Override
    protected @Nullable HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        // If extras have been passed to the intent, pass them on into the JS as taskData
        // which can be accessed as the first param.
        WritableMap data = extras != null ? Arguments.fromBundle(extras) : Arguments.createMap();

        String task = extras.getString("task");
        if (task == null) {
            task = "HeadlessTask";
        }
        boolean allowForground = extras.getBoolean("allowForground", false);
        int timeout = extras.getInt("timeout", 5000);

        Log.d(TAG, String.format("Returning HeadlessJsTaskConfig, task=%s", task));
        return new HeadlessJsTaskConfig(
                // The the task was registered with in JS - must match
                task,
                data,
                timeout,
                allowForground
        );
    }
}
