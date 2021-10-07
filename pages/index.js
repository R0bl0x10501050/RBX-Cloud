function Index(props) {
	return (
		<>
			<pre style="word-wrap: break-word; white-space: pre-wrap; font-family: monospace;">
				<p>{props.message}</p>
			</pre>
		</>
	)
}

export async function getServerSideProps(ctx) {
	ctx.res.json({ message: 'Welcome to the RBX Cloud API!' });
	return {
		props: {
			message: "Welcome to the RBX Cloud API!"
		}, // will be passed to the page component as props
	}
}

export default Index;