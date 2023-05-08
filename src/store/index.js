import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		// 题库读取配置
		questionReadConfig: {
			titleSplit: 'firstLine',	// 大标题题注（ fileName | firstLine | none ）
			chapterSplit: '',			// 章节题注（单选/多选/判断）
			questionSplit: '',			// 问题题注
			answerOptionSplit: [		// 答案选项题注
				'A',
				'B',
				'C',
				'D',
				'E',
				'F',
				'G',
			],
			correctAnswerSplit: '',		// 正确答案选项题注（ none | question | option | after ）
			judgeAnswerSplit: '',		// 判断答案选项
		},
	},
	getters: {},
	mutations: {},
	actions: {},
	modules: {}
})
