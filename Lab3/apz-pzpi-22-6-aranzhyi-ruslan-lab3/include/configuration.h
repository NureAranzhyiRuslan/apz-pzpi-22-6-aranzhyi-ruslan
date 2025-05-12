#pragma once

#include <toml++/toml.hpp>

class Configuration {
public:
    Configuration(){}
    explicit Configuration(const toml::table& config);

    std::string getApiHost() const;
    std::string getApiKey() const;

    uint32_t getMeasurementInterval() const;
    std::string getMeasurementSource() const;
    uint16_t getMeasurementCount() const;
    uint16_t getAltitude() const;

private:
    std::string api_host;
    std::string api_key;
    uint32_t measurement_interval;
    std::string measurement_source;
    uint16_t measurement_count;
    uint16_t altitude;
};
