package com.metromodules

import android.media.ToneGenerator
import android.media.AudioManager
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext

class NativeDTMFModule(reactContext: ReactApplicationContext) : NativeDTMFSpec(reactContext) {
    override fun getTypedExportedConstants(): MutableMap<String, Any> {
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
            "TONE_DTMF_POUND" to ToneGenerator.TONE_DTMF_P
        )
    }

    override fun getName() = NAME

    private fun _startToneLocal(digit: Int, duration: Int) {
        val toneGenerator = ToneGenerator(AudioManager.STREAM_DTMF, 50)
        toneGenerator.startTone(digit, duration)
    }

    override fun playDTMFTone(digit: Double, duration: Double) {
        Log.d("NativeDTMFModule", "Value received for digit is $digit")
        _startToneLocal(digit.toInt(), duration.toInt())
    }

    companion object {
        const val NAME = "NativeDTMF"
    }
}