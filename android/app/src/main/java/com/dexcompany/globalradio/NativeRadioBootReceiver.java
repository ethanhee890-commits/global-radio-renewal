package com.dexcompany.globalradio;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class NativeRadioBootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            NativeRadioAlarmScheduler.scheduleStored(context);
        }
    }
}
