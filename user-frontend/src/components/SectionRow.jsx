import { Box, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import "./ServiceRow.css";

export default function ServiceRow({ title, services }) {
  return (
    <Box className="serviceRow">

      {/* HEADER */}

      <Box className="serviceRowHeader">

        <Typography className="serviceRowTitle">
          {title}
        </Typography>

        <Typography className="seeAll">
          See all →
        </Typography>

      </Box>


      {/* SERVICES */}

      <Box className="serviceRowContainer">

        {services.map((service) => (

          <Box key={service.id} className="serviceCard">

            {/* IMAGE */}

            <img
              src={service.image}
              alt={service.name}
              className="serviceImage"
            />

            {/* NAME */}

            <Typography className="serviceName">
              {service.name}
            </Typography>


            {/* RATING */}

            <Box className="ratingRow">

              <StarIcon className="starIcon"/>

              <Typography className="ratingText">
                {service.rating}
              </Typography>

            </Box>


            {/* PRICE */}

            <Typography className="priceText">
              ₹{service.price} <span>onwards</span>
            </Typography>

          </Box>

        ))}

      </Box>

    </Box>
  );
}