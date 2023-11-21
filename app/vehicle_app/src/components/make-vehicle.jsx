import * as React from "react";

import { useForm, Controller } from "react-hook-form";

import {
  FormControl,
  InputLabel,
  Typography,
  TextField,
  MenuItem,
  Select,
  Button,
  Box,
} from "@mui/material";

// const FormInputDropdown = ({
//   control,
//   label,
//   name
// }) => {
//   const makeOptions = () => {
//     return options.map((option) => {
//       return (
//         <MenuItem key={(option.value)} value={(option.value)} >
//           {option.label}
//         </MenuItem>
//       );
//     });
//   };

//   return (
//     <FormControl>
//       <InputLabel>{label}</InputLabel>
//       <Controller
//         render={({ field: { onChange, value } }) => (
//           <Select onChange={onChange} value={value} >
//             {makeOptions()}
//           </Select>
//         )}
//         control={control}
//         name={name}
//       />
//     </FormControl>
//   );
// };

const FormInputText = ({ control, label, name }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <TextField
          size="medium"
          onChange={onChange}
          value={value}
          label={label}
          sx={{
            input: { borderRadius: "10px", background: "white" },
          }}
        />
      )}
    />
  );
};

const VEHICLE_API =
  "https://{API-GW-LINK}.execute-api.{AWS REGION}.amazonaws.com/prod/all-vehicles/v1";

const defaultValues = {
  vendor: "",
  model: "",
  image: "",
};

const MakeVehicle = () => {
  const { handleSubmit, control, reset } = useForm({ defaultValues });

  const onSubmit = (data) => {
    const opts = {
      body: JSON.stringify(data),
      method: "POST",
    };
    fetch(VEHICLE_API, opts);
    reset();
  };

  return (
    <Box
      style={{
        display: "grid",
        gridRowGap: "20px",
        padding: "20px",
        margin: "10px 400px",
      }}
    >
      <FormInputText
        name="vendor"
        control={control}
        label="Vendor {i.e. Mercedes, Porsche, Audi}"
      />
      <FormInputText
        name="model"
        control={control}
        label="Model  {i.e. AMG-GT}"
      />
      <FormInputText name="image" control={control} label="Image-URL" />

      <Button
        onClick={handleSubmit(onSubmit)}
        variant="contained"
        style={{ borderRadius: "10px" }}
      >
        INFLEET
      </Button>
    </Box>
  );
};

export default MakeVehicle;
