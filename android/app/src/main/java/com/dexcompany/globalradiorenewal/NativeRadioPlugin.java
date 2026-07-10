package com.dexcompany.globalradiorenewal;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.text.TextUtils;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "NativeRadio")
public class NativeRadioPlugin extends Plugin {
    @PluginMethod
    public void play(PluginCall call) {
        String url = call.getString("url");
        if (!isHttpUrl(url)) {
            call.reject("A valid http or https stream URL is required.");
            return;
        }

        String title = call.getString("title", "Jigu Radio");
        String subtitle = call.getString("subtitle", "Radio stream");
        Intent intent = NativeRadioService.playIntent(getContext(), url, title, subtitle, false);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            getContext().startForegroundService(intent);
        } else {
            getContext().startService(intent);
        }

        JSObject result = new JSObject();
        result.put("status", "loading");
        call.resolve(result);
    }

    @PluginMethod
    public void pause(PluginCall call) {
        Intent intent = new Intent(getContext(), NativeRadioService.class);
        intent.setAction(NativeRadioService.ACTION_PAUSE);
        getContext().startService(intent);
        JSObject result = new JSObject();
        result.put("status", "paused");
        call.resolve(result);
    }

    @PluginMethod
    public void stop(PluginCall call) {
        Intent intent = new Intent(getContext(), NativeRadioService.class);
        intent.setAction(NativeRadioService.ACTION_STOP);
        getContext().startService(intent);
        JSObject result = new JSObject();
        result.put("status", "idle");
        call.resolve(result);
    }

    @PluginMethod
    public void getStatus(PluginCall call) {
        JSObject result = new JSObject();
        result.put("status", NativeRadioService.currentStatus());
        result.put("title", NativeRadioService.currentTitle());
        call.resolve(result);
    }

    @PluginMethod
    public void scheduleAlarm(PluginCall call) {
        Integer hour = call.getInt("hour");
        Integer minute = call.getInt("minute");
        String url = call.getString("url");
        if (hour == null || minute == null || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            call.reject("A valid hour and minute are required.");
            return;
        }
        if (!isHttpUrl(url)) {
            call.reject("A valid http or https stream URL is required.");
            return;
        }

        boolean scheduled = NativeRadioAlarmScheduler.saveAndSchedule(
            getContext(),
            hour,
            minute,
            url,
            call.getString("title", "Jigu Radio"),
            call.getString("subtitle", "Alarm playback")
        );

        JSObject result = new JSObject();
        result.put("scheduled", scheduled);
        result.put("exactAllowed", NativeRadioAlarmScheduler.canScheduleExactAlarms(getContext()));
        result.put("hour", hour);
        result.put("minute", minute);
        call.resolve(result);
    }

    @PluginMethod
    public void cancelAlarm(PluginCall call) {
        NativeRadioAlarmScheduler.cancel(getContext());
        JSObject result = new JSObject();
        result.put("enabled", false);
        call.resolve(result);
    }

    @PluginMethod
    public void getAlarm(PluginCall call) {
        SharedPreferences preferences = NativeRadioAlarmScheduler.prefs(getContext());
        JSObject result = new JSObject();
        result.put("enabled", preferences.getBoolean("enabled", false));
        result.put("hour", preferences.getInt("hour", 7));
        result.put("minute", preferences.getInt("minute", 0));
        result.put("title", preferences.getString("title", ""));
        result.put("exactAllowed", NativeRadioAlarmScheduler.canScheduleExactAlarms(getContext()));
        call.resolve(result);
    }

    @PluginMethod
    public void openExactAlarmSettings(PluginCall call) {
        getContext().startActivity(NativeRadioAlarmScheduler.exactAlarmSettingsIntent(getContext()));
        call.resolve();
    }

    private boolean isHttpUrl(String url) {
        return !TextUtils.isEmpty(url) && (url.startsWith("https://") || url.startsWith("http://"));
    }
}
