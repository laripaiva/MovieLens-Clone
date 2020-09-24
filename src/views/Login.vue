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
							<span v-if="error" class="red--text"></span>
						</ValidationProvider>
					</v-card-text>
					<v-card-text class="ma-0 pa-0">
						<span class="font12" style="color:#777">
							Don't have an account?
						</span>
						<span
							@click="$router.push('/register')"
							class="font12 bold mx-1"
							style="color:#fff"
						>
							Sign up.
						</span>
					</v-card-text>
					<v-card-actions class="mt-2 justify-center">
						<v-btn @click.native="login()" color="green darken-3" dark>
							Login
						</v-btn>
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
		error: false,
		loading_error: false,
	}),
	watch: {
		error() {
			this.error = false;
		},
	},
	methods: {
		async login() {
			this.loading_error = true;
			this.error = false;
			const user = await this.$apollo.query({
				query: require("@/graphql/user/GetUser.gql"),
				variables: {
					name: this.name,
				},
			});
			if (user.data.User.length > 0) {
				this.saveToken(user);
			} else {
				this.error = true;
			}

			this.loading_error = false;
		},
		saveToken(result) {
			const token = result.data.User[0].id;
			onLogin(this.$apollo.provider.defaultClient, token);
			this.$router.replace("/");
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
