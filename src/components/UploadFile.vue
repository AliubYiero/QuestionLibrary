<template>
	<el-upload
			:accept="acceptFormat"
			:before-upload="rejectUpload"
			:drag="isDrag"
			:multiple="acceptFormat === 'text/plain'"
			action=""
			@dragenter.native="dragOpen"
			@dragleave.native="dragClose"
	>
		<el-button>{{ title }}</el-button>
	</el-upload>
</template>

<script>
import md5 from "md5";
import SessionStorage from '@/js/SessionStorage'

export default {
	name: "UploadFile",

	props: {
		title: {
			type: String,
			default: ''
		},
		acceptFormat: {
			type: String,
			default: ''
		}
	},

	data() {
		return {
			isDrag: false,
			questionString: [],
		}
	},

	methods: {
		readFile(file) {
			this.questionString = [file.name.match(/^(.*)\.txt|json$/)[1]]

			// 读取
			const fileReader = new FileReader();
			fileReader.readAsText(file);
			fileReader.onload = () => {

				// 直接返回json数据
				if (file.type === 'application/json') {
					// console.log(fileReader.result);
					const sessionStorage = new SessionStorage
					sessionStorage.set(md5(file), fileReader.result)
					this.$emit('parseQuestion', fileReader.result)
					return;
				}

				/*
				* 处理文本数据
				* 直接读取`fileReader.result`会导致没有换行，通过切割换行符分割到数组中，通过`v-for`循环p标签输出
				* */
				fileReader.result.split('\n').forEach(line => {
					line = line.trim();
					// console.log(line);

					if (line === "") {
						return;
					}
					this.questionString.push(line);
				});
				this.$emit('parseQuestion', this.questionString)
				return;
			}
		},
		/*
		* 拒绝`el-upload`上传
		* */
		rejectUpload(file) {
			// console.log("文件开始处理");
			// console.log(file);
			this.dragClose();

			// console.log(file[0]);
			if (file[0]) {
				file.forEach(file => {
					this.readFile(file)
				})
			} else {
				this.readFile(file)
			}

			/* 返回`false`阻止上传 */
			return false;
		},
		dragOpen() {
			this.isDrag = true
		},
		dragClose() {
			this.isDrag = false
		},

	},
}
</script>

<style scoped>

</style>
