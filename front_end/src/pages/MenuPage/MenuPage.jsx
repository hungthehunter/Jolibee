import React from "react";
import Layout from "../../components/Layouts/Layout";
import '../../styles/MenuStyle.css';
import Section1 from "./Section1";
import Section3 from "./Section3";
function MenuPage(){
    return(
      <>
      <Layout>

      <Section1/>
      <Section3/>
      </Layout>
      </>
    )
    }
    
    export default MenuPage