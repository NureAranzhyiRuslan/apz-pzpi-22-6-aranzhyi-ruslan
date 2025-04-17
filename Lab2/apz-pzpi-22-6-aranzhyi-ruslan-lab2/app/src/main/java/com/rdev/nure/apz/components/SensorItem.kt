package com.rdev.nure.apz.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rdev.nure.apz.ui.theme.ApzTheme

@Composable
fun SensorItem(name: String, city: String, recentMeasurements: Int) {
    val currentFontSize = LocalTextStyle.current.fontSize.value

    Row(
        modifier = Modifier
            .padding(4.dp)
            .fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Column {
            Text(
                text = name,
                fontWeight = FontWeight.Bold,
                fontSize = (currentFontSize + 2).sp,
            )
            Text(
                text = city,
                fontSize = (currentFontSize - 2).sp,
            )
        }
        Column(horizontalAlignment = Alignment.End) {
            Text(
                text = recentMeasurements.toString(),
                fontSize = (currentFontSize + 4).sp,
            )
            Text(
                text = "recent measurements",
                fontSize = (currentFontSize - 2).sp,
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun SensorItemPreview() {
    ApzTheme {
        SensorItem("Test sensor", "Some city", 123)
    }
}
