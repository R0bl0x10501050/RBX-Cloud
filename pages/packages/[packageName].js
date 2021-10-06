import { useRouter } from 'next/router';

const Index = () => {
	const router = useRouter()
	const { packageName } = router.query

	return (<></>)
}

export default Index;