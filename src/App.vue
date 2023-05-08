<template>
	<div id="app">
		<el-container>
			<el-header>
				<Nav/>
			</el-header>

			<router-view/>

		</el-container>
	</div>
</template>

<script>
import Nav from '@/components/Nav'

export default {
	name: 'app',
	components: {
		Nav
	}
}
</script>

<style>

</style>
