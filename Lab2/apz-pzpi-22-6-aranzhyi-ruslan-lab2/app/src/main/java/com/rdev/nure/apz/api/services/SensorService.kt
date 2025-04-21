package com.rdev.nure.apz.api.services

import com.rdev.nure.apz.api.entities.Sensor
import com.rdev.nure.apz.api.requests.CreateSensorRequest
import com.rdev.nure.apz.api.requests.EditSensorRequest
import com.rdev.nure.apz.api.responses.PaginatedResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface SensorService {
    @GET("/sensors")
    suspend fun getSensors(
        @Header("Authorization") authToken: String,
        @Query("page") page: Int,
        @Query("page_size") pageSize: Int,
    ): Response<PaginatedResponse<Sensor>>

    @POST("/sensors")
    suspend fun createSensor(
        @Body body: CreateSensorRequest,
        @Header("Authorization") authToken: String,
    ): Response<Sensor>

    @GET("/sensors/{sensorId}")
    suspend fun getSensor(
        @Path("sensorId") sensorId: Long,
        @Header("Authorization") authToken: String,
    ): Response<Sensor>

    @PATCH("/sensors/{sensorId}")
    suspend fun editSensor(
        @Path("sensorId") sensorId: Long,
        @Body body: EditSensorRequest,
        @Header("Authorization") authToken: String,
    ): Response<Sensor>

    @DELETE("/sensors/{sensorId}")
    suspend fun deleteSensor(
        @Path("sensorId") sensorId: Long,
        @Header("Authorization") authToken: String,
    ): Response<Void>
}