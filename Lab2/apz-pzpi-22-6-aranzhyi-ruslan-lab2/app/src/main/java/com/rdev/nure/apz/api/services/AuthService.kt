package com.rdev.nure.apz.api.services

import com.rdev.nure.apz.api.requests.LoginRequest
import com.rdev.nure.apz.api.requests.RegisterRequest
import com.rdev.nure.apz.api.responses.AuthResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST

interface AuthService {
    @POST("/auth/register")
    suspend fun register(
        @Body body: RegisterRequest,
    ): Response<AuthResponse>

    @POST("/auth/login")
    suspend fun login(
        @Body body: LoginRequest,
    ): Response<AuthResponse>

    @POST("/auth/logout")
    suspend fun login(
        @Header("Authorization") authToken: String,
    ): Response<Void>
}