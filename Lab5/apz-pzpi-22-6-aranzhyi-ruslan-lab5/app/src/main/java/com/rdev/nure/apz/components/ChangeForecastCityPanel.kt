package com.rdev.nure.apz.components

import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.rdev.nure.apz.api.entities.City
import com.rdev.nure.apz.api.entities.Sensor
import com.rdev.nure.apz.ui.theme.ApzTheme

@Composable
fun ChangeForecastCityPanel(
    currentCity: City?,
    onSubmit: (Long) -> Unit,
    onCitySearch: suspend (String) -> List<City>,
) {
    val context = LocalContext.current

    var selectedCity by remember { mutableStateOf(currentCity) }

    Column(
        modifier = Modifier
            .padding(8.dp)
            .fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        AutoCompleteField(
            fieldLabel = "City",
            getSuggestionString = { it.name },
            onSearch = onCitySearch,
            onSuggestionSelected = { selectedCity = it },
            defaultSuggestion = currentCity,
        )

        Button(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(25),
            onClick = {
                if(selectedCity == null) {
                    Toast.makeText(context, "No city is selected!", Toast.LENGTH_SHORT).show()
                    return@Button
                }
                onSubmit(selectedCity!!.id)
            },
        ) {
            Text(
                text = "Change",
            )
        }
    }
}