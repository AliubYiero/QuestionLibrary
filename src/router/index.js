import Vue from 'vue'
import VueRouter from 'vue-router'
import Answer from "@/views/Answer.vue";
import Question from "@/views/QuestionRouter.vue";
import Person from "@/views/Person.vue";
import Test from "@/views/Test.vue";

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Answer',
		component: Answer,
	},
	{
		path: '/question',
		name: 'Question',
		component: Question,
	},
	{
		path: '/person',
		name: 'Person',
		component: Person,
	},
	{
		path: '/test',
		name: 'Test',
		component: Test,
		props: true,
	},
]

const router = new VueRouter({
	routes
})

export default router
