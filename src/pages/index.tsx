import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../utils/trpc";
// import Auth from "./components/Auth";
import styles from "./index.module.css";

const Home: NextPage = () => {
	const { data } = trpc.useQuery(["auth.getSession"]);

	return (
		<>
			<div className={styles.containerOuter} style={{ flexDirection: 'column' }}>
				<h1 className={styles.title}>
					Typesafe videocall
				</h1>
				<h3>Hi {data?.user.name}</h3>
				<div style={{ flexDirection: 'column' }}>
					<Link href={'/create'}>
						<button className={styles.button}>Create</button>
					</Link>

					<Link href={'/view'}>
						<button className={styles.button}>View Rooms</button>
					</Link>
				</div>
			</div>
		</>
	);
};

export default Home;
