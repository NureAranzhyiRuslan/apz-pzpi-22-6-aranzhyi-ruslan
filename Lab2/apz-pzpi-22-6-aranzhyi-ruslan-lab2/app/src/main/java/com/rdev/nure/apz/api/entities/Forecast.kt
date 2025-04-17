package com.rdev.nure.apz.api.entities

import com.fasterxml.jackson.annotation.JsonProperty

data class Forecast(
    @JsonProperty("info_text")
    val infoText: String,
    val temperature: Double,
)