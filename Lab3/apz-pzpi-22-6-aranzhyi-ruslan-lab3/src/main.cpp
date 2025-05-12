#include <iostream>
#include "sources/csv.h"

#include "iot_sensor.h"

int main() {
    MeasurementSource::registerSource("CSVMeasurementSource", [](const toml::table& config) {
        return new CSVMeasurementSource(config);
    });

    IotSensor* iot;

    try {
        const toml::table toml_config = toml::parse_file("config.toml");
        const auto config = Configuration(toml_config);

        iot = new IotSensor(toml_config, config);
    } catch (const std::exception& ex) {
        std::cerr << "Initialization error: " << ex.what() << std::endl;
        return 1;
    }

    iot->run();
    delete iot;

    return 0;
}