import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import axios from "axios";
import { REACT_APP_BASE_URL } from "../config";
import toast, { Toaster } from "react-hot-toast";

const UserLogin = () => {
  const navigate = useNavigate();

  const { handleSubmit, handleBlur, handleChange, touched, errors, values, resetForm } = useFormik({
    // const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("email is required!"),
      password: Yup.string().required("password is required!").min(6, "password must be 6 characters!"),
    }),

    onSubmit: async (values) => {
      await axios
        .post(`${REACT_APP_BASE_URL}/user-login`, values)
        // .post(`${REACT_APP_BASE_URL}/user-login`, values, {
        //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        // })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          if (res.data.userData) {
            toast.success(res.data.successMessage);
            if (localStorage.getItem("token")) {
              resetForm();
              setTimeout(() => {
                navigate("/");
              }, 500);
            }
          } else {
            toast.error(res.data.errorMessage);
          }
        })
        .catch((errors) => console.log(errors));
    },
  });

  return (
    <div className="flex justify-content-center align-items-center">
      <Form className="border p-3 rounded-4" onSubmit={handleSubmit}>
        <Form.Label className="fs-1 fw-semibold text-decoration-underline mb-4">Login Form</Form.Label>

        <Form.Group className="d-flex align-items-center gap-2 justify-content-center mb-1">
          <Form.Label>Email : </Form.Label>
          <Form.Control className="w-50" type="email" name="email" placeholder="Enter email" onChange={handleChange} onBlur={handleBlur} value={values.email} />
        </Form.Group>
        <div className="mb-3">{touched.email && errors.email ? <span className="text-danger">{errors.email}</span> : ""}</div>

        <Form.Group className="d-flex align-items-center gap-2 justify-content-center mb-2">
          <Form.Label>Password : </Form.Label>
          <Form.Control className="w-50" type="password" name="password" placeholder="Enter password" onChange={handleChange} value={values.password} />
        </Form.Group>
        <div className="mb-3">{touched.password && errors.password ? <span className="text-danger">{errors.password}</span> : ""}</div>

        <Form.Group>
          <Button type="submit">Login</Button>
        </Form.Group>

        <Form.Text>
          If don't have an account, please{" "}
          <Link to="/signup" className="text-primary">
            Signup
          </Link>
        </Form.Text>

        <Toaster position="top-center" reverseOrder={false} />
      </Form>
    </div>
  );
};

export default UserLogin;
