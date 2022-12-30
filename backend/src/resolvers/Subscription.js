const Subscription = {
	syllabus: {
        subscribe:(parent,{pubsub})=>{
            return pubsub.subscribe('SYLLABUS')
        }
	}
}
export default Subscription