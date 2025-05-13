package com.rdev.nure.apz

import android.content.Context
import android.widget.Toast
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import com.rdev.nure.apz.api.getApiClient
import com.rdev.nure.apz.api.handleResponse
import com.rdev.nure.apz.api.requests.CreateSensorRequest
import com.rdev.nure.apz.api.services.SensorService
import com.rdev.nure.apz.components.CreateUpdateSensorPanel
import com.rdev.nure.apz.util.searchCity
import kotlinx.coroutines.launch

private val sensorsApi: SensorService = getApiClient().create(SensorService::class.java)

@Composable
fun CreateSensorDialog(show: MutableState<Boolean>, onCreate: () -> Unit) {
    val context = LocalContext.current
    val prefs = context.getSharedPreferences("apz", Context.MODE_PRIVATE)
    val coroutineScope = rememberCoroutineScope()

    val authToken = prefs.getString("authToken", "")!!
    var isLoading by remember { mutableStateOf(false) }

    fun create(name: String, cityId: Long) {
        coroutineScope.launch {
            if(isLoading)
                return@launch

            isLoading = true

            handleResponse(
                successResponse = {
                    Toast.makeText(context, "Sensor created successfully!", Toast.LENGTH_SHORT).show()
                    onCreate()
                    show.value = false
                },
                errorResponse = {
                    Toast.makeText(context, it.errors[0], Toast.LENGTH_SHORT).show()
                },
                onHttpError = {
                    Toast.makeText(context, "Failed to create sensor!", Toast.LENGTH_SHORT).show()
                },
                onNetworkError = {
                    Toast.makeText(context, "No internet connection!", Toast.LENGTH_SHORT).show()
                },
                errorRet = { },
            ) {
                sensorsApi.createSensor(CreateSensorRequest(name = name, cityId = cityId), authToken)
            }

            isLoading = false
        }
    }

    if (show.value)
        AlertDialog(
            onDismissRequest = { show.value = false },
            title = {
                Text(text = "Create sensor")
            },
            text = {
                CreateUpdateSensorPanel(
                    onSubmit = ::create,
                    onCitySearch = { searchCity(it, context) }
                )
            },
            confirmButton = {},
            dismissButton = {
                Button(
                    onClick = {
                        show.value = false
                    },
                    enabled = !isLoading,
                ) {
                    Text(text = "Cancel")
                }
            },
        )
}