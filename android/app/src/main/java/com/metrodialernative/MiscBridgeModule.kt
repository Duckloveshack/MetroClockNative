package com.metrodialernative

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.content.res.Resources
import androidx.core.content.ContextCompat

class MiscBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "MiscBridgeModule"

    @ReactMethod
    fun getAccentColor(): String {
        val reactContext = reactApplicationContext
        val hexString = Integer.toHexString(ContextCompat.getColor(reactContext, android.R.color.system_accent1_300)).substring(2)
        return "#$hexString"
    }
}