<script setup>
	import ocLogo from "/oc-logo-white.png";
	import { ref, onMounted} from "vue";
	import Utils from "../config/utils";
	import AuthServices from "../services/authServices";
	import { useRouter } from 'vue-router';

	const router = useRouter();
	const user = ref(null);
	const initials = ref("");
	const name = ref("");
	const logoURL = ref("");
	const bannerName = ref("Testing");
	const drawer = ref(false);
	let alertNum = ref(50);
	let alertActive = ref();

	const checkouts = [
		{ bannerName: 'Checkout Asset', routeName: "home", permission: "any" },
		{ bannerName: 'View Checkouts', routeName: "home", permission: "any" },
	];
	const assetOrg = [
		{ bannerName: 'Asset Categories', routeName: "asset-categories", permission: "any" },
		{ bannerName: 'Asset Types', routeName: "asset-type", permission: "any" },
		{ bannerName: 'Asset Templates', routeName: "asset-templates", permission: "any" },
		{ bannerName: 'Facilities', routeName: "buildings", permission: "any" },
		{ bannerName: 'Custom Dropdowns', routeName: "home", permission: "any" },
	];	const management = [
		{ bannerName: 'All Assets', routeName: "assets", permission: "any" },
		{ bannerName: 'Groups', routeName: "groups", permission: "any" },
		{ bannerName: 'People', routeName: "people", permission: "any" },
		{ bannerName: 'Vendors', routeName: "vendors", permission: "any" },
		{ bannerName: 'Alerts', routeName: "alert-types", permission: "any" },
	];

	const checkoutsAllowed = ref([]);
	const assetOrgAllowed = ref([]);
	const managementAllowed = ref([]);

	const configureMenu = () => {
		// Get the the user's info
		//user.value = null; why is this here??
		user.value = Utils.getStore("user");
		if (user.value) {
			initials.value = user.value.fName[0] + user.value.lName[0];
			name.value = user.value.fName + " " + user.value.lName;
		}

		// Configure viewable links in the menu
		checkoutsAllowed.value = [];
		checkouts.forEach((item) => {
			if (authorize(item.permission))
				checkoutsAllowed.value.push(item);
			//console.log(item);
		});
		assetOrgAllowed.value = [];
		assetOrg.forEach((item) => {
			if (authorize(item.permission))
				assetOrgAllowed.value.push(item);
			//console.log(item);
		});
		managementAllowed.value = [];
		management.forEach((item) => {
			if (authorize(item.permission))
				managementAllowed.value.push(item);
			//console.log(item);
		});
	};

	const configureAlerts = () => {
		if (alertNum.value == null || alertNum.value <= 0)
			alertActive = false;
		else
			alertActive = true;
	}

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

	const changeBanner = (route) => {
		if (route == "/")
			bannerName.value = "Login";
		else if (route.includes("/home"))
			bannerName.value = "Home";
		else if (route.includes("/people"))
			bannerName.value = "Find People";
		else if (route.includes("/buildings"))
			bannerName.value = "Facilities";
		else if (route.includes("/asset-categories"))
			bannerName.value = "Asset Categories";
		else if (route.includes("/asset-type"))
			bannerName.value = "Asset Type";
		else if (route.includes("/assets"))
			bannerName.value = "Assets";
		else if (route.includes("/groups"))
			bannerName.value = "Groups";
		else if (route.includes("/vendors"))
			bannerName.value = "Vendors";
		else if (route.includes("/alert-types"))
			bannerName.value = "Alert Types";
		else if (route.includes("/asset-templates"))
			bannerName.value = "Asset Templates";
		else
			bannerName.value = "[Temporary] Update Menubar input= " + route;
	}

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
		configureAlerts();
		changeBanner(window.location.pathname);
		//console.log(route.name);
	});

</script>

<template>
	<!-- App bar things -->
	<v-app-bar app color="primary" :elevation="4">
	<v-app-bar-nav-icon @click.stop = "drawer = !drawer"></v-app-bar-nav-icon>
	<v-app-bar-title class="text-center">{{ bannerName }}</v-app-bar-title>
	<div class="mr-2">
		<v-btn :ripple="false" icon="" @click="router.push({name: ''})">
			<v-icon v-show=!alertActive icon="mdi-bell"></v-icon>
			<v-badge v-show=alertActive color="grey-darken-3" :content="alertNum">
				<v-icon icon="mdi-bell"></v-icon>
			</v-badge>
		</v-btn>
		<v-tooltip activator="parent" location="bottom">Alerts and Notifications</v-tooltip>
	</div>

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
	<v-navigation-drawer color="grey-darken-3" v-model="drawer" :elevation="6" temporary>
		<v-row>
		<v-list class="mt-1">
			<v-btn text color="grey-lighten-4" block class="font-weight-regular text-h6 rounded-0"
			size="large" variant="text" @click = "router.push({name: 'home'})">
			<div class="mr-16 pr-16"><p class="mr-13">Home</p></div></v-btn>
			<v-expansion-panels variant="accordion" color="grey-darken-3">
				<v-expansion-panel title="Checkouts">
					<v-expansion-panel-text class="ml-0 pt-0 pr-0">
					<v-row no-gutters class="pl-0 pr-0">
						<v-col>
							<v-list class="pt-0 pb-0">
							<v-list-item class="pt-0 pb-0 pl-0 pr-0" v-for="(item, i) in checkoutsAllowed" :key = "i">
								<v-btn text color="grey-darken-4" class="font-weight-regular text-h6 rounded-0 pl-0"
								size="large" variant="text"
								@click = "router.push({name: item.routeName})">
									{{ item.bannerName }}
								</v-btn>
							</v-list-item>
							</v-list>
						</v-col>
					</v-row>
					</v-expansion-panel-text>
				</v-expansion-panel>
				<v-expansion-panel title="Management">
					<v-expansion-panel-text class="ml-0 pt-0 pr-0">
					<v-row no-gutters class="pl-0 pr-0">
						<v-col>
							<v-list class="pt-0 pb-0">
							<v-list-item class="pt-0 pb-0 pl-0 pr-0" v-for="(item, i) in managementAllowed" :key = "i">
								<v-btn text color="grey-darken-4" class="font-weight-regular text-h6 rounded-0 pl-0"
								size="large" variant="text"
								@click = "router.push({name: item.routeName})">
									{{ item.bannerName }}
								</v-btn>
							</v-list-item>
							</v-list>
						</v-col>
					</v-row>
					</v-expansion-panel-text>
				</v-expansion-panel>
				<v-expansion-panel title="Asset Organization">
					<v-expansion-panel-text class="ml-0 pt-0 pr-0">
					<v-row no-gutters class="pl-0 pr-0">
						<v-col>
							<v-list class="pt-0 pb-0">
							<v-list-item class="pt-0 pb-0 pl-0 pr-0" v-for="(item, i) in assetOrgAllowed" :key = "i">
								<v-btn text color="grey-darken-4" class="font-weight-regular text-h6 rounded-0 pl-0"
								size="large" variant="text"
								@click = "router.push({name: item.routeName})">
									{{ item.bannerName }}
								</v-btn>
							</v-list-item>
							</v-list>
						</v-col>
					</v-row>
					</v-expansion-panel-text>
				</v-expansion-panel>
			</v-expansion-panels>
		</v-list>
		</v-row>
	</v-navigation-drawer>
</template>