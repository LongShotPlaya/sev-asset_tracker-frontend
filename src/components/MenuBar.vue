<script setup>
	import ocLogo from "/oc-logo-white.png";
	import { ref, onMounted, watch } from "vue";
	import Utils from "../config/utils";
	import AuthServices from "../services/authServices";

	const user = ref(null);
	const initials = ref("");
	const name = ref("");
	const logoURL = ref("");
	const bannerName = ref("");
	const drawer = ref(false);

	const links =[
		{ bannerName: 'Home', routeName: "home", permission: "any" },
		{ bannerName: 'Seen by everyone', routeName: "", permission: "any" },
		{ bannerName: 'Seen by admins', routeName: "", permission: "test2" },

	];
	const items = ref([]);

	const configureMenu = () => {
	// Get the the user's info
	//user.value = null; 
	user.value = Utils.getStore("user");
	if (user.value) {
		initials.value = user.value.fName[0] + user.value.lName[0];
		name.value = user.value.fName + " " + user.value.lName;
	}

	// Configure the items in the menu
	items.value = [];
	links.forEach((item) => {
		/*if (authorize(item.authLevel))*/ items.value.push(item);
	});

	};

	const logout = () => {
	AuthServices.logoutUser(user.value)
		.then((response) => {
		console.log(response);
		Utils.removeItem("user");
		$router.push({ name: "login" });
		})
		.catch((error) => {
		console.log("error", error);
		});
	};

	onMounted(() => {
	logoURL.value = ocLogo;
	configureMenu();
	//bannerName.value = $route.name;
	});

	//watch(() => $route, () => {
	//bannerName.value = $route.name;
	//});

</script>

<template>
	<!--<v-layout>-->
		<!-- App bar things -->
		<v-app-bar app :elevation="1">
		<v-app-bar-nav-icon @click.stop = "drawer = !drawer"></v-app-bar-nav-icon>
		<v-spacer></v-spacer>
		<v-app-bar-title>{{ bannerName }}</v-app-bar-title>
		
		<!-- Mini profile popup -->
		<v-menu bottom min-width="200px" rounded offset-y v-if="user">
			<template v-slot:activator="{ props }">
			<v-btn v-bind="props" icon x-large>
				<v-avatar v-if="user" color="secondary">
				<span class="accent--text font-weight-bold">{{ initials }}</span>
				</v-avatar>
			</v-btn>
			</template>
			<v-card>
			<v-card-text>
				<div class="mx-auto text-center">
				<v-avatar color="secondary" class="mt-2 mb-2">
					<span class="accent--text font-weight-bold">{{
					initials
					}}</span>
				</v-avatar>
				<h3>{{ name }}</h3>
				<p class="text-caption mt-1">
					{{ user.email }}
				</p>
				<v-divider class="my-3"></v-divider>
				<v-btn depressed rounded text @click="logout"> Logout </v-btn>
				</div>
			</v-card-text>
			</v-card>
		</v-menu>
		</v-app-bar>
				<v-navigation-drawer v-model="drawer" temporary>
				<!--<v-list density = "compact" nav>
					<v-list-item title = "Test" value="test"></v-list-item>
					<v-list-item title = "Home" value="home"></v-list-item>
					<v-list-item title = "About" value="about"></v-list-item>
				</v-list>-->
				<v-list>
					<v-list-item v-for="(item, i) in items" :key = "i">
					<v-list-item-title @click="router.push({name: item.routeName})">{{ item.bannerName }}</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-navigation-drawer>
</template>