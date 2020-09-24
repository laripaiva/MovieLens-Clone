<template>
	<v-container class="px-0 py-3">
		<v-row class="ma-0 pa-0">
			<v-col cols="12" class="ma-0 pa-0">
				<v-text-field v-model="title" label="Search" filled dark></v-text-field>
			</v-col>
			<v-col cols="12" v-if="title != null" class="ma-0 pa-0">
				<ApolloQuery
					:query="require('@/graphql/movies/GetMovies.gql')"
					:variables="{ title: title }"
				>
					<template v-slot="{ result: { loading, error, data } }">
						<div v-if="data">
							<v-row class="ma-0 pa-0">
								<v-col cols="12" class="mx-0 mt-0 mb-2 pa-0">
									<span class="font28 white--text bold">
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
						+
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
								class="mx-0 my-10 pa-0"
							>
								<v-col cols="12" class="mx-0 mt-0 mb-2 pa-0">
									<span
										class="font28 white--text bold"
										style="margin: 0px 0px 0px 10px;"
									>
										{{ genre.name }}
									</span>
								</v-col>
								<v-col cols="12" class="ma-0 pa-0">
									<v-sheet class="mx-auto ma-0 pa-0" color="#0d0d0d" dark>
										<v-slide-group>
											<v-slide-item
												v-for="movie in genre.movies"
												:key="movie.id"
												v-slot:default="{ active, toggle }"
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
		title: null,
		toke: null,
		selected_genre: {},
		selected_movie: {},
	}),
	components: {
		MovieDialog,
		MovieCard,
	},
	watch: {
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
		isObjectEmpty(obj) {
			return Object.entries(obj).length === 0 && obj.constructor === Object;
		},
	},
	mounted() {
		this.token = localStorage.getItem("apollo-token");
	},
};
</script>
