import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Admin from "./Admin";
import "./App.css";
import  Employee  from "./Employee";
import Header from "./Header";
import Hoe from "./Hoe";
import Manager from './Manager';
import Login from "./Login";
import Signup from "./Signup";
// import AuthProvider from "./AuthProvider";
import ProtectedRoute from "./ProtectedRoute";
import ConfigureSeatAllocation from "./configureSeatAllocation";
import SeatAllocation from "./seatAllocation";
import SeatAllocationAdmin from "./seatAllocationAdmin";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/hoe" element={<Hoe />} />
            <Route path="/manager" element={<Manager />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/seatAllocation" element={<SeatAllocation />}></Route>
            <Route
              path="/seatAllocationAdmin"
              element={<SeatAllocationAdmin />}
            ></Route>
            <Route
              path="/configureSeatAllocation"
              element={<ConfigureSeatAllocation />}
            ></Route>
            
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;