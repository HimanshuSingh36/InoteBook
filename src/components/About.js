import React from "react";
import { useContext } from "react";
import noteContext from "../context/notes/noteContext";



const About = () => {
  const a = useContext(noteContext);
  console.log(a);
  return (<div>This is about page</div>);
};

export default About;
