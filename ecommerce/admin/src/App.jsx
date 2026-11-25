import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './pages/Layout'
import DashBoard from './pages/DashBoard'
import Analytics from './pages/Analytics'
import Products from './pages/Products'
import Categories from './pages/Categories'
import CategoryForm from './pages/CategoryForm'
import { Toaster } from 'sonner'
import ProductForm from './pages/ProductForm'


export default function App() {
  const routers = createBrowserRouter([
    {
      path: "/admin",
      element: <Layout />,
      children: [
        {
          path: "/admin",
          element: <DashBoard />
        },
        {
          path: "/admin/analytics",
          element: <Analytics />
        },
        {
          path: "/admin/products",
          element: <Products />
        },
        {
          path: "/admin/categories",
          element: <Categories />
        },
        {
          path: "/admin/category/add",
          element: <CategoryForm />
        },
        {
          path:"/admin/category/edit/:id",
          element:<CategoryForm/>
        },
        {
          path:"/admin/product/add",
          element:<ProductForm/>
        },
        {
          path:"/admin/product/edit/:id",
          element:<ProductForm/>
        }
        

      ]
    }
  ])
  return (
    <>
      <Toaster position="top-right" richColors />
      <RouterProvider router={routers} />
    </>

  )
}
