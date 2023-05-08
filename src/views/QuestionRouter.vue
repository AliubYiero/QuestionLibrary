<template>
	<div id="question" style="overflow: visible;">
		<UploadFile accept-format="text/plain" title="上传待解析题库文件(txt)" @finish="parseQuestion"/>
		<el-button v-show="parseQuestionString" @click="saveFile">保存题库</el-button>
		<!-- TODO: 自定义导入配置  -->
		<el-button v-show="false">导入设置</el-button>

		<el-divider/>

		<el-container v-if="parseQuestionString">
			<!-- 显示解析后题库文本 -->
			<el-main class="el-main__flex_config">
				<!-- 显示解析后题库 -->
				<div class="question">
					<h1> {{ questionLibrary.title }} </h1>
					<div v-for="(question, index) in questionLibrary.questions" :key="question.id"
						 class="container__question">
						<Question :index="index + 1" :question="question" mode="answer"/>
					</div>
				</div>

				<el-divider/>

				<!-- 显示Json题库数据 -->
				{{ parseQuestionString }}
			</el-main>

			<!-- 显示原始题库文本 -->
			<el-aside class="el-aside__left-split">
				<p v-for="(line, index) in questionString" :key="index"> {{ line }} </p>
			</el-aside>
		</el-container>

	</div>
</template>

<script>
import FileSaver from "file-saver"
import QuestionReader from "@/js/QuestionReader";
import UploadFile from "@/components/UploadFile.vue";
import Question from "@/components/Question";
import {Message} from "element-ui";

export default {
	name: "QuestionRouter",
	components: {UploadFile, Question},

	data() {
		return {
			questionString: [],
			parseQuestionString: null,
			questionLibrary: null,
		}
	},

	methods: {

		/*
		* 1. 解析题库文件
		* */
		parseQuestion(questionString) {
			this.questionString = questionString
			/* TODO： 读取导入配置 */
			const questionReader = new QuestionReader(this.questionString)
			this.parseQuestionString = questionReader.parse()
			this.questionLibrary = JSON.parse(this.parseQuestionString)
			Message.success('文件解析完毕，请确认题目是否正确解析')
		},


		/*
		* 保存题库文件
		* */
		saveFile() {
			const blob = new Blob([this.parseQuestionString], {type: "text/plain;charset=utf-8"});
			FileSaver.saveAs(blob, `${this.questionLibrary.title}.json`);
		},
	},
}
</script>

<style scoped>
.el-aside__left-split {
	border-left: 1px #DCDFE6 solid;
	padding-left: 20px;
}

.el-main__flex_config {
	display: flex;
	flex-direction: column;
	align-content: center;
	align-items: center;
}
</style>
