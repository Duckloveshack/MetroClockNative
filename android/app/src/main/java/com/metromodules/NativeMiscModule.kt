package com.metromodules

import android.app.Activity
import android.app.role.RoleManager
import android.content.Intent
import android.os.Build
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import io.github.duckloveshack.metro_dialer_native.DialActivity
import io.github.duckloveshack.metro_dialer_native.MainActivity
import androidx.core.net.toUri
import io.github.duckloveshack.metro_dialer_native.CallActivity

class NativeMiscModule(reactContext: ReactApplicationContext) : NativeMiscSpec(reactContext) {

    override fun getTypedExportedConstants(): MutableMap<String, Any> {
        return mutableMapOf(
            "RESULT_OK" to Activity.RESULT_OK,
            "RESULT_CANCELED" to Activity.RESULT_CANCELED,
        )
    }

    override fun getName() = NAME

    override fun getAccentColor(): String {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val hexString = Integer.toHexString(ContextCompat.getColor(reactApplicationContext, android.R.color.system_accent1_300)).substring(2)
            return "#$hexString"
        } else {
            return "#cc1050"
        }
//        val typedValue = TypedValue()
//        //val contextThemeWrapper = ContextThemeWrapper(reactApplicationContext, android.R.style.Theme);
//        reactApplicationContext.theme.resolveAttribute(android.R.attr.colorAccent, typedValue, true)
//        val hexString = Integer.toHexString(typedValue.data).substring(2)
//
//        return hexString
    }

    override fun exitApp() {
        currentActivity?.finishAndRemoveTask()
    }

    override fun requestDialerRole(promise: Promise) {
        try {
            dialerRolePromise = promise

            val roleManager = reactApplicationContext.getSystemService(ReactApplicationContext.ROLE_SERVICE) as RoleManager
            val intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_DIALER)
            val mainActivity = currentActivity as? MainActivity ?: run {
                promise.reject("ACTIVITY_ERROR", "The activity has not been initialized")
                return
            }
            val activityLauncher = mainActivity.getActivityLauncher() ?: run {
                promise.reject("UNITIALIZED_LAUNCHER", "Could not initialize activityLauncher in NativeMiscModule.kt")
                return
            }
            activityLauncher.launch(intent)
        } catch (err: Exception) {
            promise.reject("ROLE_REQUEST_ERROR", "Failed to request ROLE_DIALER role", err)
            throw err
        }
    }

    override fun startDialActivity() {
        val intent = Intent(reactApplicationContext, DialActivity::class.java)
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        intent.setData("tel:12120909".toUri())
        reactApplicationContext.startActivity(intent)
    }

    override fun startCallActivity() {
        val intent = Intent(reactApplicationContext, CallActivity::class.java)
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactApplicationContext.startActivity(intent);
    }

    override fun isDialerRoleAvailable(): Boolean {
        val roleManager = reactApplicationContext.getSystemService(ReactApplicationContext.ROLE_SERVICE) as RoleManager
        return roleManager.isRoleAvailable(RoleManager.ROLE_DIALER)
    }

    override fun isDialerRoleHeld(): Boolean {
        val roleManager = reactApplicationContext.getSystemService(ReactApplicationContext.ROLE_SERVICE) as RoleManager
        return roleManager.isRoleHeld(RoleManager.ROLE_DIALER)
    }

    companion object {
        const val NAME = "NativeMisc"
        var dialerRolePromise: Promise? = null
    }
}