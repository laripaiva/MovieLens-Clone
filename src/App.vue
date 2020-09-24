<template>
	<v-app>
		<v-main>
			<Toolbar></Toolbar>
			<v-container fluid class="body pa-0">
				<router-view></router-view>
			</v-container>
		</v-main>
	</v-app>
</template>

<script>
import Toolbar from "./components/Toolbar";

export default {
	name: "App",
	components: {
		Toolbar,
	},
};
</script>
