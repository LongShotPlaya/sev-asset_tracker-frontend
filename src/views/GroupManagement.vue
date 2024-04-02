<script setup>
	import Utils from "../config/utils.js";
	import { ref, onMounted } from "vue";
	import AuthServices from "../services/authServices";
	import groupServices from "../services/groupServices";
	import { useRouter } from "vue-router";

	const router = useRouter();
	const user = Utils.getStore("user");
	const message = ref("");
	
	const editDialogue = ref(false);
	const addDialogue = ref(false);
	const viewDialogue = ref(false);
	const deleteDialogue = ref(false);
	const groups = ref([]);

	const openDialog = (action) => {
		switch (action)
		{
			case ("add"):
				addDialogue.value = true;
				break;
			case ("view"):
				viewDialogue.value = true;
				break;
			case ("edit"):
				editDialogue.value = true;
				break;
			case ("delete"):
				deleteDialogue.value = true;
				break;
		}
	}

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
        <v-btn class="mt-7 mx-0" color="primary" @click="openDialog('add')">Add group</v-btn>
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
							<v-btn size="small" icon="mdi-format-list-bulleted-type" @click="openDialog('view')">
							</v-btn><v-tooltip activator="parent" location="bottom">View Group</v-tooltip>
						</div>
						<div>
							<v-btn size="small" icon="mdi-pencil" @click="openDialog('edit')">
							</v-btn><v-tooltip activator="parent" location="bottom">Edit Group</v-tooltip>
						</div>
						<div>
							<v-btn size="small" icon="mdi-trash-can" @click="openDialog('delete')">
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

	<v-dialog v-model="addDialogue" max-width="90%">
	  <v-card>
		<v-container>
			<v-card-title class="text-h5">Add</v-card-title>
		</v-container>
	  </v-card>
	</v-dialog>

  <v-dialog v-model="viewDialogue" max-width="90%">
    <v-card>
      <v-container>
        <v-card-title class="text-h5">View</v-card-title>
      </v-container>
    </v-card>
  </v-dialog>

  <v-dialog v-model="editDialogue" max-width="90%">
    <v-card>
      <v-container>
        <v-card-title class="text-h5">Edit</v-card-title>
      </v-container>
    </v-card>
  </v-dialog>

  <v-dialog v-model="deleteDialogue" max-width="50%">
    <v-card>
      <v-container>
        <v-card-title class="text-h5">Are you sure you want to delete?</v-card-title>
      </v-container>
    </v-card>
  </v-dialog>

</template>