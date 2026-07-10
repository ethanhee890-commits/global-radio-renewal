package com.dexcompany.globalradiorenewal;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;

public class NativeRadioAlarmReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        SharedPreferences preferences = NativeRadioAlarmScheduler.prefs(context);
        if (!preferences.getBoolean("enabled", false)) {
            return;
        }

        String url = preferences.getString("url", "");
        if (!NativeRadioAlarmScheduler.isHttpUrl(url)) {
            NativeRadioAlarmScheduler.cancel(context);
            return;
        }

        Intent serviceIntent = NativeRadioService.playIntent(
            context,
            url,
            preferences.getString("title", "Jigu Radio"),
            preferences.getString("subtitle", "Alarm playback"),
            true
        );
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(serviceIntent);
        } else {
            context.startService(serviceIntent);
        }

        NativeRadioAlarmScheduler.scheduleStored(context);
    }
}
