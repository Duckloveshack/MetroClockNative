package com.metrodialernative

import android.media.AudioManager
import android.media.ToneGenerator
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class DTMFPlaybackModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "DTMFPlaybackModule";

    override fun getConstants(): MutableMap<String, Any>? {
        return mutableMapOf(
            "TONE_DTMF_0" to ToneGenerator.TONE_DTMF_0,
            "TONE_DTMF_1" to ToneGenerator.TONE_DTMF_1,
            "TONE_DTMF_2" to ToneGenerator.TONE_DTMF_2,
            "TONE_DTMF_3" to ToneGenerator.TONE_DTMF_3,
            "TONE_DTMF_4" to ToneGenerator.TONE_DTMF_4,
            "TONE_DTMF_5" to ToneGenerator.TONE_DTMF_5,
            "TONE_DTMF_6" to ToneGenerator.TONE_DTMF_6,
            "TONE_DTMF_7" to ToneGenerator.TONE_DTMF_7,
            "TONE_DTMF_8" to ToneGenerator.TONE_DTMF_8,
            "TONE_DTMF_9" to ToneGenerator.TONE_DTMF_9,
            "TONE_DTMF_STAR" to ToneGenerator.TONE_DTMF_S,
            "TONE_DTMF_POUND" to ToneGenerator.TONE_DTMF_P,
        )
    }

    private fun startToneLocal(digit: Int, duration: Int) {
        val toneGenerator = ToneGenerator(AudioManager.STREAM_DTMF, 100);
        toneGenerator.startTone(digit, duration);
    }

    @ReactMethod
    fun playDTMFTone(digit: Int, duration: Int? = 250) {
        startToneLocal(digit, duration ?: 250);
    }
}