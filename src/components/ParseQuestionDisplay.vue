<template>


</template>

<script>
import Question from "@/components/Question.vue";

export default {
	name: "ParseQuestionDisplay",
	components: {Question},

	props: {
		questionLibrary: Object,
		mode: {
			type: String,
			default: 'question',
			validator: function (value) {
				return ['question', 'answer'].includes(value)
			}
		}
	},

	data() {
		return {
			optionChecked: '',
		}
	},
}
</script>

<style scoped>

</style>
