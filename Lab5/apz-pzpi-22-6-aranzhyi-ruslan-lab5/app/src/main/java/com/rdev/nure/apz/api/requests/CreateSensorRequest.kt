package com.rdev.nure.apz.api.requests

import com.fasterxml.jackson.annotation.JsonProperty

data class CreateSensorRequest(
    val name: String,
    @JsonProperty("city")
    val cityId: Long,
)