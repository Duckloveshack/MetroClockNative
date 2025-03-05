package com.metromodules

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.telephony.TelephonyManager
import java.util.Date
import java.time.LocalDate
import com.facebook.react.bridge.ReactApplicationContext
import android.os.Build
import android.telephony.TelephonyCallback
import android.util.Log
import android.telecom.CallScreeningService
import androidx.annotation.RequiresApi
import android.telecom.Call

class NativeCallReceiverModule(reactContext: ReactApplicationContext) : NativeCallReceiverSpec(reactContext) {
    private var lastState: Int = TelephonyManager.CALL_STATE_IDLE
    private var callStartTime: Date = Date()

    //API 31+
    lateinit private var telephonyCallback: TelephonyCallback.CallStateListener;

    //API <31
    lateinit private var phoneStateReceiver: PhoneStateReceiver;

    private var telephonyManager = reactContext.getSystemService(ReactApplicationContext.TELEPHONY_SERVICE) as TelephonyManager

    override fun getName() = NAME

    override fun startObserving() {
        registerCallbacks();
    }

    override fun stopObserving() {
        unregisterCallbacks()
    }

    private fun registerCallbacks() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            // New APIs
            telephonyCallback = TelephonyListener()
            telephonyManager.registerTelephonyCallback(reactApplicationContext.mainExecutor, telephonyCallback as TelephonyCallback)
        } else {
            // Old APIs
            phoneStateReceiver = PhoneStateReceiver()
            val intentFilter = IntentFilter(TelephonyManager.ACTION_PHONE_STATE_CHANGED)
            reactApplicationContext.registerReceiver(phoneStateReceiver, intentFilter);
        }
    }

    private fun unregisterCallbacks() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            // New APIs
            telephonyManager.unregisterTelephonyCallback(telephonyCallback as TelephonyCallback);
        } else {
            // Old APIs
            reactApplicationContext.unregisterReceiver(phoneStateReceiver);
        }
    }

    // NEW: Handle changing call state
    @RequiresApi(Build.VERSION_CODES.S)
    inner class TelephonyListener: TelephonyCallback(), TelephonyCallback.CallStateListener {
        override fun onCallStateChanged(state: Int) {
            emitOnCallChangeState(state.toString());
        }
    }

    // OLD: Handle changing call state
    inner class PhoneStateReceiver: BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            val state = intent.getStringExtra(TelephonyManager.EXTRA_STATE);
            emitOnCallChangeState(state)
        }
    }

    companion object {
        const val NAME = "NativeCallReceiver"
    }
}