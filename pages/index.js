function Index(props) {
	return (
		<>
		</>
	)
}

export async function getServerSideProps(ctx) {
	ctx.res.statusMessage = "Welcome to the RBX Cloud API!";
	ctx.res.end();
	return {
		props: {}, // will be passed to the page component as props
	}
}

export default Index;