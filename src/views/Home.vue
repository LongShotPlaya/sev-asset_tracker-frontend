<script setup>
	import Utils from "../config/utils.js";
	import { ref, onMounted } from "vue";
	import AuthServices from "../services/authServices";
	import { useRouter } from "vue-router";

	const router = useRouter();
	const user = Utils.getStore("user");
	const message = ref("");
	const sectionsAllowed = ref([]);
	const linksAllowed = ref([]);

	const sections = [
			{ name: "Assets", permission: "any" },
			{ name: "Reports and Customization", permission: "any" },
			{ name: "People and Groups", permission: "any" },
		];
	const links = [
			{ name: "All Assests", section: "Assets", routeName: "", permission: "any" },
			{ name: "Manage Assest Templates", section: "Assets", routeName: "", permission: "any" },
			{ name: "Manage Custom Dropdown", section: "Reports and Customization", routeName: "", permission: "any" },
		];

	const configureScreen = () => {
		// Configure the sectionsAllowed
		sectionsAllowed.value = [];
		sections.forEach((item) => {
			if (authorize(item.permission))
				sectionsAllowed.value.push(item);
		});

		// Configure the linksAllowed
		linksAllowed.value = [];
		links.forEach((item) => {
			if (authorize(item.permission))
				linksAllowed.value.push(item);
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

	onMounted(() => {
		configureScreen();
	});

</script>

<template>
  <div>
    <v-container>
		<v-col>
			<h2 class="text-center">Welcome, {{ user.fName }}!</h2>
		</v-col>
		<v-row class="mt-2">
			<v-spacer></v-spacer>
			<v-card class="text-center" min-width="200" min-height="200"
			title="All Assets" text="Desc" variant="outlined">
				<v-card-actions>
					<v-row justify="center">
						<v-btn class="mt-12" min-width="125" variant="flat" color="primary"></v-btn>
					</v-row>
				</v-card-actions>
			</v-card>
			<v-spacer></v-spacer>
			<v-card class="text-center" min-width="200" min-height="200"
			title="Search Person" text="Desc" variant="outlined">
				<v-card-actions>
					<v-row justify="center">
						<v-btn class="mt-12" min-width="125" variant="flat" color="primary"></v-btn>
					</v-row>
				</v-card-actions>
			</v-card>
			<v-spacer></v-spacer>
			<v-card class="text-center" min-width="200" min-height="200"
			title="Create Report" text="Desc" variant="outlined">
				<v-card-actions>
					<v-row justify="center">
						<v-btn class="mt-12" min-width="125" variant="flat" color="primary"></v-btn>
					</v-row>
				</v-card-actions>
			</v-card>
			<v-spacer></v-spacer>
		</v-row>
		<v-col>
			<v-card min-height="300" title="Other" variant="flat" class="text-center mt-6">
				<v-row class="mt-4">
					<v-spacer></v-spacer>
					<v-card class="text-center" min-width="400" max-height="100"
					title="Asset Templates" text="Desc" variant="outlined">
					</v-card>
					<v-spacer></v-spacer>
					<v-card class="text-center" min-width="400" max-height="100"
					title="Asset Types" text="Desc" variant="outlined">
					</v-card>
					<v-spacer></v-spacer>
				</v-row>
				<v-row class="mt-10">
					<v-spacer></v-spacer>
					<v-card class="text-center" min-width="400" max-height="100"
					title="Asset Categories" text="Desc" variant="outlined">
					</v-card>
					<v-spacer></v-spacer>
					<v-card class="text-center" min-width="400" max-height="100"
					title="Facilities" text="Desc" variant="outlined">
					</v-card>
					<v-spacer></v-spacer>
				</v-row>
			</v-card>
		</v-col>
    </v-container>
	<v-card min-height="200" title="Management" variant="flat"
	color="grey-darken-3" class="text-center rounded-0">
		<v-row class="mt-6" justify="center">
			<v-spacer></v-spacer>
			<v-btn max-width="150" min-height="50" variant="outlined">
				<p class="text-wrap">Custom Dropdown</p>
			</v-btn>
			<v-spacer></v-spacer>
			<v-btn min-width="150" min-height="50" variant="outlined">People</v-btn>
			<v-spacer></v-spacer>
			<v-btn min-width="150" min-height="50" variant="outlined">Groups</v-btn>
			<v-spacer></v-spacer>
			<v-btn min-width="150" min-height="50" variant="outlined">Vendors</v-btn>
			<v-spacer></v-spacer>
			<v-btn min-width="150" min-height="50" variant="outlined">Alerts</v-btn>
			<v-spacer></v-spacer>
		</v-row>
	</v-card>
  </div>
</template>