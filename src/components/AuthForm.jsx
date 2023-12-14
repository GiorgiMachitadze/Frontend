import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AuthForm.css";

const AuthForm = () => {
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const toggleForm = () => {
    setShowLoginForm(!showLoginForm);
    setShowForgotPasswordForm(false);
    setErrors({});
  };

  const toggleForgotPasswordForm = () => {
    setShowLoginForm(false);
    setShowForgotPasswordForm(!showForgotPasswordForm);
    setErrors({});
  };

  const resetForm = () => {
    setFormData({
      name: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      newPassword: "",
    });
    setErrors({});
  };

  const handleRegistration = async (event) => {
    event.preventDefault();
    setLoading(true);

    const validationRules = {
      name: [
        (value) => value.length >= 2,
        "Name must be at least 2 characters long",
      ],
      userName: [
        (value) => value.length >= 2 && /^[A-Z]/.test(value),
        "Username must be at least 2 characters long and start with a capital letter",
      ],
      email: [(value) => /\S+@\S+\.\S+/.test(value), "Invalid email address"],
      password: [
        (value) => value.length >= 6 && /\d/.test(value),
        "Password must be at least 6 characters long and contain at least one number",
      ],
      confirmPassword: [
        (value) => value === formData.password,
        "Passwords do not match",
      ],
    };

    const registrationErrors = Object.fromEntries(
      Object.entries(validationRules).map(([field, [rule, errorMessage]]) => [
        field,
        rule(formData[field]) ? undefined : errorMessage,
      ])
    );

    if (
      Object.values(registrationErrors).some((error) => error !== undefined)
    ) {
      setErrors(registrationErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/register",
        formData
      );
      resetForm();

      console.log("Registration successful!");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const { data } = error.response;
        if (data.errors) {
          setErrors(data.errors);
        } else {
          resetForm();
          setErrors({ registration: "Credentials are already in use" });
        }
      } else {
        console.error("Registration failed:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    const loginErrors = {};

    if (!formData.userName) {
      loginErrors.userName = "Username is required";
    }

    if (!formData.password) {
      loginErrors.password = "Password is required";
    }

    if (Object.keys(loginErrors).length > 0) {
      setErrors(loginErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/login",
        formData,
        {
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );

      resetForm();

      console.log("Login response:", response);

      if (response.status === 200) {
        const { token } = response.data;

        console.log("Token after login:", token);

        localStorage.setItem("token", token);

        console.log("Login successful!");
        navigate("/main");
      } else {
        setErrors({ login: "Invalid credentials" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setLoading(true);

    const forgotPasswordErrors = {};

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      forgotPasswordErrors.email = "Invalid email address";
    }

    if (formData.newPassword.length < 6 || !/\d/.test(formData.newPassword)) {
      forgotPasswordErrors.newPassword =
        "Password must be at least 6 characters long and contain at least one number";
    }

    if (Object.keys(forgotPasswordErrors).length > 0) {
      setErrors(forgotPasswordErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/forgot-password",
        formData
      );

      resetForm();

      console.log("Password reset successful!");
    } catch (error) {
      console.error("Password reset failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: undefined,
    });
  };

  return (
    <div className="RegFormContainer">
      {!showLoginForm && !showForgotPasswordForm && (
        <form className="RegForm" onSubmit={handleRegistration}>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          {errors.name && <div className="error">{errors.name}</div>}
          <input
            type="text"
            placeholder="User Name"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
          />
          {errors.userName && <div className="error">{errors.userName}</div>}
          <input
            type="text"
            placeholder="E-mail"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <div className="error">{errors.email}</div>}
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <div className="error">{errors.password}</div>}
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          {errors.confirmPassword && (
            <div className="error">{errors.confirmPassword}</div>
          )}
          {errors.registration && (
            <div className="error">{errors.registration}</div>
          )}
          <button
            className={`RegBtn ${errors.registration ? "error" : ""}`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Complete Registration"}
          </button>
        </form>
      )}

      {showLoginForm && (
        <form className="LoginForm" onSubmit={handleLogin}>
          {errors.login && <div className="error">{errors.login}</div>}
          <input
            type="text"
            placeholder="User Name"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
          />
          {errors.userName && <div className="error">{errors.userName}</div>}
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <div className="error">{errors.password}</div>}
          <button className="LoginBtn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
          <button
            className="ForgotPassword"
            onClick={toggleForgotPasswordForm}
            disabled={loading}
          >
            Forgot Password
          </button>
        </form>
      )}

      {showForgotPasswordForm && (
        <form className="ForgotPasswordForm" onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Your Email Address"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <div className="error">{errors.email}</div>}
          <input
            type="password"
            placeholder="New Password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
          />
          {errors.newPassword && (
            <div className="error">{errors.newPassword}</div>
          )}
          <button
            className="UpdatePasswordBtn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}

      <button className="SwitchFormBtn" onClick={toggleForm}>
        {showLoginForm
          ? "Or Register"
          : showForgotPasswordForm
          ? "Back to Login"
          : "Or Log In"}
      </button>
    </div>
  );
};

export default AuthForm;
