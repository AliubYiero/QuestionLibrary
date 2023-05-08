<template>
	<div>
		<!--
		* el-menu的使用
		-->
		<el-menu
				:default-active="activeIndex"
				mode="horizontal"
				router
		>
			<el-menu-item index="/">答题</el-menu-item>
			<el-menu-item index="/question">题库</el-menu-item>
			<el-menu-item v-show="false" index="/person">个人中心</el-menu-item>
		</el-menu>
	</div>
</template>

<script>
export default {
	name: "MyNav",

	data() {
		return {
			activeIndex: "/answer"
		}
	},
	methods: {},
	mounted() {

	},
}
</script>

<style scoped>

</style>
