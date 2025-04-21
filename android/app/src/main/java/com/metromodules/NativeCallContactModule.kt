package com.metromodules

import android.Manifest
import android.content.ContentResolver
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.provider.CallLog.Calls
import android.provider.ContactsContract
import android.telecom.TelecomManager
import androidx.annotation.RequiresPermission
import androidx.core.net.toUri
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableArray

class NativeCallContactModule(reactContext: ReactApplicationContext) : NativeCallContactSpec(reactContext) {
    override fun getTypedExportedConstants(): MutableMap<String, Any> {
        return mutableMapOf(
            "CALL_TYPE_INCOMING" to Calls.INCOMING_TYPE,
            "CALL_TYPE_OUTGOING" to Calls.OUTGOING_TYPE,
            "CALL_TYPE_MISSED" to Calls.MISSED_TYPE,
            "CALL_TYPE_VOICEMAIL" to Calls.VOICEMAIL_TYPE,
            "CALL_TYPE_REJECTED" to Calls.REJECTED_TYPE,
            "CALL_TYPE_BLOCKED" to Calls.BLOCKED_TYPE,
            "CALL_TYPE_ANSWERED_EXTERNALLY" to Calls.ANSWERED_EXTERNALLY_TYPE
        )
    }

    override fun getName() = NAME

    private fun getCallsLocal(count: Int): WritableArray {
        val bundle = Bundle()
        bundle.putInt(
            ContentResolver.QUERY_ARG_LIMIT,
            count
        )

        val cursor = reactApplicationContext.contentResolver.query(
            Calls.CONTENT_URI.buildUpon().appendQueryParameter(Calls.LIMIT_PARAM_KEY, "$count").build(),
            null,
            null,
            null,
            null
        )

        val callsNative = Arguments.createArray()

        cursor?.use {
            val indexCachedName = it.getColumnIndex(Calls.CACHED_NAME)
            val indexCountryISO = it.getColumnIndex(Calls.COUNTRY_ISO)
            val indexDate = it.getColumnIndex(Calls.DATE)
            val indexDuration = it.getColumnIndex(Calls.DURATION)
            val indexNumber = it.getColumnIndex(Calls.NUMBER)
            val indexType = it.getColumnIndex(Calls.TYPE)

            while (it.moveToNext()) {
                val callMap = Arguments.createMap()

                callMap.putString("cached_name", cursor.getString(indexCachedName))
                callMap.putString("country_iso", cursor.getString(indexCountryISO))
                callMap.putDouble("date", cursor.getLong(indexDate).toDouble())
                callMap.putDouble("duration", cursor.getLong(indexDuration).toDouble())
                callMap.putString("number", cursor.getString(indexNumber))
                callMap.putDouble("type", cursor.getInt(indexType).toDouble())

                callsNative.pushMap(callMap)
            }
        }

        return callsNative
    }

    override fun fetchCallLogs(count: Double, promise: Promise) {
        try {
            val result = getCallsLocal(count.toInt())
            promise.resolve(result)
        } catch (err: Exception) {
            promise.reject("CALL_LOG_ERROR", "Failed to fetch call logs", err)
        }
    }

    override fun createModifyContact(number: String?) {
        val intent = Intent(Intent.ACTION_INSERT_OR_EDIT).apply {
            type = ContactsContract.Contacts.CONTENT_ITEM_TYPE
        }
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        intent.putExtra(ContactsContract.Intents.Insert.PHONE, number)

        reactApplicationContext.startActivity(intent)
    }

    @RequiresPermission(Manifest.permission.CALL_PHONE)
    override fun startCall(number: String, simIndex: Double) {
        val telecomManager = reactApplicationContext.getSystemService(Context.TELECOM_SERVICE) as TelecomManager
        val callUri = "tel:$number".toUri()
        val bundle = Bundle()
        //bundle.putInt(TelecomManager.EXTRA_)

        telecomManager.placeCall(callUri, bundle)
    }

    companion object {
        const val NAME = "NativeCallContact"
    }
}