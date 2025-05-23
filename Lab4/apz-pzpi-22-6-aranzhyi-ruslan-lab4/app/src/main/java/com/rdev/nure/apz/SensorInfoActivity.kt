package com.rdev.nure.apz

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.core.content.edit
import com.rdev.nure.apz.api.entities.Measurement
import com.rdev.nure.apz.api.entities.Sensor
import com.rdev.nure.apz.api.getApiClient
import com.rdev.nure.apz.api.handleResponse
import com.rdev.nure.apz.api.requests.EditSensorRequest
import com.rdev.nure.apz.api.services.ForecastService
import com.rdev.nure.apz.api.services.MeasurementService
import com.rdev.nure.apz.api.services.SensorService
import com.rdev.nure.apz.components.CreateUpdateSensorPanel
import com.rdev.nure.apz.components.CustomTextField
import com.rdev.nure.apz.components.WeatherForecastCarousel
import com.rdev.nure.apz.ui.theme.ApzTheme
import com.rdev.nure.apz.util.getActivity
import com.rdev.nure.apz.util.searchCity
import kotlinx.coroutines.launch
import java.text.DateFormat
import java.text.SimpleDateFormat
import java.util.Date

private val dateFmt: DateFormat = SimpleDateFormat("dd.MM.yyyy HH:mm")

class SensorInfoActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        if(!intent.hasExtra("sensor")) {
            finish()
            return
        }

        val sensor = intent.getParcelableExtra<Sensor>("sensor")
        if(sensor == null) {
            finish()
            return
        }

        setContent {
            SensorActivityComponent(sensor_ = sensor)
        }
    }
}

private val sensorsApi: SensorService = getApiClient().create(SensorService::class.java)
private val measurementsApi: MeasurementService = getApiClient().create(MeasurementService::class.java)
private val forecastApi: ForecastService = getApiClient().create(ForecastService::class.java)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SensorActivityComponent(sensor_: Sensor) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val prefs = context.getSharedPreferences("apz", Context.MODE_PRIVATE)
    val token = prefs.getString("authToken", null)!!

    var sensor by remember { mutableStateOf(sensor_) }

    var isLoading by remember { mutableStateOf(false) }
    var totalMeasurementsCount by remember { mutableIntStateOf(0) }
    val measurements = remember { mutableStateOf(listOf<Measurement>()) }

    var todayTemp by remember { mutableStateOf<Int?>(null) }
    var tomorrowTemp by remember { mutableStateOf<Int?>(null) }

    var showMenu by remember { mutableStateOf(false) }

    fun goBack() {
        val resultIntent = Intent()
        resultIntent.putExtra("sensor", sensor)
        context.getActivity()!!.setResult(Activity.RESULT_OK, resultIntent)
        context.getActivity()!!.finish()
    }

    fun update(name: String, cityId: Long) {
        coroutineScope.launch {
            if(isLoading)
                return@launch

            isLoading = true

            handleResponse(
                successResponse = {
                    sensor = it
                    Toast.makeText(context, "Sensor updated successfully!", Toast.LENGTH_SHORT).show()
                },
                errorResponse = {
                    Toast.makeText(context, it.errors[0], Toast.LENGTH_SHORT).show()
                },
                onHttpError = {
                    Toast.makeText(context, "Failed to update sensor!", Toast.LENGTH_SHORT).show()
                },
                onNetworkError = {
                    Toast.makeText(context, "No internet connection!", Toast.LENGTH_SHORT).show()
                },
                errorRet = { },
            ) {
                sensorsApi.editSensor(sensorId = sensor.id, body = EditSensorRequest(name = name, cityId = cityId), authToken = token)
            }

            isLoading = false
        }
    }

    fun handleError(text: String) {
        Toast.makeText(context, text, Toast.LENGTH_SHORT).show()
    }

    fun loadMoreMeasurements() {
        coroutineScope.launch {
            handleResponse(
                successResponse = {
                    totalMeasurementsCount = it.size
                    measurements.value = it
                },
                errorResponse = { handleError(it.errors[0]) },
                onHttpError = { handleError("Unknown error!") },
                onNetworkError = { handleError("Network error!\nCheck your connection!") },
                on401Error = {
                    prefs.edit { remove("authToken").remove("expiresAt") }
                    context.startActivity(Intent(context, AuthActivity::class.java))
                    context.getActivity()!!.finish()
                },
                errorRet = { },
            ) {
                measurementsApi.getMeasurementsForSensor(authToken = token, sensorId = sensor.id)
            }
        }
    }

    fun deleteSensor() {
        coroutineScope.launch {
            handleResponse(
                successResponse = {
                    sensor.deleted = true
                    goBack()
                },
                errorResponse = { handleError(it.errors[0]) },
                onHttpError = { handleError("Unknown error!") },
                onNetworkError = { handleError("Network error!\nCheck your connection!") },
                on401Error = {
                    prefs.edit { remove("authToken").remove("expiresAt") }
                    context.startActivity(Intent(context, AuthActivity::class.java))
                    context.getActivity()!!.finish()
                },
                errorRet = { },
            ) {
                sensorsApi.deleteSensor(authToken = token, sensorId = sensor.id)
            }
        }
    }

    LaunchedEffect(Unit) {
        loadMoreMeasurements()
    }

    LaunchedEffect(Unit) {
        coroutineScope.launch {
            handleResponse(
                successResponse = { tomorrowTemp = it.temperature.toInt() },
                errorResponse = { handleError(it.errors[0]) },
                onHttpError = { handleError("Unknown error!") },
                onNetworkError = { handleError("Network error!\nCheck your connection!") },
                errorRet = { },
            ) {
                forecastApi.getForecastForSensor(sensorId = sensor.id, authToken = token)
            }
        }
    }

    BackHandler(onBack = ::goBack)

    ApzTheme {
        Scaffold(
            modifier = Modifier.fillMaxSize(),
            topBar = {
                TopAppBar(
                    title = {
                        Text(text = sensor.name)
                    },
                    navigationIcon = {
                        IconButton(onClick = ::goBack) {
                            Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                        }
                    },
                    actions = {
                        IconButton(onClick = { showMenu = true }) {
                            Icon(Icons.Default.MoreVert, contentDescription = "Menu")
                        }
                        DropdownMenu(
                            expanded = showMenu,
                            onDismissRequest = { showMenu = false }
                        ) {
                            DropdownMenuItem(
                                onClick = {
                                    showMenu = false
                                    deleteSensor()
                                },
                                text = {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                    ) {
                                        Icon(Icons.Filled.Delete, contentDescription = "Delete")
                                        Text(text = "Delete")
                                    }
                                },
                            )
                        }
                    }
                )
            },
        ) { innerPadding ->
            Column(
                modifier = Modifier
                    .padding(innerPadding)
                    .fillMaxWidth()
            ) {
                WeatherForecastCarousel(todayTemp, tomorrowTemp)

                CustomTextField(
                    value = sensor.secretKey,
                    onValueChange = {},
                    labelText = "Secret key",
                    disabled = true,
                    outlined = true,
                )

                CreateUpdateSensorPanel(
                    onSubmit = ::update,
                    onCitySearch = { searchCity(it, context) },
                    sensor = sensor,
                )

                Text(
                    text = (
                            if (totalMeasurementsCount == -1) "Loading sensors..."
                            else if (totalMeasurementsCount == 0) "Sensor does not have any measurements"
                            else "Sensor has $totalMeasurementsCount+ measurements:"
                            ),
                    modifier = Modifier.fillMaxWidth(),
                )

                LazyColumn(
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    items(
                        count = measurements.value.size,
                        contentType = { Measurement::class.java },
                        key = { it.hashCode() },
                    ) { index ->
                        val measurement = measurements.value[index]

                        Row(
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth(),
                        ) {
                            Text(
                                text = "${measurement.temperature} °C",
                            )
                            Text(
                                text = dateFmt.format(Date(measurement.timestamp * 1000L)),
                            )
                        }
                        HorizontalDivider()
                    }
                }
            }
        }
    }
}
