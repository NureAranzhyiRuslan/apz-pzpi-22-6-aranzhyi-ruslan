package com.rdev.nure.apz.api.requests

import com.fasterxml.jackson.annotation.JsonProperty
import com.rdev.nure.apz.api.entities.UserLocale
import com.rdev.nure.apz.api.entities.UserTemperatureUnits

data class EditUserRequest(
    @JsonProperty("first_name")
    val firstName: String? = null,
    @JsonProperty("last_name")
    val lastName: String? = null,
    val locale: UserLocale? = null,
    @JsonProperty("temperature_units")
    val temperatureUnits: UserTemperatureUnits? = null,
)