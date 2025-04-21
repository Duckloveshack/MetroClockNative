package io.github.duckloveshack.metro_dialer_native

import android.telecom.InCallService
import android.telecom.Call

class CallService : InCallService() {
    override fun onCallAdded(call: Call?) {
        super.onCallAdded(call)
    }

    override fun onCallRemoved(call: Call?) {
        super.onCallRemoved(call)
    }
}