#include "measurement_source.h"

MeasurementSource::RegMap MeasurementSource::registered = RegMap();

MeasurementSource* MeasurementSource::createSource(const toml::table& config) {
    const std::string sourceName = config["sensor"]["measurement_source"].value_or<std::string>("");
    if(!registered.contains(sourceName))
        return nullptr;

    return registered[sourceName](config);
}

bool MeasurementSource::registerSource(const std::string& name, const ClassFunc& clsFunc) {
    if(registered.contains(name))
        return false;

    registered[name] = clsFunc;
    return true;
}
