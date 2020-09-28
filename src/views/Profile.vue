<template>
	<v-container class="px-0 py-3">
		<v-row class="ma-0 pa-0">
			<v-col cols="12" class="ma-0 px-5 py-0" align="center" justify="center">
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
							<span v-if="repeated_name" class="red--text">
								This name already exists!
							</span>
						</ValidationProvider>
					</v-card-text>
					<v-card-actions class="mt-2 justify-center">
						<v-row class="ma-0 pa-0">
							<v-col cols="6" class="ma-0 pa-0">
								<v-btn @click.native="deleteUser()" color="red" dark>
									delete
								</v-btn>
							</v-col>
							<v-col cols="6" class="ma-0 pa-0">
								<v-btn @click.native="updateName()" color="primary" dark>
									edit
								</v-btn>
							</v-col>
						</v-row>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import { onLogout } from "@/vue-apollo";
export default {
	data: () => ({
		userId: undefined,
		name: undefined,
		repeated_name: false,
	}),
	watch: {
		name() {
			if (this.name == null || this.name == "") {
				this.repeated_name = false;
			}
		},
	},
	methods: {
		async setName() {
			const user = await this.$apollo.query({
				query: require("@/graphql/user/GetUser.gql"),
				variables: {
					userId: this.userId,
				},
			});
			this.name = user.data.User[0].name;
		},
		async updateName(mutate) {
			this.repeated_name = false;
			const users = await this.$apollo.query({
				query: require("@/graphql/user/GetUser.gql"),
				variables: {
					name: this.name,
				},
			});

			if (users.data.User.length > 0) {
				this.repeated_name = true;
			} else {
				const edit = await this.$apollo.mutate({
					mutation: require("@/graphql/user/UpdateUser.gql"),
					variables: {
						userId: this.userId,
						name: this.name,
					},
				});
				location.reload();
			}
		},
		async deleteUser() {
			const delete_user = await this.$apollo.mutate({
				mutation: require("@/graphql/user/DeleteUser.gql"),
				variables: {
					userId: this.userId,
				},
			});
			onLogout(this.$apollo.provider.defaultClient);
			location.reload();
			this.$router.push("/login");
		},
	},
	mounted() {
		this.userId = localStorage.getItem("apollo-token");
		if (this.userId == null) {
			this.$router.push("/");
		}
		this.setName();
	},
};
</script>
