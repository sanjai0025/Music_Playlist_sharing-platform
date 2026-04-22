import React from 'react'
import { BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from '../Login/Login'
import Home from '../Home/Home'
import HomeUser from '../Home/HomeUser'
import HomeAdmin from '../Home/HomeAdmin'
import Singup from '../Login/Singup'
import PlayList from '../PlayList/PlayList'
import Verify from '../Verify/Verify'

const Configuration = () => {
  return (
    <div>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}></Route>
                <Route path="/singup" element={<Singup/>}></Route>
                <Route path="/home" element={<Home/>}></Route>
                <Route path="/homeUser" element={<HomeUser/>}></Route>
                <Route path="/homeAdmin" element={<HomeAdmin/>}></Route>
                <Route path="/home/playlist" element={<PlayList/>}></Route>
                <Route path="/verify" element={<Verify/>}></Route>
                {/* <Route path="/product/:id" element={<Product/>}></Route> */}
            </Routes>
        </BrowserRouter>
    </div>
  )
}

export default Configuration