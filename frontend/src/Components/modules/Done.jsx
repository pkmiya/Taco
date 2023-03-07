import React from "react";
// import Attainment from "./Attainment";
import Header from "./Header";
import Footer from "./Footer";
import Subheader from "./Subheader";
import Attainment from "./Attainment";
const Done = () => {

    return (
        <React.Fragment>
            <Header />
            <Subheader pageName="Done" />
            <Attainment/>
            <Footer label="done"/>
        </React.Fragment>
    )
}


export default Done;