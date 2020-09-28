<template>
	<v-container class="px-0 py-3">
		<v-row class="ma-0 pa-0">
			<v-col cols="12" class="search">
				<v-text-field
					v-model="title"
					label="Search a movie"
					filled
					dark
					clearable
					prepend-inner-icon="search"
				></v-text-field>
			</v-col>
			<v-col cols="12" v-if="title != null" class="ma-0 pa-0">
				<ApolloQuery
					:query="require('@/graphql/movies/GetMovies.gql')"
					:variables="{ title: title }"
				>
					<template v-slot="{ result: { loading, error, data } }">
						<div v-if="data">
							<v-row class="ma-0 pa-0">
								<v-col cols="12" class="ma-0 pa-0">
									<span class="header font28 white--text bold">
										Searchered movies
									</span>
								</v-col>
								<v-col
									cols="12"
									sm="4"
									md="3"
									class="pa-0"
									style="margin: 10px 0px 10px 0px !important;"
									v-for="movie in data.movies"
									:key="movie.id"
								>
									<movie-card
										@seeDetails="seeDetails"
										:movie="movie"
										:genre="movie.genre[0]"
									></movie-card>
								</v-col>
							</v-row>
						</div>
					</template>
				</ApolloQuery>
			</v-col>
			<v-col cols="12" v-if="title == null && userId != null" class="ma-0 pa-0">
				<ApolloQuery
					:query="require('@/graphql/user/GetUserRecommendedMovies.gql')"
					:variables="{ userId: userId }"
				>
					<template v-slot="{ result: { loading, error, data } }">
						<div v-if="data && data.user[0].recommendedMovies.length > 0">
							<v-row class="mx-0 mt-0 mb-10 pa-0">
								<v-col cols="12" class="mx-0 mt-0 mb-2 pa-0">
									<span
										class="header font28 white--text bold"
										style="margin: 0px 0px 0px 10px;"
									>
										Recommended Movies
									</span>
								</v-col>
								<v-col cols="12" class="ma-0 pa-0">
									<v-sheet
										class="mx-auto ma-0 pa-0"
										color="#0d0d0d"
										dark
										@click="more()"
									>
										<v-slide-group>
											<v-slide-item
												v-for="movie in data.user[0].recommendedMovies"
												:key="movie.id"
												v-slot:default="{ active, toggle }"
											>
												<movie-card
													@seeDetails="seeDetails"
													class="mx-3"
													:movie="movie"
													:genre="movie.genre[0].name"
												></movie-card>
											</v-slide-item>
										</v-slide-group>
									</v-sheet>
								</v-col>
							</v-row>
						</div>
					</template>
				</ApolloQuery>
			</v-col>
			<v-col cols="12" v-if="title == null" class="ma-0 pa-0">
				<ApolloQuery :query="require('@/graphql/movies/GetMoviesByGenre.gql')">
					<template v-slot="{ result: { loading, error, data } }">
						<div v-if="data">
							<v-row
								v-for="genre in data.genres"
								:key="genre.id"
								class="mx-0 mt-0 mb-10 pa-0"
							>
								<v-col cols="12" class="mx-0 mt-0 mb-2 pa-0">
									<span
										class="header font28 white--text bold"
										style="margin: 0px 0px 0px 10px;"
									>
										{{ genre.name }}
									</span>
								</v-col>
								<v-col cols="12" class="ma-0 pa-0">
									<v-sheet class="mx-auto ma-0 pa-0" color="#0d0d0d" dark>
										<v-slide-group>
											<v-slide-item
												v-for="(movie, count) in genre.movies"
												:key="movie.id"
												v-show="(n = count)"
											>
												<movie-card
													@seeDetails="seeDetails"
													class="mx-3"
													:movie="movie"
													:genre="genre"
												></movie-card>
											</v-slide-item>
										</v-slide-group>
									</v-sheet>
								</v-col>
							</v-row>
						</div>
					</template>
				</ApolloQuery>
			</v-col>
			<v-col cols="12" class="ma-0 pa-0">
				<v-dialog v-model="dialog" max-width="720" :key="selected_movie.id">
					<movie-dialog
						v-if="dialog"
						@seeDetails="seeDetails"
						@close="dialog = false"
						:movie="selected_movie"
						:age-range="ageRange()"
					>
					</movie-dialog>
				</v-dialog>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import MovieDialog from "@/components/Dialog";
import MovieCard from "@/components/Card";
export default {
	data: () => ({
		dialog: false,
		n: 0,
		title: null,
		userId: null,
		selected_genre: {},
		selected_movie: {},
	}),
	components: {
		MovieDialog,
		MovieCard,
	},
	watch: {
		n() {
			console.log(this.n);
		},
		title() {
			if (this.title == "") {
				this.title = null;
			}
		},
	},
	methods: {
		ageRange() {
			if (
				this.selected_genre == "Animation" ||
				this.selected_genre == "Children"
			) {
				return "L";
			} else if (
				this.selected_genre == "Adventure" ||
				this.selected_genre == "Comedy" ||
				this.selected_genre == "IMAX"
			) {
				return "12";
			} else {
				return "16";
			}
		},
		seeDetails(movie, genre) {
			this.dialog = false;
			this.selected_genre = genre.name;
			this.selected_movie = movie;

			setTimeout((this.dialog = true), 1000);
		},
		more() {
			console.log("more");
		},
		isObjectEmpty(obj) {
			return Object.entries(obj).length === 0 && obj.constructor === Object;
		},
	},
	mounted() {
		this.userId = localStorage.getItem("apollo-token");
	},
};
</script>
<style scoped>
@media screen and (min-width: 320px) {
	.header {
		margin: 0px 10px 0px 10px !important;
	}
	.search {
		padding: 25px 10px 10px 10px !important;
	}
}
@media screen and (min-width: 1264px) {
	.header {
		margin: 0px 60px 0px 60px !important;
	}
}
</style>
