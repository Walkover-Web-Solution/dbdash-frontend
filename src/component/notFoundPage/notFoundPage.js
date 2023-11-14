import React from "react"
import notFoundImg from "./notFound.png"
import { Box } from "@mui/system"
import { NavLink } from "react-router-dom"
import { Typography } from "@mui/material"

export default function Notfoundpage(){
    return(
        <>  
            <Box className = "flex-center-center" width="100vw" height="100vh" style = {{border: "1px solid black"}}>
                <img width = "500rem" src = {notFoundImg} alt="Not found logo" />
                <Box className = "flex-center-center-vertical">
                    <Typography variant="h3">Sorry! The page you are looking for is not here.</Typography>
                    <Typography variant="h4"><NavLink to="/">Return Home</NavLink></Typography>
                </Box>
            </Box>
        </>
    )
}