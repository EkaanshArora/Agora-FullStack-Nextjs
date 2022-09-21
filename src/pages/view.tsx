import { useRouter } from 'next/router';
import { trpc } from '../utils/trpc';
import styles from './index.module.css'

const ViewRooms = () => {
	const query = trpc.useQuery(["auth.getAllRooms"])
	const router = useRouter()

	return (<>
		<h1 className={styles.title}>
			Rooms:
		</h1>
		<div>
			{query.isLoading || !query.data ? <p>loading...</p> :
				<>
					{query.data.map(room =>
						<div key={room.roomId} style={{ cursor: 'pointer' }} onClick={() => { router.push(`call/${room.roomId}`) }}>
							<h2>{room.name}</h2>
							<p>{room.description}</p>
						</div>
					)}
				</>
			}
		</div>
	</>)
}

export default ViewRooms;
