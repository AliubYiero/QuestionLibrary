export default {
	inserted(el) {

		const observer = new IntersectionObserver(([{isIntersecting}]) => {
			if (isIntersecting) {
				console.log(el);

				observer.unobserve(el)
			}
		});
		observer.observe(el)

	}
}
