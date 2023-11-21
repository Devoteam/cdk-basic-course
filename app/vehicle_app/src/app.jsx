import * as React from "react";
import { styled } from "@mui/system";

import FindAllVehicles from "./components/find-all-vehicles";
import MakeVehicle from "./components/make-vehicle";

import { Tabs, Tab, Box } from "@mui/material";

const TabPanel = (props) => {
  const { children, value, index, ...abc } = props;

  return (
    <div hidden={value !== index} {...abc}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const imageURL =
  "https://images.unsplash.com/photo-1611651338412-8403fa6e3599?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2971&q=80";
const Background = styled("div")({
  backgroundImage: `url(${imageURL})`,
  backgroundSize: "cover",
  position: "absolute",
  height: "calc(100% - 50px)",
  width: "100%",
});

const App = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ height: "50px" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Car Infleetion" />
          <Tab label="Car Pool" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Background>
          <MakeVehicle />
        </Background>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <FindAllVehicles />
      </TabPanel>
    </Box>
  );
};

export default App;
