import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import { createProvider } from "./vue-apollo";
import vuetify from "./plugins/vuetify";
import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import { ValidationProvider } from "vee-validate";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "@/css/main.css";

Vue.component("ValidationProvider", ValidationProvider);
Vue.config.productionTip = false;

//Vee Validate
extend("required", {
	...required,
	message: "This field is required",
});

new Vue({
	apolloProvider: createProvider(),
	router,
	vuetify,
	render: (h) => h(App),
}).$mount("#app");
