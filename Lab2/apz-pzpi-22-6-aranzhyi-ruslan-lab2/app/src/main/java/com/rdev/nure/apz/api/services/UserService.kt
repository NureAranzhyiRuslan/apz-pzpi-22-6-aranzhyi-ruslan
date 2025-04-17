package com.rdev.nure.apz.api.services

import com.rdev.nure.apz.api.entities.User
import com.rdev.nure.apz.api.requests.EditUserRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.PATCH

interface UserService {
    @GET("/user/info")
    suspend fun getUser(
        @Header("Authorization") authToken: String,
    ): Response<User>

    @PATCH("/user/info")
    suspend fun editUser(
        @Body body: EditUserRequest,
        @Header("Authorization") authToken: String,
    ): Response<User>
}