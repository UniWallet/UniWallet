package com.coinwallet;

import android.Manifest;
import android.annotation.TargetApi;
import android.app.ActivityManager;
import android.app.Service;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.os.Build;
import android.provider.Settings;
import android.support.v4.app.ActivityCompat;
import android.text.TextUtils;

import java.util.List;

public class SystemUtils {

    public static String getAndroidID(Context context) {
        try {
            ContentResolver cr = context.getContentResolver();
            return Settings.System.getString(cr, android.provider.Settings.System.ANDROID_ID);
        } catch (Exception e) {
            return "";
        }
    }
}
