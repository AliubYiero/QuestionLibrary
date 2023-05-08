<template>

	<div id="test">
		<!-- 显示解析后题库 -->
		<div class="question">
			<h1> {{ questionLibrary.title }} </h1>
			<!-- 懒加载 -->
			<vue-lazy-component>
				<div v-for="(question, index) in questionLibrary.questions" :key="question.id"
					 class="container__question">
					<Question
							:index="index + 1"
							:isRandomOption="isRandomOption"
							:question="question"
							mode="question"
							@halfCorrect="getWrongQuestions(question)"
							@wrong="getWrongQuestions(question)"
					/>
				</div>
			</vue-lazy-component>
		</div>
		<template>
			<el-button
					tabindex="999"
					@keydown.enter.native="setOriginQuestions"
					@click.native="setOriginQuestions"
			>
				重新做题
			</el-button>
			<el-button @click.native="setWrongQuestions">
				查看错题
			</el-button>
		</template>
	</div>

</template>

<script>
import Question from "@/components/Question.vue";
import SessionStorage from "@/js/SessionStorage";

export default {
	name: "Test",
	components: {Question},

	props: {
		questionLibrary: {
			type: Object,
			required: true,
		},
		questionNumber: {
			type: Number,
		},
		isRandomQuestion: {
			type: Boolean,
			default: false,
		},
		isRandomOption: {
			type: Boolean,
			default: false,
		},
		isLoop: {
			type: Boolean,
			default: false,
		},
		md5Key: {
			type: String,
		}
	},

	data() {
		return {
			display: true,
			wrongQuestions: new Map(),
		}
	},

	methods: {
		/* 默认设置 */
		defaultSetting() {
			// console.log("进入答题界面");
			// console.log(this.questionLibrary);

			if (this.questionNumber) {
				this.questionNumberLimiter()	// 设置题目数量
			}
			if (this.isRandomQuestion) {
				this.randomQuestionSetting()	// 设置乱序题目
			}
		},

		/* 乱序题目设置 */
		randomQuestionSetting() {
			this.questionLibrary.questions.sort(() => {
				return 0.5 - Math.random()
			})
		},

		/* 限制题目数量 */
		questionNumberLimiter() {
			console.log(1);
			let questionsIndex = [];
			// console.log(this.questionLibrary.questions.length);
			for (let i = 0; i < this.questionLibrary.questions.length; i++) {
				questionsIndex.push(i)
			}
			// 乱序索引
			questionsIndex.sort(() => {
				return Math.random() - 0.5
			})

			// 排序
			questionsIndex = questionsIndex.slice(0, this.questionNumber)
			questionsIndex.sort((a, b) => {
				return a - b
			})

			// 获取筛选后顺序数组
			const newQuestions = [];
			questionsIndex.filter(num => {
				newQuestions.push(this.questionLibrary.questions[num]);
			})
			this.questionLibrary.questions = newQuestions
		},

		/* 记录错误问题 */
		getWrongQuestions(question) {
			this.wrongQuestions.set(question.id, question)
		},
		setWrongQuestions() {
			this.questionLibrary.questions = Array.from(this.wrongQuestions.values())
		},
		setOriginQuestions() {
			const sessionStorage = new SessionStorage();
			this.questionLibrary = JSON.parse(sessionStorage.get(this.md5Key))
			this.defaultSetting()
			scrollTo(0, 0)
		}
	},

	mounted() {
		this.defaultSetting()
	},
}
</script>

<style scoped>
#test {
	width: 50%;
	margin: 0 auto;
}
</style>
