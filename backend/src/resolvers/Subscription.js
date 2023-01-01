const Subscription = {
	syllabus: {
        subscribe:(parent, args, { pubsub })=>{
            
            return pubsub.subscribe('SYLLABUS')
        }
	},
    announcement: {
        subscribe:(parent, args, {pubsub})=>{
            return pubsub.subscribe('ANNOUNCEMENT')
        }
	},
    file: {
        subscribe:(parent, args, {pubsub})=>{
            console.log(pubsub)
            return pubsub.subscribe('FILE')
        }
	},
    // grade: {
    //     subscribe:(parent, args, {pubsub})=>{
    //         return pubsub.subscribe('GRADE')
    //     }
	// }
}
export default Subscription