import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

import Index from "@/views/Main";
import Login from "@/views/Login";
import Register from "@/views/Register";

export default new Router({
	mode: "history",
	routes: [
		{
			path: "/",
			component: Index,
			meta: { forVisitors: true },
		},
		{
			path: "/login",
			component: Login,
			meta: { forVisitors: true },
		},
		{
			path: "/register",
			component: Register,
			meta: { forVisitors: true },
		},
		{
			path: "*",
			redirect: "/",
		},
	],
});
