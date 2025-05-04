package com.metromodules

import android.app.Activity
import android.app.role.RoleManager
import android.content.Intent
import android.os.Build
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import androidx.core.net.toUri

class NativeMiscModule(reactContext: ReactApplicationContext) : NativeMiscSpec(reactContext) {
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

    companion object {
        const val NAME = "NativeMisc"
    }
}