import "../styles/login.css";
import banner from "../utils/images/banner.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Input, message, Alert } from "antd";
import google from "../utils/images/google.png";
import {
	signInWithEmailAndPassword,
	signInWithPopup,
	GoogleAuthProvider,
	browserPopupRedirectResolver,
} from "firebase/auth";
import { fb } from "../utils/firebase";

export default function Login(props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [alert, setAlert] = useState(false);
	const navigate = useNavigate();

	//change page title

	function newTitle() {
		document.title = "ChatGrid | Sign In";
	}
	useEffect(() => {
		newTitle();
	}, []);

	//loading button

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
		}, 2000);
	};

	////
	const API = "https://localhost:6060";

	// //GET FUNCTIONNN IN AXIOS

	// useEffect(() => {
	//   axios
	//     .get("https://jsonplaceholder.typicode.com/users")
	//     .then((res) => {
	//       console.log(res.data);
	//     })
	//     .catch((error) => {
	//       console.error(error.message);
	//     });
	// }, []);
	// //get using async and await
	// const getApi = async (url) => {
	//   try {
	//     const res = await axios.get(url);
	//     console.log(res.data);
	//   } catch (error) {
	//     console.log(error);
	//   }
	// };

	// useEffect(() => {
	//   getApi(`${API}api/users/2`);
	// }, []);

	// // // POST
	// const postApi = async (url, first, last) => {
	//   try {
	//     const res = await axios.post(url, {
	//       name: first,
	//       job: last,
	//     });
	//     console.log(res);
	//   } catch (error) {
	//     console.log(error);
	//   }
	// };

	// useEffect(() => {
	//   postApi(`${API}api/users`, "leo", "lakshmidhar");
	// }, []);

	// //PUT  //update data
	// const putApi = async (url, first, last) => {
	//   try {
	//     const res = await axios.put(url, {
	//       name: first,
	//       job: last,
	//     });
	//     console.log(res);
	//   } catch (error) {
	//     console.log(error);
	//   }
	// };

	// useEffect(() => {
	//   putApi(`${API}api/users/2`, "leo", "lakshmidhar"); //requires id
	// }, []);

	// //DELETE
	// const deleteApi = async (url) => {
	//   try {
	//     const res = await axios.put(url);
	//     console.log(res);
	//   } catch (error) {
	//     console.log(error);
	//   }
	// };

	// useEffect(() => {
	//   deleteApi(`${API}api/users/2`); //requires id
	// }, []);

	const handleSubmit = () => {
		enterLoading(0);
		signInWithEmailAndPassword(fb, email, password)
			.then((userCredential) => {
				console.log(userCredential.user);
				message.success("Login Success");
				navigate("/examples");
			})
			.catch((error) => {
				setAlert(true);
				setPassword("");
				console.log(error);
			});
	};

	const handleGoogleSignin = (e) => {
		e.preventDefault();
		//google pop up
		const provider = new GoogleAuthProvider();
		signInWithPopup(fb, provider, browserPopupRedirectResolver)
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
							<p>Sign in to start asking questions!</p>
						</div>
					</div>
				</div>
				<div className="login-page__right">
					<div className="login-page__right--heading">Sign In</div>

					<Form
						autoComplete="off"
						className="login-page__right--form"
						layout="vertical"
						onFinish={handleSubmit}
					>
						{alert && (
							<Alert
								className="alert"
								type="error"
								message="Invalid email or password"
							/>
						)}
						<Form.Item
							label="Email Address"
							name="email"
							rules={[
								{
									required: true,
									message: "Please enter your email",
								},
								{ type: "email", message: "Please enter valid email" },
							]}
						>
							<Input
								size="large"
								placeholder="user@example.com"
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
								}}
							></Input>
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
						<div className="password-alignment-error">
							<a
								className="login-page__right--forgot-password"
								href="#API"
								style={{ color: "#999999" }}
							>
								Forgot Password?
							</a>
						</div>

						<Form.Item>
							<Button
								block
								type="primary"
								htmlType="submit"
								loading={loadings[0]}
								// onClick={() => enterLoading(0)}
								size="large"
							>
								Sign In
							</Button>
						</Form.Item>
						<span className="or">Or</span>
						<Form.Item>
							<Button block onClick={handleGoogleSignin} size="large">
								<img className="google" src={google} alt="google logo" />
								<div className="googlewrap">Sign in with Google</div>
							</Button>
							<div className="login-page__right--create-account">
								<span style={{ color: "#999999" }}>New user?&nbsp; </span>
								<a href="/signup">Create account</a>
							</div>
						</Form.Item>
					</Form>
				</div>
			</div>
		</>
	);
}
