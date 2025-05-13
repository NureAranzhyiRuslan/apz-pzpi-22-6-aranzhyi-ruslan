package com.rdev.nure.apz.api.entities

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty

@JsonIgnoreProperties(ignoreUnknown = true)
data class Forecast(
    @JsonProperty("info_text")
    val infoText: String,
    val temperature: Double,
)