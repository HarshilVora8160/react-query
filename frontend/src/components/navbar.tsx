const Navbar = () => {
  const user = JSON.parse(localStorage.getItem( "user" ) || "{}" );
  console.log("user------------", user);

  return <h1>Welcome, {user?.email}</h1>;
};

export default Navbar;
