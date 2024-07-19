import io from 'socket.io-client';
import './App.css';
import About from './components/About';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sender from './components/Sender';
import Rec from './components/Rec';
import Choice from './components/Choice';
import Login from './components/Login';
import Signup from './components/Signup';
import DriverLogin from './components/Driver/DriverLogin';
import StudentLogin from './components/Student/StudentLogin';
import Home from './components/Organization/Home';
import Sidebar from './components/Organization/Sidebar';
import AddStudent from './components/Organization/AddStudent';
import AddBus from './components/Organization/AddBus';
import AddStops from './components/Organization/AddStop';
import AddDriver from './components/Organization/AddDriver';
import AddRoute from './components/Organization/AddRoute';
import OrgSignup from './components/Organization/OrgSignup';
import OrganizationLogin from './components/Organization/OrganizationLogin';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Allot from './components/Organization/Allot';
import DriverHome from './components/Driver/DriverHome';
import DriverLocation from './components/Driver/DriverLocation';
// import StudentHome from './components/Student/StudentHome';
import StudentTracking from './components/Student/StudentTracking';
import TripsBreakdown from './components/Organization/TripsBreakdown';
import HomePage from './components/HomePage';
import StudentSidebar from "./components/Student/StudentSidebar";
import TrackLocation from "./components/Student/TrackLocation";
import ViewLocation from "./components/Student/ViewLocation";
import Profile from './components/Student/Profile';
import DriverSidebar from "./components/Driver/DriverSidebar";
import Sharelocation from "./components/Driver/Sharelocation.js";
import Location from "./components/Driver/DriverLocation";
import EditRoutes from "./components/Organization/EditRoutes.js";
import Changesseq from "./components/Organization/Changesseq.js"






function App() {
  const [driver, setDriver] = useState([])
  const [org, setOrg] = useState([])
  const [route, setRoutes] = useState([])
  const [student, setStudents] = useState([])
  const [stop, setStops] = useState([])
  const [trips, setTrips] = useState([])
  const [vehicle, setVehicle] = useState([])

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/driver`)
      .then(response => setDriver(response.data))

      .catch(err => console.error(err));
  }, []);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/org`)
      .then(response => setOrg(response.data))

      .catch(err => console.error(err));
  }, []);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/route`)
      .then(response => setRoutes(response.data))

      .catch(err => console.error(err));
  }, []);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/student`)
      .then(response => setStudents(response.data))

      .catch(err => console.error(err));
  }, []);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/stops`)
      .then(response => setStops(response.data))

      .catch(err => console.error(err));
  }, []);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/trips`)
      .then(response => setTrips(response.data))

      .catch(err => console.error(err));
  }, []);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/vehicle`)
      .then(response => setVehicle(response.data))

      .catch(err => console.error(err));
  }, []);
  return (
    <>

      <Router>
        <Routes>
          <Route path='/' exact element={<>
            <HomePage></HomePage>
          </>}
          />
          <Route path='/choice' exact element={<>
            <Choice></Choice>
          </>}
          />
          <Route path='/a' exact element={<>
            <About></About>
          </>}
          />
          <Route path='/login' exact element={<>
            <Login></Login>
          </>}
          />


          <Route path='/signup' exact element={<>
            <Signup></Signup>
          </>}
          />
          <Route path='/sender/:userId' exact element={<>
            <Sender></Sender>
          </>}
          />
          <Route path='/reciever/:senderId' exact element={<>
            <Rec></Rec>
          </>}
          />
          {/* home
 */}


          <Route path='/org/login' exact element={<>
            <div className="flex">

              <div className="flex-grow"> {/* AddStudent takes remaining space */}
                <OrganizationLogin></OrganizationLogin>
              </div>
            </div>
          </>}
          />
          <Route path='/org/signup' exact element={<>
            <div className="flex">

              <div className="flex-grow"> {/* AddStudent takes remaining space */}
                <OrgSignup />
              </div>
            </div>
          </>}
          />
          <Route path='/org/home' exact element={<>
            <div className="flex">
              <div className=""> {/* Fixed width for Sidebar */}
                <Sidebar />
              </div>
              <div className="flex-grow"> {/* AddStudent takes remaining space */}
                <Home driver={driver} student={student} route={route} stops={stop} vehicle={vehicle} trips={trips} />
              </div>
            </div>
          </>}
          />
          <Route path='/org/TripsBreakdown' exact element={<>
            <div className="flex">
              <div className=""> {/* Fixed width for Sidebar */}
                <Sidebar />
              </div>
              <div className="flex-grow"> {/* AddStudent takes remaining space */}
                <TripsBreakdown driver={driver} route={route} stops={stop} vehicle={vehicle} trips={trips} />
              </div>
            </div>
          </>}
          />
          <Route path='/org/AddStudent' exact element={<>
            <div className="flex">
              <div className=""> {/* Fixed width for Sidebar */}
                <Sidebar />
              </div>
              <div className="flex-grow"> {/* AddStudent takes remaining space */}
                <AddStudent />
              </div>
            </div>
          </>}
          />
          <Route path='/org/AddVehicle' exact element={
            <>
              <div className="flex">
                <div className=""> {/* Fixed width for Sidebar */}
                  <Sidebar />
                </div>
                <div className="flex-grow"> {/* AddBus takes remaining space */}
                  <AddBus />
                </div>
              </div>
            </>
          } />

          <Route path='/org/AddStop' exact element={
            <>
              <div className="flex">
                <div className=""> {/* Fixed width for Sidebar */}
                  <Sidebar />
                </div>
                <div className="flex-grow"> {/* AddStops takes remaining space */}
                  <AddStops />
                </div>
              </div>
            </>
          } />

          <Route path='/org/AddDriver' exact element={
            <>
              <div className="flex">
                <div className=""> {/* Fixed width for Sidebar */}
                  <Sidebar />
                </div>
                <div className="flex-grow"> {/* AddDriver takes remaining space */}
                  <AddDriver />
                </div>
              </div>
            </>
          } />

          <Route path='/org/AddRoute/*' exact element={
            <>
              <div className="flex">
                <div className=""> {/* Fixed width for Sidebar */}
                  <Sidebar />
                </div>
                <div className="flex-grow"> {/* AddRoute takes remaining space */}
                  <AddRoute />
                </div>
              </div>
            </>
          } />
          <Route path='/org/Allot' exact element={
            <>
              <div className="flex">
                <div className=""> {/* Fixed width for Sidebar */}
                  <Sidebar />
                </div>
                <div className="flex-grow"> {/* AddRoute takes remaining space */}
                  <Allot></Allot>
                </div>
              </div>
            </>
          } />


          {/* Driver */}

          <Route path='/driver/login' exact element={<>
            <DriverLogin></DriverLogin>
          </>}
          />
          {/* <Route path='/driver/home' exact element={<>
            <DriverHome org={org} stop={stop} trips={trips} route={route}> </DriverHome>
          </>}
          />
          <Route path='/driver/:userId' exact element={<>
            <DriverLocation trips={trips}></DriverLocation>
          </>}
          /> */}

          <Route
            path="/driver/home"
            exact
            element={
              <>
              
                <DriverSidebar />
                <DriverHome>
                  {" "}
                </DriverHome>
              </>
            }
          />
          <Route
            path="/driver/Location"
            exact
            element={
              <>
                <DriverSidebar />
                <Location org={org} stop={stop} trips={trips} route={route} />
              </>
            }
          />

          <Route
            path="/driver/Sharelocation/:roomId"
            exact
            element={
              <>
                <DriverSidebar />
                <Sharelocation />
              </>
            }
          />


          <Route path='/student/login' exact element={<>
            <StudentLogin />
          </>}
          />
          <Route
            path="/student/home"
            exact
            element={
              <div className="flex">
                <div className="">
                  <StudentSidebar />
                </div>
                <div className="flex-grow">
                  <Profile />
                </div>
              </div>
            }
          />
          <Route path='/student/:senderId' exact element={<>
            <StudentTracking></StudentTracking>
          </>}
          />
          <Route
            path="/student/TrackLocation"
            exact
            element={
              <div className="flex">
                <div className="">
                  <StudentSidebar />
                </div>
                <div className="flex-grow">
                  <TrackLocation />
                </div>
              </div>
            }
          />
          <Route
            path="/student/ViewLocation/:senderId/:routeId"
            exact
            element={
              <div className="block sm:flex">
                <div className="">
                  <StudentSidebar />
                </div>
                <div className="">
                  <ViewLocation />
                </div>
              </div>
            }
          />
          <Route
            path="/student/*"
            exact
            element={
              <div className="flex">
                <div className="">
                  <StudentSidebar />
                </div>
                <div className="flex-grow">{/* <AddRoute /> */}</div>
              </div>
            }
          />

<Route
            path="/org/EditRoutes"
            exact
            element={
              <>
                <div className="flex">
                  <div className="">
                    {" "}
                    {/* Fixed width for Sidebar */}
                    <Sidebar />
                  </div>
                  <div className="flex-grow">
                    {" "}
                    {/* AddRoute takes remaining space */}
                    <EditRoutes></EditRoutes>
                  </div>
                </div>
              </>
            }
          />


<Route
            path="/org/EditRoutes/:id"
            exact
            element={
              <>
                <div className="flex">
                  <div className="">
                    {" "}
                    {/* Fixed width for Sidebar */}
                    <Sidebar />
                  </div>
                  <div className="flex-grow">
                    {" "}
                    {/* AddRoute takes remaining space */}
                    <Changesseq></Changesseq>
                    
                  </div>
                </div>
              </>
            }
          />

        </Routes>
      </Router>
    </>
  );
}

export default App;
