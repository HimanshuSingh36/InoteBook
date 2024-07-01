import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = (props) => {
  const [credentials, setcredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  let navigate = useNavigate();
  const onChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = credentials;
    const response = await fetch("http://localhost:4000/api/auth/createuser", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    const json = await response.json();
    console.log(json);

    if (json.success) {
      //save the auth token and redirect to notes

      localStorage.setItem("authtoken", json.authToken);

      navigate("/");
      props.showAlert("Account created successfully", "success");
    } else {
      props.showAlert("Invalid credentials", "danger");
    }
  };
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group my-3">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={onChange}
            aria-describedby="emailHelp"
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group my-3">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            onChange={onChange}
            aria-describedby="emailHelp"
            placeholder="Enter email"
          />
        </div>
        <div className="form-group my-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            minLength={5}
            name="password"
            onChange={onChange}
            placeholder="Password"
          />
        </div>
        <div className="form-group my-3">
          <label htmlFor="cpassword">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            minLength={5}
            id="cpassword"
            name="cpassword"
            onChange={onChange}
            placeholder="Password"
          />
        </div>
        <br />
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SignUp;