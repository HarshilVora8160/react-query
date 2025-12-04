import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import "../App.css";
import { REACT_APP_BASE_URL } from "../config";
import toast, { Toaster } from "react-hot-toast";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import Home from "./home";

function UserSignup() {
  const queryClient = useQueryClient();

  // fetch data
  useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch(`${REACT_APP_BASE_URL}/users`);
      return res.userData.json();
    },
  });

  // mutation for newUser post request
  const signupUserMutation = useMutation({
    mutationFn: async (values) => {
      const res = await fetch(`${REACT_APP_BASE_URL}/user-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      return res.json();
    },

    onSuccess: (newUser) => {
      newUser.errorMessage && toast.error(newUser.errorMessage);
      newUser.successMessage && toast.success(newUser.successMessage);
      return newUser.userData && queryClient.setQueryData(["users"], (oldUsers) => [...oldUsers, newUser.userData]);
    },
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      username: Yup.string().required("username must be required!"),
      email: Yup.string().email("Invalid email address").required("email is required!"),
      password: Yup.string().required("password is required!").min(6, "Password required must be 6 characters!"),
    }),

    onSubmit: (values) => {
      signupUserMutation.mutate(values);
      formik.resetForm();
      formik.errors = {};
    },
  });

  return (
    <div className="border p-5 rounded-4 flex justify-center">
      <Form onSubmit={formik.handleSubmit}>
        <Form.Label className="mb-4">
          <span className="text-bold fs-1 bold fw-semibold text-decoration-underline">Registration Form</span>
        </Form.Label>
        <Form.Group className="mb-2 d-flex justify-content-center gap-2 align-items-center" controlId="formBasicEmail">
          <Form.Label>First Name : </Form.Label>
          <Form.Control className="w-50" type="text" placeholder="Enter username" name="username" onChange={formik.handleChange} value={formik.values.username} />
        </Form.Group>
        <div className="mb-4">
          {formik.errors.username && formik.errors.username ? (
            <span className="text-danger">{formik.errors.username}</span>
          ) : (
            <Form.Text className="text-muted ">We'll never share your username with anyone else.</Form.Text>
          )}
        </div>
        <Form.Group className="mb-2 d-flex justify-content-center align-items-center gap-2" controlId="formBasicEmail">
          <Form.Label>Email address : </Form.Label>
          <Form.Control className="w-50 " type="email" placeholder="Enter email" name="email" onChange={formik.handleChange} value={formik.values.email} />
        </Form.Group>
        <div className="mb-4">
          {formik.touched.email && formik.errors.email ? (
            <span className="text-danger">{formik.errors.email}</span>
          ) : (
            <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
          )}
        </div>
        <Form.Group className="mb-2 d-flex justify-content-center align-items-center gap-2" controlId="formBasicPassword">
          <Form.Label>Password : </Form.Label>
          <Form.Control className="w-50" type="password" placeholder="Enter Password" name="password" onChange={formik.handleChange} value={formik.values.password} />
        </Form.Group>
        <div className="mb-4">
          {formik.touched.password && formik.errors.password ? (
            <span className="text-danger">{formik.errors.password}</span>
          ) : (
            <Form.Text className="text-muted">We'll never share your password with anyone else.</Form.Text>
          )}
        </div>
        <Button variant="primary" type="submit" className="mb-3">
          Submit
        </Button>
        <Form.Group>
          <Form.Text>
            if you have already registered, so please move on{" "}
            <Link to="/login" className="text-primary text-decoration-underline">
              login
            </Link>
          </Form.Text>
        </Form.Group>
        <Toaster position="top-center" reverseOrder={false} />
      </Form>
      <Home />
    </div>
  );
}

export default UserSignup;
