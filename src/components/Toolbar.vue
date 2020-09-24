<template>
	<v-container fluid class="pa-0">
		<v-row class="ma-0 pa-0">
			<v-col cols="12" class="ma-0 pa-0">
				<v-card flat tile>
					<v-toolbar color="#1D1D1D" dark>
						<v-toolbar-title @click="$router.push('/')">
							Movieleens
						</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-btn v-if="token != null" to="/profile" @click="logout()" text>
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<v-icon dark v-on="on">person</v-icon>
								</template>
								<span>Profile</span>
							</v-tooltip>
						</v-btn>
						<v-btn v-if="token == null" to="/login" text>
							Login
						</v-btn>
						<v-btn v-else @click="logout()" text>
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<v-icon dark v-on="on">exit_to_app</v-icon>
								</template>
								<span>Logout</span>
							</v-tooltip>
						</v-btn>
					</v-toolbar>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
import { onLogout } from "@/vue-apollo";
export default {
	data: () => ({
		token: null,
	}),
	watch: {
		$route() {
			this.token = localStorage.getItem("apollo-token");
		},
		token() {
			if ((this.token = "")) {
				this.token = null;
			}
		},
	},
	methods: {
		logout() {
			onLogout(this.$apollo.provider.defaultClient);
			location.reload();
		},
	},
	mounted() {
		this.token = localStorage.getItem("apollo-token");
	},
};
</script>
