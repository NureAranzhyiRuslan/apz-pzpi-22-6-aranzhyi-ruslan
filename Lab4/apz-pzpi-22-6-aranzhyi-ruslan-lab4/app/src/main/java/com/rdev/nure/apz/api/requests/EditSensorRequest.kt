package com.rdev.nure.apz.api.requests

import com.fasterxml.jackson.annotation.JsonProperty

data class EditSensorRequest(
    val name: String? = null,
    @JsonProperty("city")
    val cityId: Long? = null,
)