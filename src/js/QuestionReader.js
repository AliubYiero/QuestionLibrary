/*
* 字符串转hash
* */
String.prototype.hashCode = function () {
	let hash = 0, i, chr;
	if (this.length === 0) return hash;
	for (i = 0; i < this.length; i++) {
		chr = this.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

/*
* 配置分隔符
* */
const splitDefault = function (splitString) {
	/*
	* cjk-decimal | trad-chinese-informal	中文数字
	* decimal		阿拉伯数字
	* lower-roman	小写罗马数字（未做匹配）
	* upper-roman	大写罗马数字（未做匹配）
	* lower-alpha	小写英文字母
	* upper-alpha	大写英文字母
	* */
	const cjkDecimal = /^[一二两三四五六七八九十百千万]+/
	const decimal = /^[0-9①-⑨]+/
	const lowerAlpha = /\s?[a-z]/
	const upperAlpha = /\s?[A-Z]/

	switch (splitString) {
		// 中文数字
		case 'cjk-decimal':
		case 'trad-chinese-informal': {
			return cjkDecimal;
		}

		// 阿拉伯数字
		case 'decimal': {
			return decimal;
		}

		// 小写字母
		case 'lowerAlpha':
		case 'lower-alpha': {
			return lowerAlpha;
		}

		// 大写字母
		case 'upperAlpha':
		case 'upper-alpha': {
			return upperAlpha;
		}
	}
}

let questionIdManager = (function () {
	let questionIdMap = new Map();
	return function (questionId) {
		questionIdMap.set(questionId, true)
	}
})()


export default class QuestionReader {
	constructor(lineList, questionReadConfig) {
		// 问题配置 | 题库文件中题库名、问题类型、问题、选项的分别都是按什么排列的编号
		this.questionReadConfig = {
			titleSplit: 'fileName',				// 大标题题注（ fileName | firstLine | none ）
			chapterSplit: 'cjk-decimal',		// 章节题注（单选/多选/判断）
			questionSplit: 'decimal',			// 问题题注
			answerOptionSplit: 'upper-alpha',	// 答案选项题注
			correctAnswerSplit: 'after',		// 正确答案选项题注（ none | question | option | after ）
			judgeAnswerSplit: [['正确', '√', '对'], ['错误', '×', 'X', 'x', '错']],				// 判断答案选项
		} || questionReadConfig;
		this.questionSplit = /^[,，.．、：:]/
		this.optionsSplit = /^[,，.．、：:]/

		this.lineList = lineList;
		this.parseQuestionString = {
			title: '',
			questions: new Map(),
		};

		this.isFirstLine = true;
		this.isQuestion = false;
		this.isJudgeQuestion = false;

		this.chapterStatus = '';
		this.question = {};
	}


	parseTitle(line) {
		this.isFirstLine = false;

		switch (this.questionReadConfig.titleSplit) {
			case "firstLine": {
				this.isFirstLine = true;
				this.questionReadConfig.titleSplit = "fileName"
				break;
			}

			case "fileName": {
				this.parseQuestionString.title = line;
				break;
			}

			case "none":
			default: {
				this.parseChapter(line);
			}
		}

	}


	parseChapter(line) {
		let chapterStatus = line.split(/[、，.]/)[1];
		if (chapterStatus.match('单选')) {
			this.chapterStatus = '单选题';
		} else if (chapterStatus.match('多选')) {
			this.chapterStatus = '多选题'
		} else if (chapterStatus.match('判断')) {
			this.chapterStatus = '判断题'
		} else {
			this.chapterStatus = ''
		}
		console.log(this.chapterStatus);
	}

	parseQuestion(line) {
		if (this.isQuestion) {
			this.question.question.push(line)
			return;
		}

		// 去除题目编号，获取问题文本
		let newLine = line.split(this.questionReadConfig.questionSplit)[1].trim()
		// 去除题目编号分隔符，获取问题文本
		if (newLine.match(this.questionSplit)) {
			newLine = newLine.split(this.questionSplit)[1]
		}
		// 格式化题目填空括号
		newLine = newLine.replace(/[\(（]\s*[）\)]/, "（\u3000）");

		let questionId = newLine.hashCode();
		this.question = {
			id: questionId,
			status: this.chapterStatus,
			question: [newLine],
			options: [],
			correct_counter: 0,
			error_counter: 0,
		}

		console.log(`[${questionId}] ${newLine}`);
	}

	parseOptions(line) {
		// 去除选项编号，获取选项文本
		let newLineSplitList = line.split(this.questionReadConfig.answerOptionSplit)

		// 获取答案
		if (newLineSplitList[1] === "" || newLineSplitList[0].match('答案')) {	// 答案判断
			this.parseCorrectAnswer(line)
			return
		}

		// 获取选项文本（含一行多选项）
		for (let i = 1; i < newLineSplitList.length; i++) {
			let newLine = newLineSplitList[i]

			// 去除选项编号分隔符，获取选项文本
			if (newLine.match(this.optionsSplit)) {
				newLine = newLine.split(this.optionsSplit)[1].trim()
			}

			// 写入选项
			this.question.options.push([newLine, 0]);

			console.log(newLine);
		}
	}

	parseCorrectAnswer(line) {
		const options = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
		if (this.chapterStatus.match('判断')) {
			return;
		}

		let newLine = line
		const correctOptions = newLine.split('')

		correctOptions.forEach(correctOption => {
			correctOption = options.indexOf(correctOption)
			this.question.options[correctOption][1] = 1
		})
	}

	parseJudgeAnswer(line) {
		let newLine = line

		// 写入判断选项
		this.question.options.push(['√', 0]);
		this.question.options.push(['X', 0]);

		// 判断正确答案
		if (this.questionReadConfig.judgeAnswerSplit[0].includes(newLine)) {
			this.question.options[0][1] = 1
		} else {
			this.question.options[1][1] = 1
		}
	}

	parse() {
		// 解析配置
		this.questionReadConfig.chapterSplit = splitDefault(this.questionReadConfig.chapterSplit);
		this.questionReadConfig.questionSplit = splitDefault(this.questionReadConfig.questionSplit);
		this.questionReadConfig.answerOptionSplit = splitDefault(this.questionReadConfig.answerOptionSplit);


		// 逐行解析文件
		this.lineList.forEach(line => {
			// console.log(line);

			if (this.isFirstLine) {
				this.parseTitle(line);
				return;
			}

			// 判断当前题目类型
			if (line.match(this.questionReadConfig.chapterSplit)) {
				this.parseChapter(line);
				return;
			}

			// 判断`单选/多选`选项
			if (line.match(this.questionReadConfig.answerOptionSplit)) {
				this.parseOptions(line);
				this.isQuestion = false;
				this.parseQuestionString.questions.set(this.question.id, this.question)
				return;
			}

			// 判断`判断题`选项
			if (this.isJudgeQuestion) {
				this.parseJudgeAnswer(line);
				this.isJudgeQuestion = false;
				this.isQuestion = false;
				this.parseQuestionString.questions.set(this.question.id, this.question)
				return;
			}

			// 判断题目
			if (this.isQuestion || line.match(this.questionReadConfig.questionSplit)) {
				if (this.chapterStatus.match('判断')) {
					this.isJudgeQuestion = true;
				}
				this.parseQuestion(line);
				this.isQuestion = true;
				return;
			}
		})

		// 将Map对象转Object，再进行Json字符串序列化
		this.parseQuestionString.questions = Array.from(this.parseQuestionString.questions.values())
		return JSON.stringify(this.parseQuestionString);
	}

}
