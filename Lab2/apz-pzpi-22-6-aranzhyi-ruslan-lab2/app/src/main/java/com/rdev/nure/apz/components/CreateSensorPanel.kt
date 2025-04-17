package com.rdev.nure.apz.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.rdev.nure.apz.ui.theme.ApzTheme

@Composable
fun CreateSensorPanel(
    onAdd: (String, Long) -> Unit,
) {
    var nameText by remember { mutableStateOf("") }
    var cityText by remember { mutableStateOf("") }
    // TODO: add city searching by name
    var cityId by remember { mutableLongStateOf(0) }

    Column(
        modifier = Modifier
            .padding(8.dp)
            .fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        CustomTextField(
            value = nameText,
            onValueChange = { nameText = it },
            labelText = "Sensor name"
        )
        CustomTextField(
            value = cityText,
            onValueChange = { cityText = it },
            labelText = "City name"
        )

        Button(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(25),
            onClick = {
                onAdd(nameText, cityId)
            },
        ) {
            Text(
                text = "Create",
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun CreateSensorPanelPreview() {
    ApzTheme {
        CreateSensorPanel(onAdd = { _, _ -> run {} })
    }
}