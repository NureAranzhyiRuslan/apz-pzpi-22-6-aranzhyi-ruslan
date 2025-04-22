package com.rdev.nure.apz.api.services

import com.rdev.nure.apz.api.entities.Forecast
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface ForecastService {
    @GET("/forecast/city")
    suspend fun getForecastForCity(
        @Query("city") cityId: Long,
    ): Response<Forecast>

    @POST("/forecast/{sensorId}")
    suspend fun getForecastForSensor(
        @Path("sensorId") sensorId: Long,
        @Header("Authorization") authToken: String,
    ): Response<Forecast>
}