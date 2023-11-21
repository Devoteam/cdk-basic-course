import * as React from "react";

import {
  Avatar,
  CircularProgress,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  CardMedia,
  Card,
  Grid,
} from "@mui/material";

import { AssistWalker, Favorite, MoreVert, Share } from "@mui/icons-material";

import useSWR from "swr";

const VEHICLE_API =
  "https://{API-GW-LINK}.execute-api.{AWS REGION}.amazonaws.com/prod/all-vehicles/v1";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const MyCard = ({ title, vendor, model, image }) => {
  return (
    <Card>
      <CardHeader
        avatar={<Avatar>Y</Avatar>}
        action={
          <IconButton>
            <MoreVert />
          </IconButton>
        }
        title={title}
      />
      <CardMedia component="img" image={image} />
      <CardContent>
        <Typography>
          {vendor} {model}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton>
          <Favorite />
        </IconButton>
        <IconButton>
          <Share />
        </IconButton>
      </CardActions>
    </Card>
  );
};

const FindAllVehicles = () => {
  const { data, error } = useSWR(VEHICLE_API, fetcher);

  if (error) return <h1>Issue</h1>;
  if (!data) return <CircularProgress />;

  return (
    <Grid container spacing={2} justify="space-between" alignItems="stretch">
      {data.map((d, index) => (
        <Grid item xs={4} key={index}>
          <MyCard
            title={d.createdAt}
            vendor={d.vendor}
            model={d.model}
            image={d.image}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default FindAllVehicles;
