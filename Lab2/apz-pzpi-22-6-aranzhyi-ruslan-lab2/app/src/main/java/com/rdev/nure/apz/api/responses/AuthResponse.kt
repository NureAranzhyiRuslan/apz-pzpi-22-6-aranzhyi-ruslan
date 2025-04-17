package com.rdev.nure.apz.api.responses

import com.fasterxml.jackson.annotation.JsonProperty

data class AuthResponse(
    val token: String,
    @JsonProperty("expires_at")
    val expiresAt: Long,
)