#pragma once

#include <toml++/toml.hpp>

#include "measurement_source.h"
#include "configuration.h"

class IotSensor {
public:
    IotSensor(const toml::table& toml_config, Configuration config);

    void run();

private:
    Configuration config;
    MeasurementSource* source;
    Measurement* last_measurements;

    void sendData(Measurement measurement);
};
