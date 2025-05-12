#include "configuration.h"

template <typename T>
static inline void throwIfConfigEmpty(const std::optional<T>& check, const std::string& section, const std::string& key) {
    if (!check) {
        throw std::runtime_error(std::format(R"(Failed to initialize: "{}" under "[{}]" is not specified!)", key, section));
    }
}

template <typename T>
static inline T getConfigValueOrThrow(const toml::table& config, const std::string& section, const std::string& key) {
    const auto api_host = config[section][key].value<T>();
    throwIfConfigEmpty(api_host, section, key);
    return api_host.value();
}

Configuration::Configuration(const toml::table& config) {
    this->api_host = getConfigValueOrThrow<std::string>(config, "server", "host");
    this->api_key = getConfigValueOrThrow<std::string>(config, "server", "api_key");
    this->measurement_interval = getConfigValueOrThrow<uint32_t>(config, "sensor", "measurement_interval");
    this->altitude = getConfigValueOrThrow<uint16_t>(config, "sensor", "altitude");

    this->measurement_count = config["sensor"]["measurement_count"].value_or<uint16_t>(32);
}


std::string Configuration::getApiHost() const {
    return api_host;
}

std::string Configuration::getApiKey() const {
    return api_key;
}

uint32_t Configuration::getMeasurementInterval() const {
    return measurement_interval;
}

std::string Configuration::getMeasurementSource() const {
    return measurement_source;
}

uint16_t Configuration::getMeasurementCount() const {
    return measurement_count;
}

uint16_t Configuration::getAltitude() const {
    return altitude;
}
