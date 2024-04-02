<script setup>
	import Utils from "../config/utils.js";
	import { ref, onMounted } from "vue";
	import AuthServices from "../services/authServices";
	import groupServices from "../services/groupServices";
	import permissionServices from "../services/permissionServices";
	import userServices from "../services/userServices";
	import personServices from "../services/personServices";
	import { useRouter } from "vue-router";

	const user = Utils.getStore("user");
	const message = ref("");
	const spacing = ref(" ");
	const groupName = ref("");
	const groupId = ref("");
	const selectedPerms = ref([]);
	
	const editDialogue = ref(false);
	const addDialogue = ref(false);
	const viewDialogue = ref(false);
	const deleteDialogue = ref(false);
	
	const search = ref("");
	const headers = [
	{ key: 'name', title: 'Group Name'},
	{ key: 'numOfUsers', title: 'Number of Users'},
	{ key: 'actions', title: 'Actions'},
	];
	
	const groups = ref([]);
	const permissions = ref([]);
	const users = ref([]);
	const people = ref([]);
	const person = ref([]);

	const displayUsers = ref([]);
	const displayPeople = ref([]);

	const retrieveGroups = () => {
		groupServices.getAllGroups()
			.then((response) => {
				groups.value = response.data;
			})
			.catch((e) => {
				message.value = e.response.data.message;
			});
	};

	const retrievePermissions = () => {
		permissionServices.getAllPermissions()
			.then((response) => {
				permissions.value = response.data;
			})
			.catch((e) => {
				message.value = e.response.data.message;
			});
	};

	const retrieveUsers = () => {
		userServices.getAllUsers()
			.then((response) => {
				users.value = response.data;
			})
			.catch((e) => {
				message.value = e.response.data.message;
			});
	};

	const retrievePeople = () => {
		personServices.getAllPeople()
			.then((response) => {
				people.value = response.data;
			})
			.catch((e) => {
				message.value = e.response.data.message;
			});
		//message.value = people;
	};

	const addGroup = (name) => {
		groupServices.createGroup({name});
		addDialogue.value = false;
		groupName.value = "";
	};

	const updateGroup = (id, name, data) => {
		groupServices.updateGroup(id, name);
		editDialogue.value = false;
		groupName.value = "";
	};

	const deleteGroup = (id) => {
		groupServices.deleteGroup(id);
		deleteDialogue.value = false;
	};

	const findPeople = (groupId) => {
		var i, j;
		for (i = 0; i < users.value.length; i++)
		{
			if (users.value[i].groupId == groupId.value)
				displayUsers.value[i] = true;
			else
				displayUsers.value[i] = false;
		}

		for (i = 0; i < people.value.length; i++)
		{
			for (j = 0; j < users.value.length; j++)
			{
				if (people.value[j].id = users.value[i].personId) // check if person is a user
				{
					if (users.value[i].groupId == groupId.value) // check if user is in that group
						displayPeople.value[i] = true;
					else
						displayPeople.value[i] = false;
				}
				else
					displayPeople.value[i] = false;
			}
		}
		// message.value = displayPeople; // debugging only
	};

	const findPermissions = (groupId) => {
		groupServices.getGroupWithPermissions(groupId.value)
			.then((response) => {
				message.value = response.data;
			})
			.catch((e) => {
				message.value = e.response.data.message;
			});
	};

	const openDialog = (action, id) => {
		groupId.value = id;
		switch (action)
		{
			case ("add"):
				addDialogue.value = true;
				break;
			case ("view"):
				viewDialogue.value = true;
				findPeople(groupId);
				findPermissions(groupId);
				break;
			case ("edit"):
				editDialogue.value = true;
				break;
			case ("delete"):
				deleteDialogue.value = true;
				break;
		}
	};

	onMounted(() => {
		retrieveGroups();
		retrievePermissions();
		retrieveUsers();
		retrievePeople();
	});

</script>

<template>
    <v-container>
        <v-btn class="mt-7 mx-0" color="primary" @click="openDialog('add', null)">Add group</v-btn>
		<v-card class="mt-7" variant="outlined" color="grey-lighten-1">
			<v-data-table :headers ="headers" :items ="groups">
				<template v-slot:[`item.actions`]="{ item }">
					<v-btn class="ma-2" color="primary"
					icon="mdi-format-list-bulleted-type" @click="openDialog('view', 1)">
					</v-btn>
					<v-btn class="ma-2" color="primary"
					icon="mdi-pencil" @click="openDialog('edit', item.id)">
					</v-btn>
					<v-btn class="ma-2" color="primary" variant="outlined"
					icon="mdi-trash-can" @click="openDialog('delete', 2)">
					</v-btn>
				</template>
        	</v-data-table>
		</v-card>
		<b>{{ message }}</b>
    </v-container>

	<v-dialog v-model="addDialogue" max-width="90%">
	  <v-card>
		<v-container>
			<v-card>
				<v-card-title class="text-h5">
					<v-row class="mt-auto mx-auto mb-auto">
					Create a New Group
					<v-spacer></v-spacer>
					<v-btn color="primary" class="mr-3" @click="addGroup(groupName)">Save</v-btn>
					<v-btn variant=outlined color="primary" @click="addDialogue=false">Cancel</v-btn>
					</v-row>
				</v-card-title>
				<v-card-actions>
					<v-row>
						<v-col>
							<br />
							<v-text-field required variant=outlined label="Name" max-width="30%" v-model=groupName></v-text-field>
							<br />
							<div v-for="(item, index) in permissions" :key="index">
								<v-checkbox :v-model=selectedPerms
								:label=item.name+spacing+item.description :value=item.id>
								</v-checkbox>
							</div>
						</v-col>
					</v-row>
				</v-card-actions>
			</v-card>
		</v-container>
	  </v-card>
	</v-dialog>

  <v-dialog v-model="viewDialogue" max-width="90%">
    <v-card>
      <v-container>
		<v-card>
			<v-row>
				<v-card min-width="50%" max-width="50%">
					<v-col>
						<v-row class="mt-auto mx-auto mb-auto">
							<v-card-title> Permissions Allowed </v-card-title>
						</v-row>
						<v-list lines="two">
							<v-list-item v-for="(item, index) in displayPermissions" :key="index"
								:title="item.name" :subtitle="item.description">
							</v-list-item>
						</v-list>
					</v-col>
				</v-card>
				<v-card min-width="50%" max-width="50%">
					<v-col>
						<v-card-title> People </v-card-title>
						<v-list lines="one">
							<v-list-item v-show=displayPeople[index] v-for="(item, index) in people"
							:key="index" :title="item.fName+spacing+item.lName">
							</v-list-item>
						</v-list>
					</v-col>
				</v-card>
			</v-row>
		</v-card>
      </v-container>
    </v-card>
  </v-dialog>

  <v-dialog v-model="editDialogue" max-width="90%">
    <v-card>
      <v-container>
		<v-card>
			<v-card-title class="text-h5">
				<v-row class="mt-auto mx-auto mb-auto">
				Edit Group
				<v-spacer></v-spacer>
				<v-btn color="primary" class="mr-3" @click="editGroup(groupId, groupName)">Save</v-btn>
				<v-btn variant=outlined color="primary" @click="editDialogue=false">Cancel</v-btn>
				</v-row>
			</v-card-title>
			<v-card-actions>
				<v-row>
					<v-col>
						<br />
						<v-text-field required variant=outlined label="Name" max-width="30%" v-model=groupName></v-text-field>
						<br />
						<div v-for="(item, index) in permissions" :key="index">
							<v-checkbox :v-model=selectedPerms
							:label=item.name+spacing+item.description :value=item.id>
							</v-checkbox>
						</div>
					</v-col>
				</v-row>
			</v-card-actions>
		</v-card>
      </v-container>
    </v-card>
  </v-dialog>

  <v-dialog v-model="deleteDialogue" max-width="50%">
    <v-card>
      <v-container>
        <v-card-title class="text-h5">Are you sure you want to delete this group?</v-card-title>
		<v-btn color="primary" class="mr-3" @click="deleteGroup(groupId)">Delete</v-btn>
		<v-btn variant=outlined color="primary" @click="deleteDialogue=false">Cancel</v-btn>
      </v-container>
    </v-card>
  </v-dialog>

</template>