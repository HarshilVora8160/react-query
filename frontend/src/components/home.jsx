import Table from "react-bootstrap/Table";
import useQueryForUsers from "../hooks/useQueryForUsers";
import Button from "react-bootstrap/esm/Button";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Home = ({ formik, setUserId, deleteUserMutation }) => {
  const { data, isPending, isError, error } = useQueryForUsers();

  const user = JSON.parse(localStorage.getItem("user"));
  console.log("user------------", user);

  const { pathname } = useLocation();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return (
    <div>
      <Navbar />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Sr.No</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            {pathname === "/" ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {!data.length ? (
            <tr>
              <td colSpan={5} className="text-center">
                No Users Found
              </td>
            </tr>
          ) : (
            data?.map((user, index) => {
              return (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  {pathname === "/" ? (
                    <>
                      <td className="d-flex gap-2">
                        <Button
                          className="bg-transparent border border-primary text-primary fw-semibold"
                          onClick={() => {
                            setUserId({ editId: user._id, deleteId: null });
                            formik.setValues({ username: user.username, email: user.email });
                          }}
                        >
                          Edit
                        </Button>
                        <Button className="bg-transparent border border-danger text-danger fw-semibold" onClick={() => deleteUserMutation.mutate(user._id)}>
                          Delete
                        </Button>
                      </td>
                    </>
                  ) : null}
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Home;
