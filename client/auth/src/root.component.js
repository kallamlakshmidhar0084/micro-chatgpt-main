import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";

export default function Root(props) {
	return (
		<>
			<BrowserRouter>
				<ConfigProvider
					theme={{
						token: {
							colorPrimary: "#ffb800",
							colorPrimaryHover: "#F7931D",
							colorLink: "#ffb800",
							colorLinkHover: "#f7931d",
						},
					}}
				>
					<Routes>
						<Route path="/" element={<Login />} />
						<Route path="/login" element={<Login />} />
						<Route path="/signup" exact element={<SignUp />} />
					</Routes>
				</ConfigProvider>
			</BrowserRouter>
		</>
	);
}
