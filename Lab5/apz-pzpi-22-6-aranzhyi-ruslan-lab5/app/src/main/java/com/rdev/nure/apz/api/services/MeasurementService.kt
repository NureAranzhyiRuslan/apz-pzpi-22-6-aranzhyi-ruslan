package com.rdev.nure.apz.api.services

import com.rdev.nure.apz.api.entities.Measurement
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Path

interface MeasurementService {
    @GET("/measurements/{sensorId}")
    suspend fun getMeasurementsForSensor(
        @Header("Authorization") authToken: String,
        @Path("sensorId") sensorId: Long,
    ): Response<List<Measurement>>
}