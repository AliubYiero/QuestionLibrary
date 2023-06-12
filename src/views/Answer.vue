<template>
	<div id="answer">
		<el-container>
			<!-- TODO: 读取题库, 渲染到当前容器 -->
			<el-header class="aside__questions">
				<el-container>
					<el-header>
						<UploadFile accept-format="application/json" title="选择题库(json)"
									@finish="getQuestionLibrary"
									@md5Check="getFileMd5"
						/>
					</el-header>
					<el-main v-if="questionString"
							 class="option-container"
							 type="flex">
						<el-button class="item" @click="linkTest">开始答题</el-button>
						<el-checkbox v-model="checkedOptions.questionNumber" class="item">选择题量</el-checkbox>
						<el-input-number
								v-model="questionNumber"
								:max="questionLibrary.questions.length"
								:min="1"
								class="item"
						/>
						<el-checkbox v-model="isRandomQuestion" class="item">随机答题</el-checkbox>
						<el-checkbox v-model="isRandomOption" class="item">随机选项</el-checkbox>
						<el-tooltip class="item" content="选中问题后自动聚焦到页面中心" effect="dark"
									placement="right">
							<el-checkbox v-model="isFocusQuestion">专注模式</el-checkbox>
						</el-tooltip>
					</el-main>
				</el-container>

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
import MapManager from "@/class/MapManager";

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
			isFocusQuestion: false,		// 专注模式
			md5: null,
		}
	},

	methods: {
		getQuestionLibrary(questionString) {
			console.log('开始获取问题题库');
			this.questionString = questionString
			this.questionLibrary = JSON.parse(questionString)

			console.log('正在检查问题重复性');
			const map = MapManager.toMap(this.questionLibrary.questions, "id")
			this.questionLibrary.questions = map.toArray();

			console.log('开始渲染题库');
		},

		linkTest() {
			console.log('跳转至答题页面');
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
	margin: 200px 0 0 20%;
	width: 60%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-content: center;
	align-items: center;
}

.option-container {
	display: flex;
	flex-direction: column;
	text-align: center;
}

.option-container item {
}
</style>
