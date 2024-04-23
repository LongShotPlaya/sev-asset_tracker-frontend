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
		
	const configureScreen = () => {

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

	onMounted(async () => {
		await AuthServices.authorizeUser();

		configureScreen();
	});

</script>

<template>
	<v-container>
		<br>
		<v-col>
			<v-card-title class="text-center" style="font-size: 200%;">Welcome, {{ user.fName }}!</v-card-title>
		</v-col>
		<br>
		<v-row justify="center">
			<v-col cols="6">
				<v-img src="oc-logo-large.png" style="height: 100%; width: 100%; object-fit: cover;"/>
			</v-col>
			<v-col cols="6" class="text-center" fill-height>
				<v-row>
					<v-btn class="text-center mt-4" min-width="550" min-height="100" variant="outlined"
					@click = "router.push({name: 'assets'})" block>
						<v-col>
							<h3>View Assets</h3>
							<br/>
							<p>See all currently held assets</p>
						</v-col>
					</v-btn>
				</v-row>
				<v-row>
					<v-btn class="text-center mt-8 mb-8" min-width="550" min-height="100" variant="outlined"
					@click = "router.push({name: 'people'})" block>
						<v-col>
							<h3>Search Person</h3>
							<br/>
							<p>Search for a specific person</p>
						</v-col>
					</v-btn>
				</v-row>
				<v-row>
					<v-btn class="text-center" min-width="550" min-height="100" variant="outlined"
					@click = "router.push({name: 'reports'})" block>
						<v-col>
							<h3>Create Report</h3>
							<br/>
							<p>Generate an asset report</p>
						</v-col>
					</v-btn>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
	<br><br><br><br><br>
	<v-card min-height="275" variant="flat"
	color="grey-darken-3" class="text-center rounded-0">
		<br>
		<v-card-title>Management</v-card-title>
		<br><br>
		<v-row>
			<v-col />
			<v-col>
				<v-btn min-width="150" min-height="50" variant="outlined"
				@click = "router.push({name: 'asset-categories'})">Asset Categories</v-btn>
			</v-col>
			<v-col>
				<v-btn min-width="150" min-height="50" variant="outlined"
				@click = "router.push({name: 'asset-types'})">Asset Types</v-btn>
			</v-col>
			<v-col>
				<v-btn min-width="150" min-height="50" variant="outlined"
				@click = "router.push({name: 'asset-templates'})">Asset Templates</v-btn>
			</v-col>
			<v-col>
				<v-btn min-width="150" min-height="50" variant="outlined"
				@click = "router.push({name: 'alert-types'})">Alert Types</v-btn>
			</v-col>
			<v-col>
				<v-btn min-width="150" min-height="50" variant="outlined"
				@click = "router.push({name: 'groups'})">Groups</v-btn>
			</v-col>
			<v-col />
		</v-row>
		<v-row class="mt-6" justify="center">
			<v-col cols="2" />
			<!-- <v-col>
				<v-btn max-width="150" min-height="50" variant="outlined"
				@click = "router.push({name: links[7]})">
					<p class="text-wrap">Custom Dropdown</p>
				</v-btn>
			</v-col> -->
			<!-- <v-col>
				<v-btn min-width="150" min-height="50" variant="outlined"
				@click = "router.push({name: links[11]})">Alerts</v-btn>
			</v-col>
			<v-col>
				<v-btn min-width="150" min-height="50" variant="outlined"
				@click = "router.push({name: links[9]})">Groups</v-btn>
			</v-col> -->
			<!-- <v-col>
				<v-btn min-width="150" min-height="50" variant="outlined"
				@click = "router.push({name: links[10]})">Vendors</v-btn>
			</v-col> -->
			<v-col cols="2" />
		</v-row>
	</v-card>
</template>