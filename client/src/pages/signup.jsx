import React from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../style/Form.css";

function SignupPage() {
  const initialValues = {
    username: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be at least 8 characters and contain special characters"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  function handleSubmit(values, actions) {
    const { confirmPassword, ...formData } = values;

    axios
      .post("https://localhost:2443/users/signup", formData)
      .then((response) => {
        console.log(response.data.token);
        localStorage.setItem("authToken", response.data.token);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        actions.setSubmitting(false);
      });
  }

  return (
    <div className="form-container">
      <h1>Signup</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Form>
            <div>
              <label htmlFor="username" className="form-label">
                Username:
              </label>
              <Field
                type="text"
                id="username"
                name="username"
                className="form-input"
              />
              <ErrorMessage name="username" />
            </div>
            <div>
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="form-input"
              />
              <ErrorMessage name="password" />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password:
              </label>
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
              />
              <ErrorMessage name="confirmPassword" />
            </div>
            <div>
              <label htmlFor="firstname" className="form-label">
                First name
              </label>
              <Field
                type="text"
                id="firstname"
                name="firstname"
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="lastname" className="form-label">
                Last name
              </label>
              <Field
                type="text"
                id="lastname"
                name="lastname"
                className="form-input"
              />
            </div>
            <button
              type="submit"
              disabled={props.isSubmitting}
              className="form-button"
            >
              {props.isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignupPage;
