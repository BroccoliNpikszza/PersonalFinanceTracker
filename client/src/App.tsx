import Layout from "./app/dashboard/layout"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Account from "./pages/Account"

export default function App() {
  return (
    <div>
      <Layout >
      <main className="main-content">
        <Routes>
          <Route path="/home"element={<Home/>}/>
          <Route path="/account"element={<Account/>}/>

        </Routes>
      
      </main>
      </Layout>
    </div>
  )
}
