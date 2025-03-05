package com.metromodules

import android.media.ToneGenerator
import android.media.AudioManager
import android.content.pm.PackageManager
import android.content.Intent
import android.app.role.RoleManager
import android.app.Activity
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Promise
import androidx.core.content.ContextCompat
import androidx.activity.result.ActivityResult
import androidx.activity.result.ActivityResultRegistry
import androidx.activity.result.ActivityResultCaller
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import io.github.duckloveshack.metro_dialer_native.MainActivity

class NativeMiscModule(reactContext: ReactApplicationContext) : NativeMiscSpec(reactContext) {
    //private lateinit var dialerRolePromise: Promise;

    override fun getTypedExportedConstants(): MutableMap<String, Any> {
        return mutableMapOf(
            "RESULT_OK" to Activity.RESULT_OK,
            "RESULT_CANCELED" to Activity.RESULT_CANCELED,
        )
    }

    override fun getName() = NAME;

    override fun getAccentColor(): String {
        val hexString = Integer.toHexString(ContextCompat.getColor(reactApplicationContext, android.R.color.system_accent1_300)).substring(2)
        return "#$hexString"
    }

    override fun exitApp() {
        currentActivity?.finishAndRemoveTask();
    }

    override fun requestDialerRole(promise: Promise) {
        try {
            dialerRolePromise = promise;
            
            val roleManager = reactApplicationContext.getSystemService(ReactApplicationContext.ROLE_SERVICE) as RoleManager;
            val intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_DIALER);
            val mainActivity = getCurrentActivity() as? MainActivity ?: run {
                promise.reject("ACTIVITY_ERROR", "The activity has not been initialized");
                return;
            };
            val activityLauncher = mainActivity.getActivityLauncher() ?: run {
                promise.reject("UNITIALIZED_LAUNCHER", "Could not initialize activityLauncher in NativeMiscModule.kt");
                return
            };
            activityLauncher.launch(intent);
        } catch (err: Exception) {
            promise.reject("ROLE_REQUEST_ERROR", "Failed to request ROLE_DIALER role", err);
            throw err;
        }
    }

    override fun isDialerRoleAvailable(): Boolean {
        val roleManager = reactApplicationContext.getSystemService(ReactApplicationContext.ROLE_SERVICE) as RoleManager;
        return roleManager.isRoleAvailable(RoleManager.ROLE_DIALER);
    }

    override fun isDialerRoleHeld(): Boolean {
        val roleManager = reactApplicationContext.getSystemService(ReactApplicationContext.ROLE_SERVICE) as RoleManager;
        return roleManager.isRoleHeld(RoleManager.ROLE_DIALER);
    }

    companion object {
        const val NAME = "NativeMisc"
        var dialerRolePromise: Promise? = null
    }
}