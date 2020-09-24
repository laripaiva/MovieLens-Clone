<template>
	<v-container class="pa-0">
		<v-row class="ma-0 pa-0">
			<v-col cols="12" class="ma-0 pa-0">
				<v-card @click="$emit('click')" class="ma-0 pa-0" max-width="300">
					<v-img :src="movie.poster" height="100%" width="100%"></v-img>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
export default {
	props: ["movie"],
	data: () => ({
		show: false,
		rating: 0,
	}),
	methods: {
		standardizeRuntime(minutes) {
			if (minutes > 60) {
				const time_in_hours = Math.floor(minutes / 60);
				const time_in_minutes = minutes % 60;
				return time_in_hours + "h e " + time_in_minutes + "min";
			} else if (minutes > 0) {
				return minutes + "min";
			}
		},
	},
};
</script>
<style scoped>
.button {
	border: 1px solid #c4c4c4;
	box-shadow: none !important;
}
</style>
