<template>
	<v-container class="px-0 py-3">
		<v-row class="ma-0 pa-0">
			<v-col cols="12" class="ma-0 px-5 py-0">
				<v-card class="ma-0 pa-5" color="#181818" max-width="400">
					<v-card-text class="ma-0 pa-0">
						<ValidationProvider
							name="email"
							rules="required"
							v-slot="{ errors }"
						>
							<v-text-field
								v-model="name"
								label="Name"
								filled
								dark
							></v-text-field>

							<span class="red--text">{{ errors[0] }}</span>
							<span v-if="repeated_name && !loading_error" class="red--text">
								This name already exists!
							</span>
						</ValidationProvider>
					</v-card-text>

					<v-card-actions class="mt-2 justify-center">
						<ApolloMutation
							:mutation="require('@/graphql/user/CreateUser.gql')"
							:variables="{
								name,
							}"
							@done="saveToken"
						>
							<template v-slot="{ mutate, loading, error }">
								<v-btn
									@click.native="create(mutate)"
									color="green darken-3"
									dark
								>
									Create
								</v-btn>
								<p v-if="error">An error has occurred!</p>
							</template>
						</ApolloMutation>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import { onLogin } from "@/vue-apollo";
export default {
	data: () => ({
		name: undefined,
		repeated_name: false,
		loading_error: false,
	}),
	watch: {
		repeated_name() {
			this.repeated_name = false;
		},
	},
	methods: {
		async create(mutate) {
			this.loading_error = true;
			const users = await this.$apollo.query({
				query: require("@/graphql/user/GetUser.gql"),
				variables: {
					name: this.name,
				},
			});

			if (users.data.User.length > 0) {
				this.repeated_name = true;
			} else {
				const create = mutate();
			}

			this.loading_error = false;
		},
		saveToken(result) {
			const token = result.data.CreateUser.id;
			onLogin(this.$apollo.provider.defaultClient, token);
			location.reload();
			this.$router.push("/");
		},
	},
	mounted() {
		const token = localStorage.getItem("apollo-token");
		if (token != null) {
			this.$router.push("/");
		}
	},
};
</script>
