package com.rdev.nure.apz.components

import android.content.Context
import android.content.Intent
import android.util.Log
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rdev.nure.apz.MainActivityState
import com.rdev.nure.apz.SensorInfoActivity
import com.rdev.nure.apz.api.entities.City
import com.rdev.nure.apz.api.entities.Sensor
import com.rdev.nure.apz.api.getApiClient
import com.rdev.nure.apz.api.handleResponse
import com.rdev.nure.apz.api.services.MeasurementService
import com.rdev.nure.apz.ui.theme.ApzTheme
import kotlinx.coroutines.launch

private val measurementsApi: MeasurementService = getApiClient().create(MeasurementService::class.java)

@Composable
fun SensorItem(sensor_: Sensor, recentMeasurements: Int?) {
    var sensor by remember { mutableStateOf(sensor_) }
    val context = LocalContext.current
    val currentFontSize = LocalTextStyle.current.fontSize.value
    val launcher = rememberLauncherForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if(result.data == null || result.data?.extras == null || !result.data!!.extras!!.containsKey("sensor"))
            return@rememberLauncherForActivityResult
        val resultSensor = result.data!!.extras!!.getParcelable<Sensor>("sensor")
            ?: return@rememberLauncherForActivityResult
        sensor = resultSensor
        if(sensor.deleted)
            MainActivityState.updateNeedsReload()
    }

    Row(
        modifier = Modifier
            .padding(4.dp)
            .fillMaxWidth()
            .clickable {
                val intent = Intent(context, SensorInfoActivity::class.java)
                intent.putExtra("sensor", sensor)
                launcher.launch(intent)
            },
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Column {
            Text(
                text = sensor.name,
                fontWeight = FontWeight.Bold,
                fontSize = (currentFontSize + 2).sp,
            )
            Text(
                text = sensor.city.name,
                fontSize = (currentFontSize - 2).sp,
            )
        }
        Column(horizontalAlignment = Alignment.End) {
            Text(
                text = recentMeasurements?.toString() ?: "?",
                fontSize = (currentFontSize + 4).sp,
            )
            Text(
                text = "recent measurements",
                fontSize = (currentFontSize - 2).sp,
            )
        }
    }
}

@Composable
fun SensorItem(sensor: Sensor) {
    val context = LocalContext.current
    var measurementsCount by remember { mutableStateOf<Int?>(null) }
    val coroutineScope = rememberCoroutineScope()
    val prefs = context.getSharedPreferences("apz", Context.MODE_PRIVATE)
    val authToken = prefs.getString("authToken", "")!!

    LaunchedEffect(Unit) {
        coroutineScope.launch {
            handleResponse(
                successResponse = { measurementsCount = it.size },
                errorResponse = {  },
                onHttpError = { },
                onNetworkError = { },
                errorRet = { },
            ) {
                measurementsApi.getMeasurementsForSensor(sensorId = sensor.id, authToken = authToken)
            }
        }
    }

    SensorItem(
        sensor_ = sensor,
        recentMeasurements = measurementsCount,
    )
}

@Preview(showBackground = true)
@Composable
fun SensorItemPreview() {
    ApzTheme {
        SensorItem(sensor_ = Sensor(id = 0, name = "test sensor", secretKey = "asdqwe", city = City(id = 0, name = "test city", longitude = 0.0, latitude = 0.0)), 123)
    }
}
