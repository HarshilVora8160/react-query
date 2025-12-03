import { useQuery } from "@tanstack/react-query";
import { REACT_APP_BASE_URL } from "../config";

const useQueryForUsers = () => {
  
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const users = await fetch(`${REACT_APP_BASE_URL}/users`);
      const data = await users.json();
      return data;
    },
  });

  return {
    data,
    isPending,
    isError,
    error,
  };
};

export default useQueryForUsers;
