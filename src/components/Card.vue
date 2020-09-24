<template>
	<v-container class="pa-0">
		<v-row class="ma-0 pa-0">
			<v-col cols="12" class="ma-0 pa-0">
				<v-card class="mx-auto pa-0 ma-0" max-width="275">
					<v-img :src="movie.poster" class="image"></v-img>
					<v-card-actions class="ma-0 px-0 py-2">
						<v-row class="ma-0 pa-0" align="center">
							<v-col cols="9" class="ma-0 px-2 py-0" align="start">
								<v-chip class="mx-1" :color="setColor(genre.name)" label>
									<span
										v-if="
											genre.name == 'Adventure' ||
												genre.name == 'Comedy' ||
												genre.name == 'IMAX'
										"
										class="font16 bold black--text"
									>
										{{ ageRange(genre.name) }}
									</span>
									<span v-else class="font16 bold white--text">
										{{ ageRange(genre.name) }}
									</span>
								</v-chip>
								<span class="font14 bold">
									{{ movie.year }}
								</span>
							</v-col>
							<v-col cols="3" class="ma-0 px-2 py-0" align="end">
								<v-tooltip top>
									<template v-slot:activator="{ on, attrs }">
										<v-btn
											@click="$emit('seeDetails', movie, genre)"
											class="button"
											fab
											small
											dark
											v-on="on"
										>
											<v-icon>expand_more</v-icon>
										</v-btn>
									</template>
									<span>Mais informações</span>
								</v-tooltip>
							</v-col>
						</v-row>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
export default {
	props: ["movie", "genre"],
	data: () => ({
		show: false,
		rating: 0,
	}),
	methods: {
		ageRange(genre) {
			if (genre == "Animation" || genre == "Children") {
				return "L";
			} else if (genre == "Adventure" || genre == "Comedy" || genre == "IMAX") {
				return "12";
			} else {
				return "16";
			}
		},
		setColor(genre) {
			if (genre == "Animation" || genre == "Children") {
				return "#2C9651";
			} else if (genre == "Adventure" || genre == "Comedy" || genre == "IMAX") {
				return "#FFCA28";
			} else {
				return "#EB120D";
			}
		},
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
