import {
	BrowserRouter,
	Route,
	Routes
} from 'react-router-dom';
import React from 'react';
import Home from './Components/page/Home/Home'
import Done from './Components/modules/Done';
import Add from './Components/page/Add/Add';
import { AuthProvider } from './context/AuthContext';
import SingIn from './Components/modules/SignIn';
import SelectCalendar from './Components/page/Calendar/SelectCalendar';
import JoinTeam from './Components/modules/JoinTeam';
// import Teacher from './Components/modules/Teacher';

const App = () => {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/" />
					<Route index element={<SingIn />} />
					<Route path="home" element={<Home />} />
					<Route path="add" element={<Add />} />
					<Route path="done" element={<Done />} />
					<Route path="calendar" element={<SelectCalendar />} />
					<Route path="jointeam" element={<JoinTeam />} />
					{/* <Route path='teacher' element={<Teacher />} /> */}
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	)
}

export default App;

