import Table from "react-bootstrap/Table";
import useQueryForUsers from "../hooks/useQueryForUsers";
import Button from "react-bootstrap/esm/Button";
import { REACT_APP_BASE_URL } from "../config";

const Home = ({ formik, setUserId }) => {
  const { data, isPending, isError, error } = useQueryForUsers();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Sr.No</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Action</th>
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
                  <td className="d-flex gap-2">
                    <Button
                      className="bg-transparent border border-primary text-primary fw-semibold"
                      onClick={() => {
                        setUserId(user._id);
                        formik.setValues({username: user.username, email: user.email});
                      }}
                    >
                      Edit
                    </Button>
                    {/* <Button className="bg-transparent border border-danger text-danger fw-semibold" onClick={() => setUserId(user._id)}>
                      Delete
                    </Button> */}
                  </td>
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
