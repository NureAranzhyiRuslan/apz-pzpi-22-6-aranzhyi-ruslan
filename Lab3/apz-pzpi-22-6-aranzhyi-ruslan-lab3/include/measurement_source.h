#pragma once

#include <functional>
#include <toml++/toml.hpp>
#include "measurement.h"

class MeasurementSource {
    using ClassFunc = std::function<MeasurementSource* (const toml::table& config)>;
    using RegMap = std::unordered_map<std::string, ClassFunc>;

public:
    explicit MeasurementSource(const toml::table& config) {}
    virtual ~MeasurementSource() = default;
    virtual Measurement getMeasurement() = 0;

    static MeasurementSource* createSource(const toml::table& config);
    static bool registerSource(const std::string& name, const ClassFunc& clsFunc);

private:
    static RegMap registered;
};
