<template>
	<v-container class="ma-0 pa-0">
		<v-row class="ma-0 pa-0">
			<v-col cols="12" class="ma-0 pa-0">
				<v-card class="ma-0 pa-0" color="#181818" dark>
					<v-row class="ma-0 pa-0">
						<v-col cols="12" class="ma-0 pa-0 close-button" align="end">
							<v-btn @click="$emit('close')" icon large dark>
								<v-icon> close</v-icon>
							</v-btn>
						</v-col>
					</v-row>
					<v-row class="first-section">
						<v-col cols="12" sm="6" md="5" class="ma-0 pa-0">
							<v-img
								class="poster"
								:src="movie.poster"
								height="350px"
								width="250px"
							></v-img>
						</v-col>
						<v-col cols="12" sm="6" md="7" class="ma-0 pa-0">
							<v-row class="ma-0 pa-0" align="center">
								<v-col cols="12" class="mx-0 my-5 pa-0">
									<span class="font16 mr-2">
										{{ standardizeRuntime(movie.runtime) }}
									</span>
									<v-chip :color="setColor()" label>
										<span
											v-if="ageRange == '12'"
											class="font16 bold black--text"
										>
											{{ ageRange }}
										</span>
										<span v-else class="font16 bold white--text">
											{{ ageRange }}
										</span>
									</v-chip>
									<span class="font16 ml-2">{{ movie.year }}</span>
								</v-col>
								<v-col cols="12" class="ma-0 pa-0">
									<span class="font16">{{ movie.plot }}</span>
								</v-col>
								<v-col cols="12" v-if="userId != null" class="mx-0 my-5 pa-0">
									<v-rating
										v-model="rating"
										background-color="#777"
										color="yellow accent-4"
										dense
										half-increments
										hover
										size="18"
									></v-rating>
								</v-col>
							</v-row>
						</v-col>
					</v-row>
					<v-row class="second-section">
						<span
							class="font28 white--text bold"
							style="margin:20px 0px 20px 10px;"
						>
							Similar Movies
						</span>
						<v-col cols="12" class="ma-0 pa-0">
							<ApolloQuery
								:query="require('@/graphql/movies/GetSimilarMovies.gql')"
								:variables="{ movieTitle }"
							>
								<template v-slot="{ result: { loading, error, data } }">
									<v-row v-if="data" class="ma-0 pa-0">
										<v-col
											cols="12"
											sm="4"
											v-for="similarMovie in data.movie[0].similarMovies"
											class="ma-0 px-auto pt-0 pb-5"
											align="center"
										>
											<small-movie-card
												@click="seeDetails(similarMovie)"
												:movie="similarMovie"
											>
											</small-movie-card>
										</v-col>
									</v-row>
								</template>
							</ApolloQuery>
						</v-col>
					</v-row>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import SmallMovieCard from "@/components/SmallCard";
export default {
	props: ["movie", "ageRange"],
	data: () => ({
		movieTitle: undefined,
		rating: undefined,
		movieId: null,
		userId: null,
	}),
	watch: {
		rating(newValue, oldValue) {
			if (oldValue == 0) {
				this.addRating();
			} else if (oldValue > 0) {
				this.updateRating();
			}
		},
	},
	components: {
		SmallMovieCard,
	},
	methods: {
		seeDetails(movie) {
			this.$emit("seeDetails", movie, movie.genre[0]);
		},
		async addRating() {
			const timestamp = Math.floor(Math.random() * 256);
			const rated = await this.$apollo.mutate({
				mutation: require("@/graphql/user/AddUserRating.gql"),
				variables: {
					movieId: this.movieId,
					userId: this.userId,
					rating: this.rating,
					timestamp: timestamp,
				},
			});
		},
		async updateRating() {
			const timestamp = Math.floor(Math.random() * 256);
			const rated = await this.$apollo.mutate({
				mutation: require("@/graphql/user/UpdateUserRating.gql"),
				variables: {
					movieId: this.movieId,
					userId: this.userId,
					rating: this.rating,
					timestamp: timestamp,
				},
			});
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
		setColor() {
			if (this.ageRange == "16") {
				return "#EB120D";
			} else if (this.ageRange == "12") {
				return "#FFCA28";
			} else if (this.ageRange == "L") {
				return "#2C9651";
			}
		},
		async setRating() {
			const rated = await this.$apollo.query({
				query: require("@/graphql/user/GetUserRatingOnMovie.gql"),
				variables: {
					movieId: this.movieId,
					userId: this.userId,
				},
			});

			if (rated.data.user[0].rated.length > 0) {
				this.rating = rated.data.user[0].rated[0].rating;
			} else {
				this.rating = 0;
			}
		},
	},
	mounted() {
		this.movieTitle = this.movie.title;
		this.movieId = this.movie.id;
		this.userId = localStorage.getItem("apollo-token");
		if (this.userId != null) {
			this.setRating();
		}
	},
};
</script>
<style scoped>
@media screen and (min-width: 320px) {
	.close-button {
		position: relative;
		right: 0;
		padding: 5px !important;
	}
	.first-section {
		padding: 5px 20px 10px 20px !important;
		margin: 0px !important;
	}
	.second-section {
		padding: 10px !important;
		margin: 0px !important;
	}
}
@media screen and (min-width: 600px) {
	.close-button {
		position: absolute !important;
		right: 0;
		margin: 5px !important;
	}
	.first-section {
		padding: 20px !important;
		margin: 0px !important;
	}
}
</style>
