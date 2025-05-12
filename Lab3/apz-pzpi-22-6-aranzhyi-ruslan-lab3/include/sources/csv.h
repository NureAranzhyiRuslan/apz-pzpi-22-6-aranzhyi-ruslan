#pragma once

#include "measurement_source.h"

class CSVMeasurementSource final : public MeasurementSource {
public:
    explicit CSVMeasurementSource(const toml::table& config);
    Measurement getMeasurement() override;

private:
    std::ifstream file;
};
