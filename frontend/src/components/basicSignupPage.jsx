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
import { useState } from "react";

function BasicSignupPage() {
  const [userId, setUserId] = useState({ editId: null });

  const queryClient = useQueryClient();

  // fetch data
  useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch(`${REACT_APP_BASE_URL}/users`);
      return res.json();
    },
  });

  // mutation for updateUser PUT request
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId: { editId: _id }, values }) => {
      return await fetch(`${REACT_APP_BASE_URL}/user-update/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => data)
        .catch((error) => console.log(error));
    },

    onSuccess: (response) => {
      response.successMessage && toast.success(response.successMessage);
      response.errorMessage && toast.error(response.errorMessage);
      queryClient.setQueryData(["users"], (oldData) => oldData.map((user) => (user._id === response.data._id ? response.data : user)));
      setTimeout(() => {
        setUserId(null);
      }, 3000);
      formik.resetForm();
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      return await fetch(`${REACT_APP_BASE_URL}/user-delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(),
      })
        .then((res) => res.json())
        .then((data) => data)
        .catch((error) => console.log(error));
    },

    onSuccess: (response) => {
      // if (response?.errorMessage) {
      //   toast.error(response.errorMessage);
      // } else if(response?.data) {
      //     toast.success(response.successMessage);
      //     queryClient.setQueryData(["users"], (oldData) => oldData.filter((user) => user._id !== response.data._id));
      // }

      response.successMessage && toast.success(response.successMessage);
      response.errorMessage && toast.error(response.errorMessage);
      return response.data && queryClient.setQueryData(["users"], (oldData) => oldData.filter((user) => user._id !== response.data._id));
    },
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
    },

    validationSchema: Yup.object({
      username: Yup.string().required("username must be required!"),
      email: Yup.string().email("Invalid email address").required("email is required!"),
    }),

    onSubmit: (values) => {
      updateUserMutation.mutate({ userId, values });
      formik.resetForm();
      formik.errors = {};
    },
  });

  return (
    <div className="border p-5 rounded-4 flex justify-center">
      {userId?.editId && (
        <Form onSubmit={formik.handleSubmit}>
          <Form.Label className="mb-4">
            <span className="text-bold fs-1 bold fw-semibold text-decoration-underline">Profile update form</span>
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
        </Form>
      )}
      <Toaster position="top-center" reverseOrder={false} />
      <Home formik={formik} userId={userId} setUserId={setUserId} deleteUserMutation={deleteUserMutation} />
      {/* <TransitionsModal /> */}
    </div>
  );
}

export default BasicSignupPage;
