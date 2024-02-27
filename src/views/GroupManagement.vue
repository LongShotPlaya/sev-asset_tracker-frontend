<script setup>
	import Utils from "../config/utils.js";
	import { ref, onMounted } from "vue";
	import AuthServices from "../services/authServices";
	import groupServices from "../services/groupServices";
	import { useRouter } from "vue-router";

	const router = useRouter();
	const user = Utils.getStore("user");
	const message = ref("");

	const groups = ref([]);

	const retrieveGroups = () => {
		groupServices.getAllGroups()
			.then((response) => {
				groups.value = response.data;
			})
			.catch((e) => {
				message.value = e.response.data.message;
			});
	};

	onMounted(() => {
		retrieveGroups();
	});

</script>

<template v-slot:activator="{ props: activatorProps }">
    <v-container>
        <v-btn class="mt-7 mx-0" color="primary" v-bind="activatorProps">Add group</v-btn>
		<v-card class="mt-7" variant="outlined" color="grey-lighten-1">
			<v-table>
				<thead>
				<tr>
					<th class="text-center">Name</th>
					<th class="text-center">Number of Users</th>
					<th class="text-center">Actions</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="(item, index) in groups" :key="index">
					<td class="text-center">{{ item.name }}</td>
					<td class="text-center">Unimplemented</td>
					<td class="text-center">
						<v-row justify="center">
						<div>
							<v-btn size="small" icon="mdi-format-list-bulleted-type" @click="router.push({name: ''})">
							</v-btn><v-tooltip activator="parent" location="bottom">View Group</v-tooltip>
						</div>
						<div>
							<v-btn size="small" icon="mdi-pencil" @click="router.push({name: ''})">
							</v-btn><v-tooltip activator="parent" location="bottom">Edit Group</v-tooltip>
						</div>
						<div>
							<v-btn size="small" icon="mdi-trash-can" @click="router.push({name: ''})">
							</v-btn><v-tooltip activator="parent" location="bottom">Delete Group</v-tooltip>
						</div>
					</v-row>
					</td>
				</tr>
				</tbody>
			</v-table>
		</v-card>
		<v-card-text>
			<b>{{ message }}</b>
		</v-card-text>
    </v-container>

	<v-dialog max-width="500">
  		<template v-slot:activator="{ props: activatorProps }">
			<v-btn
				v-bind="activatorProps"
				color="surface-variant"
				text="Open Dialog"
				variant="flat">
			</v-btn>
  		</template>

		<template v-slot:default="{ isActive }">
			<v-card title="Dialog">
			<v-card-text>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>

				<v-btn
				text="Close Dialog"
				@click="isActive.value = false"
				></v-btn>
			</v-card-actions>
			</v-card>
		</template>
	</v-dialog>

</template>