package com.rdev.nure.apz

import android.content.Context
import android.widget.Toast
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import androidx.core.content.edit
import com.rdev.nure.apz.api.entities.City
import com.rdev.nure.apz.api.getApiClient
import com.rdev.nure.apz.api.handleResponse
import com.rdev.nure.apz.api.services.CityService
import com.rdev.nure.apz.components.ChangeForecastCityPanel
import com.rdev.nure.apz.util.searchCity
import kotlinx.coroutines.launch

private val citiesApi: CityService = getApiClient().create(CityService::class.java)

@Composable
fun ChangeForecastCityDialog(currentCityId: Long, show: MutableState<Boolean>, onChange: () -> Unit) {
    val context = LocalContext.current
    val prefs = context.getSharedPreferences("apz", Context.MODE_PRIVATE)
    val coroutineScope = rememberCoroutineScope()

    var isLoading by remember { mutableStateOf(false) }
    var currentCity by remember { mutableStateOf<City?>(null) }

    fun change(cityId: Long) {
        prefs.edit { putLong("forecastCityId", cityId) }
        onChange()
        show.value = false
    }

    fun handleError(text: String) {
        Toast.makeText(context, text, Toast.LENGTH_SHORT).show()
        isLoading = false
    }

    LaunchedEffect(Unit) {
        coroutineScope.launch {
            handleResponse(
                successResponse = { currentCity = it },
                errorResponse = { handleError(it.errors[0]) },
                onHttpError = { handleError("Unknown error!") },
                onNetworkError = { handleError("Network error!\nCheck your connection!") },
                errorRet = { },
            ) {
                citiesApi.getCity(cityId = currentCityId)
            }
        }
    }

    if (show.value)
        AlertDialog(
            onDismissRequest = { show.value = false },
            title = {
                Text(text = "Change city for forecast")
            },
            text = {
                ChangeForecastCityPanel(
                    currentCity = currentCity,
                    onSubmit = ::change,
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