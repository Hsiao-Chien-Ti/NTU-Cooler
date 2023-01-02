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
    grade: {
        subscribe:(parent, {studentID, subject}, {pubsub})=>{
            console.log(studentID)
            return pubsub.subscribe(`GRADE ${studentID+subject}`)
        }
	}
}
export default Subscription