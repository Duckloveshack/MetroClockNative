package io.github.duckloveshack.metro_dialer_native

import android.telecom.ConnectionService
import android.telecom.Call
import android.telecom.PhoneAccountHandle
import android.telecom.ConnectionRequest
import android.telecom.Connection

class ConnectService(): ConnectionService() {

    override fun onCreateOutgoingConnection(connectionManagerPhoneAccount: PhoneAccountHandle, request: ConnectionRequest): Connection {
        val connection = ConnectionInternal();
        return connection
    }

    override fun onCreateOutgoingConnectionFailed(connectionManagerPhoneAccount: PhoneAccountHandle, request: ConnectionRequest) {

    }

    inner class ConnectionInternal(): Connection() {
        override fun onShowIncomingCallUi() {

        }
    }
}