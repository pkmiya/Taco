import { createTheme } from "@mui/material";
import { deepPurple, grey, red} from "@mui/material/colors";

const primaryColor = deepPurple[600]
const secondaryColor = deepPurple[400]
const dangerColor = red[900]
const backgroundColor = grey[30]
const theme = createTheme({
    palette: {
        primary: {
            main: primaryColor,
        },
        secondary: {
            main: secondaryColor,
        },
        error: {
            main: dangerColor,
        },
        background: {
            main: backgroundColor,
        }, 
        sub: {
            main: "#e65100"
        },
        white:{
            main: "#FFFFFF"
        }
    }
})

export default theme