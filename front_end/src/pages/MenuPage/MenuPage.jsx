import React from "react";
import Layout from "../../components/Layouts/Layout";
import '../../styles/MenuStyle.css';
import Section1 from "./Section1";
import Section2 from "./Section2";
function MenuPage(){
    return(
      <>
      <Layout>
      <Section1/>
      <Section2/>
      </Layout>
      </>
    )
    }
    
    export default MenuPage