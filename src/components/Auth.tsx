import styles from "../pages/index.module.css";
import { signIn, signOut, useSession } from "next-auth/react";
import { PropsWithChildren } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const Auth: React.FC<PropsWithChildren> = (props) => {
	const { status } = useSession()
	const router = useRouter()

	if (status === "loading") {
		return <p>loading...</p>
	}

	if (status === "unauthenticated") {
		return <>
			<Head>
				<title>Hi React India</title>
			</Head>
			<div className={styles.containerOuter} style={{ flexDirection: 'column' }}>
				<h1 className={styles.title}>
					Login
				</h1>
				<div>
					<button onClick={() => signIn()} className={styles.button}>Sign In</button>
				</div>
			</div>
		</>
	}

	return (
		<>
			<Head>
				<title>Hi React India</title>
			</Head>
			<div style={{ flexDirection: 'column' }}>
				{props.children}
				<br />
				<button onClick={() => router.push('/')} className={styles.button}>Home</button>
				<button onClick={() => signOut()} className={styles.button}>SignOut</button>
			</div>
		</>
	)
}

export default Auth;