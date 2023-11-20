import {
	AppstoreOutlined,
	LogoutOutlined,
	SettingOutlined,
} from "@ant-design/icons";
import {
	faMoon,
	faSun,
	faUser,
	faComments,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/sidebar.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "./images/logo.png";
import logo2 from "./images/logo2.png";
import { Layout, Menu, ConfigProvider } from "antd";
import React from "react";
import { fb } from "@react/auth";
import { signOut, onAuthStateChanged } from "firebase/auth";
const { Sider } = Layout;

//signout
function userSignOut() {
	signOut(fb)
		.then(() => {
			console.log("logout success");
			location.reload();
		})
		.catch((error) => {
			console.log(error);
		});
}




function App() {
	const [collapsed, setCollapsed] = useState(true);
	const [loginStatus, setLoginStatus] = useState(false);
	const navigate = useNavigate();
	const displayEmail = useRef("");
	
	// restrict user
  
	useEffect(function checkUser() {

	  onAuthStateChanged(fb, (user) => {
		console.log("🚀 ~ file: Side.js:73 ~ onAuthStateChanged ~ user:", user);
		if (!user) {
			console.log("logged out_");
		  setLoginStatus(true);
		  navigate("/login");
		} else {
			console.log("logged in");
			displayEmail.current = user.email;
			setLoginStatus(false);
		}
	  });
	}, [collapsed]);

	
	const modes = [
    {
      name: "Light Mode",
      key: "light",
      icon: <FontAwesomeIcon icon={faSun} />,
    },
    {
      name: "Dark Mode",
      key: "dark",
      icon: <FontAwesomeIcon icon={faMoon} />,
    },
    {
      name: `${displayEmail.current}`,
      key: "user",
      icon: <FontAwesomeIcon icon={faUser} />,
    },
  ].map((link) => ({
    key: link.key,
    icon: link.icon,
    label: link.name,
  }));


	const items = [
		{
			name: "Examples",
			href: "/examples",
			icon: <AppstoreOutlined />,
		},
		{
			name: "Chat",
			href: "/chat",
			icon: <FontAwesomeIcon icon={faComments} />,
		},
		{
			name: "Settings",
			href: "/settings",
			icon: <SettingOutlined />,
		},
		{
			name: "Log out",
			href: "/login",
			icon: <LogoutOutlined />,
		},
	].map((link) => ({
		key: link.href,
		className:
			link.href == window.location.pathname ? "ant-menu-item-selected" : "",
		icon: link.icon,
		label: link.name,
	}));

	return (
		<div className="fixed">
			<Layout>
				<ConfigProvider
					theme={{
						token: {
							colorBgContainer: "#F9F9FB",
							colorPrimary: "#ffb800",
						},
					}}
				>
					<Sider
						trigger={null}
						collapsible
						collapsed={collapsed}
						width="150"
						onMouseEnter={() => {
							setCollapsed(false);
						}}
						onMouseLeave={() => {
							setCollapsed(true);
						}}
						style={{
							overflow: "auto",
							height: "100vh",
							position: "fixed",
							left: 0,
							top: 0,
							bottom: 0,
							background: "#F9F9FB",
						}}
					>
						<div
							className="logo"
							style={{
								display: "flex",
								justifyContent: "center",
								borderBottom: "2px solid #F0F0F0",
							}}
						>
							<img
								src={logo}
								alt=""
								style={{
									display: collapsed ? "none" : "flex",
									width: "95%",
									padding: "10px",
								}}
							/>
							<img
								src={logo2}
								alt=""
								style={{
									display: collapsed ? "flex" : "none",
									padding: "10px",
								}}
							/>
						</div>
						<Menu
							onClick={({ key }) => {
								if (key == "/login") {
									userSignOut();
									navigate(key);
								} else {
									navigate(key);
								}
							}}
							className="menu"
							theme="light"
							mode="inline"
							items={items}
						/>
						<Menu
							defaultSelectedKeys={"light"}
							className="modes"
							theme="light"
							mode="inline"
							items={modes}
						/>
					</Sider>
				</ConfigProvider>
			</Layout>
		</div>
	);
}

export default App;
