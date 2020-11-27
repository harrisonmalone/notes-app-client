export const getAuthStatus = async (loading, setAuth) => {
  if (loading) {
    const token = localStorage.getItem("token")
    try {
      if (!token) {
        throw new Error("not authorized");
      } else {  
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/users/status`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status >= 400) {
          throw new Error("not authorized");
        } else {
          setAuth({ auth: true, loading: false });
        }
      }
    } catch (err) {
      setAuth({ auth: false, loading: false });
    }
  }
};