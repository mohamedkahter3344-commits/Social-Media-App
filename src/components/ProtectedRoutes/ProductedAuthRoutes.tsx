import React from 'react'
import { Navigate } from 'react-router-dom';

const ProductedAuthRoutes = ({children}: {children: React.ReactNode}) => {
   if (localStorage.getItem("user_token")  !== null) {
      return <Navigate to="/" />;
    }
  return (
    <>
      {children}
    </>
  )
}

export default ProductedAuthRoutes





