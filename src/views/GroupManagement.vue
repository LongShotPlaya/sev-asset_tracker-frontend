<script setup>
	import Utils from "../config/utils.js";
	import { ref, onMounted } from "vue";
	import AuthServices from "../services/authServices";
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

<template>
    <v-container>
		<v-row class="mt-7 mx-0" justify="left">
            <v-btn color="primary" @click="router.push({name: ''})">Add group</v-btn>
        </v-row>
		<v-card class="mt-7" variant="outlined" color="grey-lighten-1">
			<v-table>
				<thead>
				<tr>
					<th class="text-center">Name</th>
					<th class="text-center">Description</th>
					<th class="text-center">Actions</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="(item, index) in groups" :key="index">
					<td>{{ item.name }}</td>
					<td>{{ item.description }}</td>
					<td>
					<v-icon small class="mx-4" @click="router.push({name: ''})">
					mdi-format-list-bulleted-type</v-icon>
					<v-icon small class="mx-4" @click="router.push({name: ''})">
					mdi-pencil</v-icon>
					<v-icon small class="mx-4" @click="router.push({name: ''})">
					mdi-trash-can</v-icon>
					</td>
				</tr>
				</tbody>
			</v-table>
		</v-card>
		<v-card-text>
			<b>{{ message }}</b>
		</v-card-text>
    </v-container>
</template>