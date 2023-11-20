import "../styles/signup.css";
import banner from "../utils/images/banner.png";
import { Form, Button, Input, Alert } from "antd";
import google from "../utils/images/google.png";
import { fb } from "../utils/firebase";
import {
	createUserWithEmailAndPassword,
	signInWithPopup,
	GoogleAuthProvider,
	browserPopupRedirectResolver,
} from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup(props) {
	const API = "http://localhost:6060";

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [varFirst, setFirstname] = useState("");
	const [varLast, setLastname] = useState("");
	const [varUid, setUid] = useState("");
	const [alert, setAlert] = useState(false);
	const navigate = useNavigate();

	//change page title

	function newTitle() {
		document.title = "ChatGrid | Sign Up";
	}
	useEffect(() => {
		newTitle();
	}, []);

	//Loading
	const [loadings, setLoadings] = useState([]);
	const enterLoading = (index) => {
		setLoadings((prevLoadings) => {
			const newLoadings = [...prevLoadings];
			newLoadings[index] = true;
			return newLoadings;
		});
		setTimeout(() => {
			setLoadings((prevLoadings) => {
				const newLoadings = [...prevLoadings];
				newLoadings[index] = false;
				return newLoadings;
			});
		}, 3000);
	};
	///

	const postApi = async (url, getUid) => {
		try {
			console.log("in axios");
			console.log(getUid, varFirst, varLast, email);
			const res = await axios.post(url, {
				uid: getUid,
				firstName: varFirst,
				lastName: varLast,
				email: email,
			});
			console.log(res);
			console.log(varUid);
			console.log("out axios");
		} catch (error) {
			console.log(error);
		}
	};

	let sendUid = "";

	const signUp = (e) => {
		enterLoading(0);
		createUserWithEmailAndPassword(fb, email, password)
			.then((userCredential) => {
				console.log("in firebase");
				console.log(userCredential._tokenResponse.email);
				console.log(userCredential.user.uid);
				sendUid = userCredential.user.uid;
				setUid(sendUid);
				console.log(sendUid);
				console.log(email, varFirst, varFirst);
				console.log("out firebase");
				navigate("/examples");
				postApi(`${API}/v1/api/users/user`, sendUid);
			})
			.catch((error) => {
				console.log(error);
				setAlert(true);
			});
	};

	const handleGoogleSignin = (e) => {
		//google pop up
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider, browserPopupRedirectResolver)
			.then((result) => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				// The signed-in user info.
				const user = result.user;
				// IdP data available using getAdditionalUserInfo(result)
				// ...
				console.log(result);

				navigate("/examples");
			})
			.catch((error) => {
				// Handle Errors here.
				const errorCode = error.code;
				const errorMessage = error.message;
				// The email of the user's account used.
				const email = error.customData.email;
				// The AuthCredential type that was used.
				const credential = GoogleAuthProvider.credentialFromError(error);
				console.log(error);
				// ...
			});
	};

	return (
		<>
			<div className="login-page">
				<div className="login-page__left">
					<div className="wrapper">
						<div className="login-page__left--heading">
							<img src={banner} alt="" />
						</div>
						<div className="login-page__left--tagline">
							<p>Sign up to start asking questions!</p>
						</div>
					</div>
				</div>
				<div className="login-page__right">
					<div className="login-page__right--heading">Sign Up</div>

					<Form
						autoComplete="off"
						className="login-page__right--form"
						layout="vertical"
						onFinish={signUp}
					>
						{alert && (
							<Alert
								className="alert"
								type="error"
								message="Invalid email or password"
							/>
						)}
						<div className="login-page__right--name">
							<Form.Item
								name="irstname"
								label="First Name"
								value={varFirst}
								onChange={(e) => {
									setFirstname(e.target.value);
								}}
								rules={[
									{
										required: true,
										message: "Please enter your first name",
									},
								]}
								style={{
									display: "inline-block",
									width: "calc(50% - 8px)",
								}}
							>
								<Input placeholder="Enter your first name" size="large" />
							</Form.Item>
							<Form.Item
								name="Lastname"
								label="Last Name"
								rules={[
									{
										required: true,
										message: "Please enter your last name",
									},
								]}
								value={varLast}
								onChange={(e) => {
									setLastname(e.target.value);
								}}
								style={{
									display: "inline-block",
									width: "calc(50% - 8px)",
								}}
							>
								<Input placeholder="Enter your last name" size="large" />
							</Form.Item>
						</div>
						<Form.Item
							label="Email address"
							name="email"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							rules={[
								{ required: true, message: "Please enter your email" },
								{ type: "email", message: "Please enter valid email" },
							]}
						>
							<Input placeholder="user@example.com" size="large"></Input>
						</Form.Item>
						<Form.Item
							label="Password"
							name="password"
							rules={[
								{ required: true, message: "Please enter your password" },
							]}
						>
							<Input.Password
								size="large"
								placeholder="Enter your password"
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
								}}
							></Input.Password>
						</Form.Item>

						<Form.Item>
							<Button
								block
								size="large"
								type="primary"
								htmlType="submit"
								loading={loadings[0]}
								// onClick={() => enterLoading(0)}
							>
								Sign Up
							</Button>
						</Form.Item>
						<span className="or col">Or</span>
						<Form.Item>
							<Button block onClick={handleGoogleSignin} size="large">
								<img className="google" src={google} alt="" />
								<div className="googlewrap">Sign Up with Google</div>
							</Button>
							<div className="login-page__right--create-account">
								<span style={{ color: "#999999" }}>
									Already have an account?&nbsp;
								</span>
								<a href="/login"> Sign In</a>
							</div>
						</Form.Item>
					</Form>
				</div>
			</div>
		</>
	);
}
