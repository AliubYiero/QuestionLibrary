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
							@focus.native="isFocusQuestion && setViewCenter"
					/>
				</div>
			</vue-lazy-component>
		</div>
		<template>
			<el-button
					tabindex="999"
					@keydown.enter.native="getOriginQuestions"
					@click.native="getOriginQuestions"
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
import SessionStorage from "@/class/SessionStorage";
import MapManager from "@/class/MapManager";

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
		isFocusQuestion: {
			type: Boolean,
			default: true,
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
			console.log("进入答题界面");
			/* 查询不到题目数据，自动跳转至Answer选择页面 */
			if (!this.questionLibrary) {
				console.log('查询不到题库数据，跳转至开始界面');
				this.$router.push("/");
			}

			if (this.questionNumber) {
				this.questionNumberLimiter()	// 设置题目数量
			}
			if (this.isRandomQuestion) {
				this.randomQuestionSetting()	// 设置乱序题目
			}
			console.log('显示题目');
		},

		/* 乱序题目设置 */
		randomQuestionSetting() {
			console.log('开始打乱题目顺序');
			this.questionLibrary.questions.sort(() => {
				return 0.5 - Math.random()
			})
		},

		/* 限制题目数量 */
		questionNumberLimiter() {
			console.log('开始筛选题目，限定题目数量');
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

		/* 设置视口高度，让聚焦元素始终在页面中间 */
		setViewCenter(e) {
			// `e.target.getBoundingClientRect()`函数获取元素和视口的距离，`.y`属性是元素顶部距离视口顶部的距离
			// `innerHeight / 2` 是视口高度的一半，即页面中心高度
			scrollBy(0, e.target.getBoundingClientRect().y - (innerHeight / 2) + (e.target.scrollHeight / 2))
		},

		/* 记录错误问题 */
		getWrongQuestions(question) {
			this.wrongQuestions.set(question.id, question)
		},
		setWrongQuestions() {
			this.questionLibrary.questions = Array.from(this.wrongQuestions.values())
		},
		/* 从SessionStorage获取原始题库数据 */
		getOriginQuestions() {
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
