const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return <h1>Welcome, {user?.username}</h1>;
};

export default Navbar;
