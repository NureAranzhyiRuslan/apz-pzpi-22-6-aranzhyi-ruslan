package com.rdev.nure.apz

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.core.content.edit
import com.rdev.nure.apz.api.entities.Sensor
import com.rdev.nure.apz.api.getApiClient
import com.rdev.nure.apz.api.handleResponse
import com.rdev.nure.apz.api.services.ForecastService
import com.rdev.nure.apz.api.services.SensorService
import com.rdev.nure.apz.components.InfiniteScrollLazyColumn
import com.rdev.nure.apz.components.WeatherForecastCarousel
import com.rdev.nure.apz.ui.theme.ApzTheme
import com.rdev.nure.apz.util.getActivity
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val prefs = getSharedPreferences("apz", Context.MODE_PRIVATE)
        val token = prefs.getString("authToken", null)
        val expiresAt = prefs.getLong("expiresAt", 0)

        if(token == null || expiresAt < System.currentTimeMillis() / 1000) {
            prefs.edit { remove("authToken").remove("expiresAt") }
            startActivity(Intent(this, AuthActivity::class.java))
            finish()
        }

        setContent {
            MainActivityComponent()
        }
    }
}

private val sensorsApi: SensorService = getApiClient().create(SensorService::class.java)
private val forecastApi: ForecastService = getApiClient().create(ForecastService::class.java)

@Composable
private fun MainActivityComponent() {
    val context = LocalContext.current
    val prefs = context.getSharedPreferences("apz", Context.MODE_PRIVATE)
    val token = prefs.getString("authToken", null)!!

    var hasMore by remember { mutableStateOf(true) }
    var page by remember { mutableIntStateOf(1) }
    var totalSensorsCount by remember { mutableLongStateOf(0) }
    val sensorMutex = Mutex()
    val sensors = remember { mutableStateOf(listOf<Sensor>()) }
    val sensorsState = rememberLazyListState()
    val coroutineScope = rememberCoroutineScope()
    var isLoading by remember { mutableStateOf(false) }

    var todayTemp by remember { mutableStateOf<Int?>(null) }
    var tomorrowTemp by remember { mutableStateOf<Int?>(null) }

    val showCreateDialog = remember { mutableStateOf(false) }

    fun handleError(text: String) {
        Toast.makeText(context, text, Toast.LENGTH_SHORT).show()
        isLoading = false
    }

    fun loadMoreSensors() {
        if(!hasMore || isLoading)
            return

        isLoading = true

        coroutineScope.launch {
            sensorMutex.withLock {
                handleResponse(
                    successResponse = {
                        if(it.result.isEmpty())
                            hasMore = false

                        totalSensorsCount = it.count
                        sensors.value += it.result
                        page++

                        isLoading = false
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
                    sensorsApi.getSensors(authToken = token, page = page, pageSize = 10)
                }
            }
        }
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
                forecastApi.getForecastForCity(1)  // TODO: select city
            }
        }
    }

    if(showCreateDialog.value)
        CreateSensorDialog(
            show = showCreateDialog,
            onCreate = {
                coroutineScope.launch {
                    sensorMutex.withLock {
                        sensorsState.scrollToItem(0)
                        sensors.value = listOf()
                        hasMore = true
                        page = 1
                    }
                }
            }
        )

    ApzTheme {
        Scaffold(
            modifier = Modifier.fillMaxSize(),
            floatingActionButton = {
                FloatingActionButton(
                    onClick = { showCreateDialog.value = true }
                ) {
                    Icon(Icons.Default.Add, contentDescription = "Add Sensor")
                }
            }
        ) { innerPadding ->
            Column(
                modifier = Modifier.padding(innerPadding)
            ) {
                val mod = Modifier
                    .padding(innerPadding)
                    .fillMaxWidth()

                WeatherForecastCarousel(todayTemp, tomorrowTemp)

                Text(
                    text = (
                            if (isLoading && totalSensorsCount == 0L) "Loading sensors..."
                            else if (totalSensorsCount == 0L) "You dont have any sensors"
                            else "You have $totalSensorsCount sensors:"
                            ),
                    modifier = mod,
                )
                InfiniteScrollLazyColumn(
                    items = sensors.value,
                    loadMoreItems = ::loadMoreSensors,
                    listState = sensorsState,
                    isLoading = isLoading,
                    modifier = mod,
                )
            }
        }
    }
}
