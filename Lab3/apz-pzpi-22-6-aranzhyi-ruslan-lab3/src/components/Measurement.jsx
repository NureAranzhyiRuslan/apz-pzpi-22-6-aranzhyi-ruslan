import {Divider, ListItem, ListItemText} from "@mui/material";
import React from "react";

function Measurement({measurement}) {
    return (
        <React.Fragment key={measurement.id}>
            <ListItem>
                <ListItemText
                    primary={`🌡️ ${measurement.temperature}°C   |   📈 ${measurement.pressure} hPa`}
                    secondary={new Date(measurement.date * 1000).toLocaleString()}
                />
            </ListItem>
            <Divider />
        </React.Fragment>
    );
}

export default Measurement;