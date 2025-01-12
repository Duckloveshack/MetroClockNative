package com.metrodialernative

import android.media.AudioManager
import android.media.ToneGenerator
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class DTMFPlaybackModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "DTMFPlaybackModule";

    private fun startToneLocal(digit: Int, duration: Int) {
        val toneGenerator = ToneGenerator(AudioManager.STREAM_DTMF, 100);
        toneGenerator.startTone(digit, duration);
    }

    @ReactMethod
    fun playDTMFTone(digit: Int) {
        startToneLocal(digit, 250);
    }

    @ReactMethod
    fun playDTMFTone(digit: Int, duration: Int) {
        startToneLocal(digit, duration);
    }
}