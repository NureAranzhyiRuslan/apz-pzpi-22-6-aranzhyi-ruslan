package com.rdev.nure.apz.api.entities

import com.fasterxml.jackson.annotation.JsonProperty

data class Sensor(
    val id: Long,
    @JsonProperty("secret_key")
    val secretKey: String,
    val city: City,
    val name: String,
)