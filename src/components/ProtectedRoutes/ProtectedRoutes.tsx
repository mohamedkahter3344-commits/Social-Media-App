
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({children}: {children: React.ReactNode}) => {

    if (localStorage.getItem("user_token")  === null) {
      return <Navigate to="/auth/login" />;
    }
  return (
    <>
      {children}
    </>
  )
}

export default ProtectedRoutes
