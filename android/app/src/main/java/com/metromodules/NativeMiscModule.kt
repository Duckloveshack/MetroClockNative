package com.metromodules

import android.media.ToneGenerator
import android.media.AudioManager
import android.content.pm.PackageManager
import com.facebook.react.bridge.ReactApplicationContext
import androidx.core.content.ContextCompat

class NativeMiscModule(reactContext: ReactApplicationContext) : NativeMiscSpec(reactContext) {
    override fun getName() = NAME

    override fun getAccentColor(): String {
        val reactContext = reactApplicationContext
        val hexString = Integer.toHexString(ContextCompat.getColor(reactContext, android.R.color.system_accent1_300)).substring(2)
        return "#$hexString"
    }

    override fun exitApp() {
        currentActivity?.finishAndRemoveTask()
    }

    companion object {
        const val NAME = "NativeMisc"
    }
}