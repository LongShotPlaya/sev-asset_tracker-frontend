<script setup>
	import ocLogo from "/oc-logo-white.png";
	import { ref, onMounted, watch } from "vue";
	import Utils from "../config/utils";
	import AuthServices from "../services/authServices";
	import { useRouter } from 'vue-router';
	//import routes from "./router";

	//const route = routes();
	const router = useRouter();
	const user = ref(null);
	const initials = ref("");
	const name = ref("");
	const logoURL = ref("");
	const bannerName = ref("");
	const drawer = ref(false);

	const links = [
		{ bannerName: 'Home', routeName: "tutorials", permission: "any" },
		{ bannerName: 'Seen by everyone', routeName: "add", permission: "any" },
		{ bannerName: 'Seen by admins', routeName: "add", permission: "homeView" },
	];
	const linksAllowed = ref([]);

	const configureMenu = () => {
		// Get the the user's info
		//user.value = null; why is this here??
		user.value = Utils.getStore("user");
		if (user.value) {
			initials.value = user.value.fName[0] + user.value.lName[0];
			name.value = user.value.fName + " " + user.value.lName;
		}

		// Configure the linksAllowed in the menu
		linksAllowed.value = [];
		links.forEach((item) => {
			if (authorize(item.permission))
				linksAllowed.value.push(item);
			//console.log(item);
		});
	};

	const authorize = (permission) => {
		if(permission == "any") return true; 
		if(!user.value) return false;
		switch (permission)
		{
			case "homeView":
				// get the group
				// check to see if the group has a permission enabled (this one could be redundant)
				// if not check the user permissions to see if it's enabled
				// if found, return true
				return false;
			case "allAssetView":
				return false;
			default:
				console.error("[MenuBar] Permission " + '"' + permission + '"' + " does not exist");
				return false;
		}
	};

	const logout = () => {
	AuthServices.logoutUser(user.value)
		.then((response) => {
		console.log(response);
		Utils.removeItem("user");
		router.push({ name: "login" });
		})
		.catch((error) => {
		console.log("error", error);
		});
	};

	onMounted(() => {
	logoURL.value = ocLogo;
	configureMenu();
	//bannerName.value = route.name;
	//console.log(route.name);
	});

	watch(() => router, () => {
		//bannerName.value = route.name;
		//console.log(route.name);
	});

</script>

<template>
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
			<v-list>
				<v-list-item v-for="(item, i) in linksAllowed" :key = "i">
					<v-btn block size="large" variant="text"
					@click = "router.push({name: item.routeName})">
						<v-list-item-title class="font-weight-regular text-h6">
							{{ item.bannerName }}
						</v-list-item-title>
					</v-btn>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
</template>