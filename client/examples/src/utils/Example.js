import { Layout, Space } from "antd";
import "../styles/examples.css";
import { Card } from "antd";
import Carousel from "react-elastic-carousel";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import { onAuthStateChanged } from "firebase/auth";
import { fb } from "@react/auth";

const breakPoints = [
	{ width: 1, itemsToShow: 1 },
	{ width: 550, itemsToShow: 2 },
	{ width: 768, itemsToShow: 3 },
	{ width: 1200, itemsToShow: 4 },
];

const { Header, Footer, Content } = Layout;

function App() {
	const navigate = useNavigate();
	//change page title

	function newTitle() {
		document.title = "ChatGrid | Examples";
	}
	useEffect(() => {
		newTitle();
		onAuthStateChanged(fb, (user) => {
			console.log(
				"🚀 ~ file: Example.js:29 ~ onAuthStateChanged ~ user:",
				user
			);
			if (!user) {
				navigate("/login");
			}
		});
	}, []);

	function MyCard({ title, description }) {
		return (
			<>
				<div className="content__card">
					<Card
						title={title}
						bordered={false}
						size="small"
						onClick={() => {
							navigate("/chat");
						}}
					>
						{description}
						<ArrowRightOutlined className="content__card--arrow" />
					</Card>
				</div>
			</>
		);
	}

	return (
		<>
			<Space
				className="overview"
				direction="vertical"
				style={{
					minWidth: "94.719vw",
					paddingTop:"24px"
				}}
				size={[0, 48]}
			>
				<Layout>
					<Layout>
						{/* <Header className="header">Examples</Header> */}
						<Content className="content">
							<div className="content__row">
								<div className="content__row--heading">Article & Blogs</div>
								<div className="content__row--cards">
									<Carousel breakPoints={breakPoints}>
										<MyCard
											title="Blog Titles"
											description="Engaging blog titles that can enhance your website's traffic and user interaction."
										/>
										<MyCard
											title="Article Outlines"
											description="Thorough outlines for articles that enable you to consistently produce high-quality content."
										/>
										<MyCard
											title="Article Ideas"
											description="Ideas for articles/blogs that can help increase traffic, leads, and sales for your business."
										/>
										<MyCard
											title="Content Writing"
											description="Assist in writing high-quality, engaging, and SEO-friendly blogs/articles."
										/>
									</Carousel>
								</div>
							</div>
							<div className="content__row">
								<div className="content__row--heading">Ecommerce</div>
								<div className="content__row--cards">
									<Carousel breakPoints={breakPoints}>
										<MyCard
											title="Product Description"
											description="Genuine and compelling product descriptions that can inspire and influence customer behavior."
										/>
										<MyCard
											title="Product Titles"
											description="Product titles that can help your product differentiate from competitors and attract customers' attention"
										/>
										<MyCard
											title="Sales Copy"
											description="Effective sales copy that will help increase conversion rates and drive sales."
										/>
										<MyCard
											title="Promotional Email"
											description="Compelling promotional email content can help businesses improve their email marketing campaigns and increase customer engagement"
										/>
									</Carousel>
								</div>
							</div>
							<div className="content__row">
								<div className="content__row--heading">Education</div>
								<div className="content__row--cards">
									<Carousel breakPoints={breakPoints}>
										<MyCard
											title="Lesson Plans"
											description="deEffective lesson plans with innovative ideas to enhance student learning and engagements"
										/>
										<MyCard
											title="Assessments"
											description="Assessments with various question types, including multiple-choice, true/false, and short answer."
										/>
										<MyCard
											title="Grammar"
											description="Identify various grammar errors, such as incorrect tenses, subject-verb agreement, punctuation, and spelling mistakes."
										/>
										<MyCard
											title="Grading"
											description="Suggestions and corrections for written answers based on the provided rubric or criteria"
										/>
									</Carousel>
								</div>
							</div>
							<div className="content__row">
								<div className="content__row--heading">Other</div>
								<div className="content__row--cards">
									<Carousel breakPoints={breakPoints}>
										<MyCard
											title="Text Summary"
											description="Identify and extract the most important information and key points from a given text"
										/>
										<MyCard
											title="Translate"
											description="Translate your content into any language you want."
										/>
										<MyCard
											title="Ads"
											description="Eye-catching ads that will not only attract the right audience but also drive them to your lead magnet."
										/>
										<MyCard
											title="Song Lyrics"
											description="Create original and high-quality lyrics for any genre or style"
										/>
										<MyCard
											title="SQL Translate"
											description="Translate English queries into SQL code for efficient database management in just seconds."
										/>
									</Carousel>
								</div>
							</div>
							<Footer className="footer">
								Copyright © 2023 Grid Dynamics Holdings, Inc. All rights
								reserved.
							</Footer>
						</Content>
					</Layout>
				</Layout>
			</Space>
		</>
	);
}
export default App;
