<template>
	<div id="answer">
		<el-container>
			<!-- TODO: 读取题库, 渲染到当前容器 -->
			<el-header class="aside__questions">

				<el-row style="flex-direction: column; text-align: center;" type="flex">

					<el-col :span="24">
						<UploadFile accept-format="application/json" title="选择题库(json)"
									@finish="getQuestionLibrary"
									@md5Check="getFileMd5"
						/>
					</el-col>

					<template v-if="questionString">
						<el-col :span="24">
							<el-button @click="linkTest">开始答题</el-button>
						</el-col>

						<el-col :span="24">
							<!-- TODO: 刷题题量, Max:题库最大数 -->
							<el-checkbox v-model="checkedOptions.questionNumber">选择题量</el-checkbox>
						</el-col>
						<el-col v-show="checkedOptions.questionNumber" :span="24">
							<el-input-number
									v-model="questionNumber"
									:max="questionLibrary.questions.length"
									:min="1"
							>
							</el-input-number>
						</el-col>

						<el-col :span="24">
							<el-checkbox v-model="isRandomQuestion">随机答题</el-checkbox>
						</el-col>

						<el-col :span="24">
							<el-checkbox v-model="isRandomOption">随机选项</el-checkbox>
						</el-col>

						<el-col v-if="false" :span="24">
							<!-- TODO: 答完一题立即显示答案 -->
							<el-checkbox>立即显示答案</el-checkbox>
						</el-col>


						<el-col v-if="false" :span="24">
							<!-- TODO: 题目完成全部做过之后仍然继续答题 -->
							<el-checkbox>循环答题</el-checkbox>
						</el-col>
					</template>

				</el-row>
			</el-header>

			<!-- TODO: 答案组件 -->
			<el-main v-if="questionString" class="el-main__flex_config">
				<vue-lazy-component v-if="questionString">
					<el-divider/>
					<!-- 显示解析后题库 -->
					<div class="question">
						<h1> {{ questionLibrary.title }} </h1>
						<div v-for="(question, index) in questionLibrary.questions" :key="question.id"
							 class="container__question">
							<Question :index="index + 1" :isRandomOption="isRandomOption" :question="question"
									  mode="answer"/>
						</div>
					</div>
				</vue-lazy-component>
			</el-main>
		</el-container>
	</div>
</template>

<script>
import UploadFile from "@/components/UploadFile.vue";
import Question from "@/components/Question.vue";

export default {
	name: "Answer",
	components: {Question, UploadFile},

	data() {
		return {
			checkedOptions: {
				questionNumber: null,
				timeDisplay: null,
			},
			questionNumber: 20,

			questionString: null,
			questionLibrary: null,

			isRandomOption: true,		// 无序问题
			isRandomQuestion: true,		// 无序选项
			md5: null,
		}
	},

	methods: {
		getQuestionLibrary(questionString) {
			this.questionString = questionString
			this.questionLibrary = JSON.parse(questionString)
			// console.log(this.questionLibrary);
		},

		linkTest() {
			this.$router.push({
				name: 'Test',
				params: {
					questionLibrary: this.questionLibrary,
					questionNumber: this.checkedOptions.questionNumber && this.questionNumber,
					isRandomOption: this.isRandomOption,
					md5Key: this.md5,
					isRandomQuestion: this.isRandomQuestion,
				}
			})
		},

		getFileMd5(code) {
			console.log(code);
			this.md5 = code
		}
	},
}
</script>

<style scoped>
.el-main__flex_config {
	margin: 100px 0 0 20%;
	width: 60%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-content: center;
	align-items: center;
}
</style>
