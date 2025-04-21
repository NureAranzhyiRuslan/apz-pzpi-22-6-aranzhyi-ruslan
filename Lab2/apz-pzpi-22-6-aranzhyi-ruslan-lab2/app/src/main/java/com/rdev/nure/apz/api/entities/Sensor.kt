package com.rdev.nure.apz.api.entities

import android.os.Parcel
import android.os.Parcelable
import com.fasterxml.jackson.annotation.JsonProperty

data class Sensor(
    val id: Long,
    @JsonProperty("secret_key")
    val secretKey: String,
    val city: City,
    val name: String,
): Parcelable {
    constructor(parcel: Parcel) : this(
        parcel.readLong(),
        parcel.readString()!!,
        parcel.readParcelable(City::class.java.classLoader)!!,
        parcel.readString()!!,
    ) {}

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeLong(id)
        parcel.writeString(secretKey)
        parcel.writeParcelable(city, 0)
        parcel.writeString(name)
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<Sensor> {
        override fun createFromParcel(parcel: Parcel): Sensor {
            return Sensor(parcel)
        }

        override fun newArray(size: Int): Array<Sensor?> {
            return arrayOfNulls(size)
        }
    }
}