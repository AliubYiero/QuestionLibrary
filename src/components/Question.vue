<template>
	<div id="question"
		 :tabindex="index"
		 @keydown="bindChosenBtn"
		 @keydown.enter="checkChosenCorrect"
	>
		<!-- 问题 -->
		<div class="question">
			<span>{{ index }}. </span>
			<span style="color: gray;">[{{ question.status }}] </span>
			<div v-for="content in question.question" :key="question.id">
				{{ content }}
			</div>
		</div>

		<!-- 选项 -->
		<!-- @comment: 将选项组的宽度设为`width: 100%`，让选项可以在整行选中 -->
		<component
				:is="`el-${item}-group`"
				v-model="optionChecked"
				style="width: 100%;"
		>
			<component
					:is="`el-${item}`"
					v-for="(option, index) in question.options"
					:key="question.id + index"
					:label="question.id + index"
					class="option"
			>
				{{ upper_alpha_list[index] }}. {{ option[0] }}
			</component>
		</component>

		<!-- 提交答案按钮 -->
		<el-button
				v-show="mode === 'question'"
				class="confirm-button"
				size="mini"
				@click="checkChosenCorrect"
		>
			确定
		</el-button>
	</div>
</template>

<script>
import {Message} from "element-ui";

function compareArray(a, b) {
	// console.log(a, b);
	// 单选/判断
	if (typeof a === 'number' || typeof a === 'string') {
		return a === b
	}
	// 多选
	for (let i = 0; i < a.length; i++) {
		const element = a[i]
		if (!b.includes(element)) {
			return false;
		}
	}
	if (a.length === b.length) {	// 多选全选对
		return true
	} else {		// 多选选对一部分
		return "true"
	}

}

export default {
	name: "Question",

	props: {
		question: {
			type: Object,
			required: true,
		},
		index: {
			type: Number,
			default: 1,
		},
		mode: {
			type: String,
			default: 'question',
			validator: function (value) {
				return ['question', 'answer'].includes(value)
			}
		},
		isRandomOption: {
			type: Boolean,
			default: false,
		},

	},

	data() {
		return {
			optionChecked: [],
			correctOptionId: [],
			correctOption: [],
			item: 'radio',
			upper_alpha_list: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
		}
	},

	methods: {
		defaultSetting() {
			console.log(`开始解析题目${this.index} [${this.question.id}]：${this.question.question}`);
			if (this.isRandomOption) {	// 设置随机选项
				this.setOptionRandom();
			}
			this.checkDisplayMode();	// 设置显示模式
			this.checkQuestionType();	// 设置问题类型（用于选项的按钮类型输出）
		},

		/* 判断题目显示模式 */
		checkDisplayMode() {
			// 获取正确选项
			for (let i = 0; i < this.question.options.length; i++) {
				const option = this.question.options[i]
				if (option[1] && this.question.status.match('多选')) {
					this.correctOptionId.push(this.question.id + i)
					this.correctOption.push(this.upper_alpha_list[i])
				} else if (option[1]) {
					this.correctOptionId = this.question.id + i
					this.correctOption.push(this.upper_alpha_list[i])
				}
			}

			if (this.mode === "answer") {
				this.optionChecked = this.correctOptionId
			}
		},

		/* 判断题目类型 */
		checkQuestionType() {
			if (this.question.status.match("多选")) {
				this.item = 'checkbox'
			} else {
				this.item = 'radio'
			}
		},

		/* 设置题目随机选项 */
		setOptionRandom() {
			console.log('设置题目随机选项');
			if (this.question.status === "判断题") {
				return
			}
			this.question.options.sort(() => {
				return Math.random() - 0.5
			})
		},

		/* 绑定键盘事件，让数字按键可以映射选项选择 */
		bindChosenBtn(e) {
			console.log(`[${this.optionChecked}] 选项选择：按键映射${e.key}`);
			if (!e.key.match(/[1-9]/)) {
				return
			}

			const optionId = parseInt(this.question.id + (e.key - 1))
			if (this.question.status === "多选题") {
				if (this.optionChecked.includes(optionId)) {
					this.optionChecked = this.optionChecked.filter(id => id !== optionId)
				} else {
					this.optionChecked.push(optionId)
				}
			} else {
				if (this.optionChecked === optionId) {
					this.optionChecked = ''
				} else {
					this.optionChecked = optionId
				}
			}
		},


		/* 提交答案判断正确 */
		checkChosenCorrect() {
			console.log('开始判断答案是否正确');
			// 没有选择选项
			console.log(this.optionChecked[0]);
			if (!(this.optionChecked[0] || typeof this.optionChecked === "number")) {
				Message.warning("请选择选项")
				return
			}
			// 判断回答是否正确
			const isCorrect = compareArray(this.optionChecked, this.correctOptionId)
			if (isCorrect === "true") {
				// console.log(`第${this.index}题：回答正确(漏)，正确答案是：${this.correctOption}`);
				Message.warning(`第${this.index}题：回答正确(漏)，正确答案是：${this.correctOption}`)
				this.$emit("halfCorrect", this.correctOption)
			} else if (isCorrect) {
				// console.log(`第${this.index}题：回答正确`);
				Message.success(`第${this.index}题：回答正确`)
				this.$emit("correct", this.correctOption)
			} else {
				// console.log(`第${this.index}题：回答错误，正确答案是：${this.correctOption}`);
				Message.error(`第${this.index}题：回答错误，正确答案是：${this.correctOption}`);
				this.optionChecked = [];
				this.$emit("wrong", this.correctOption);
			}
		}
	},

	mounted() {
		this.defaultSetting();
	},

}
</script>

<style scoped>
#question {
	padding: 20px;
	border: 1px solid rgba(0, 0, 0, 0);
	margin-bottom: 50px;
	outline: none;
}

#question:focus {
	border: 1px solid rgba(0, 0, 0, 1);
}

#question .option {
	display: block;
	font-size: 20px;
}

#question .confirm-button {
	display: block;
	margin-top: 10px;
}
</style>
