<script setup>
	import Utils from "../config/utils.js";
	import { ref, onMounted } from "vue";
	import AuthServices from "../services/authServices";
	import groupServices from "../services/groupServices";
	import permissionServices from "../services/permissionServices";
	import userServices from "../services/userServices";
	import personServices from "../services/personServices";
	import { useRouter } from "vue-router";

	const router = useRouter();
	const user = Utils.getStore("user");
	const message = ref("message");
	const spacing = ref(" ");
	const groupName = ref("");
	//const groupPermissions = ref([]);
	const groupId = ref("");
	const selectedPerms = ref([]);
	const group = ref({});
	
	const editDialogue = ref(false);
	const addDialogue = ref(false);
	const viewDialogue = ref(false);
	const deleteDialogue = ref(false);
	
	const search = ref("");
	const headers = [
	{ key: 'name', title: 'Group Name', align: 'start' },
	{ key: 'description', title: 'Description', align: 'start' },
	{ key: 'actions', title: '', align: 'end' },
	];
	
	const groups = ref([]);
	const permissions = ref([]);
	const users = ref([]);
	const people = ref([]);
	const person = ref([]);

	const displayUsers = ref([]);
	const displayPeople = ref([]);
	const displayPermissions = ref([]);

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
				permissions.value = response.data.map(permission => {
					return {
						name: permission.name,
						categorySpecific: !isNaN(parseInt(permission.categoryId)),
						clearance: "none",
						report: false,
					};
				});
			})
			.catch((e) => {
				message.value = e.response.data.message;
			});
		//message.value = permissions;
	};

	const changePerm = (item) => {
		// Check if permission exists
		if (item.clearance == "none")
			item.clearance = "full";
		else
			item.clearance = "none";
		//message.value = groupPermissions;
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
		let permissions = [...permissions.value];
		let groupInfo = ref({ id: null, name: "", priority: null,
		expiration: null, createdAt: "", updatedAt: "", permissions: [] });

		groupServices.createGroup({name})
			.then((response) => {
				groupServices.getGroup(response.data.id)
					.then((response) => {
						groupInfo.value.id = response.data.id;
						groupInfo.value.name = response.data.name;
						groupInfo.value.priority = response.data.priority;
						groupInfo.value.expiration = response.data.expiration;
						groupInfo.value.createdAt = response.data.createdAt;
						groupInfo.value.updatedAt = response.data.updatedAt;
						for (let i = 0; i < permissions.length; i++)
							if (permissions[i].clearance != "none")
								groupInfo.value.permissions.push(permissions[i]);
						groupServices.updateGroup(groupInfo.value.id, groupInfo.value)
							.then((response) => {
								message.value = groupInfo.value + " => " + response.data;
								groupName.value = "";
								//resetPermissions();
								addDialogue.value = false;
								//location.reload();
							})
							.catch((e) => {
								message.value = e.response.data.message;
							});
				})
				.catch((e) => {
					message.value = e.response.data.message;
				});
			})
			.catch((e) => {
				message.value = e.response.data.message;
			});
	};

	const editGroup = (id, permissions) => {
		let groupInfo = ref({ id: null, name: "", priority: null,
		expiration: null, createdAt: "", updatedAt: "", permissions: [] });

		groupServices.getGroup({id})
			.then((response) => {
				groupInfo.value.id = response.data.id;
				groupInfo.value.name = response.data.name;
				groupInfo.value.priority = response.data.priority;
				groupInfo.value.expiration = response.data.expiration;
				groupInfo.value.createdAt = response.data.createdAt;
				groupInfo.value.updatedAt = response.data.updatedAt;
				for (let i = 0; i < permissions.length; i++)
					if (permissions[i].clearance != "none")
						groupInfo.value.permissions.push(permissions[i]);
				groupServices.updateGroup(groupInfo.value.id, groupInfo.value)
					.then((response) => {
						message.value = groupInfo.value + " => " + response.data;
						groupName.value = "";
						//resetPermissions();
						editDialogue.value = false;
						//location.reload();
					})
					.catch((e) => {
						message.value = e.response.data.message;
					});
		})
		.catch((e) => {
			message.value = e.response.data.message;
		});
	};

	const deleteGroup = (id) => {
		groupServices.deleteGroup(id)
		.then(response => {
			deleteDialogue.value = false;
			location.reload();
		})
		.catch(e => {
			message.value = e.response.data.message;
		});
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
				displayPermissions.value = response.data;
				//console.log(displayPermissions.value);
			})
			.catch((e) => {
				message.value = e.response.data.message;
			});
		// message.value = displayPermissions.value;
	};

	const configureEdit = async (id) => {
		let error = false;
		const response = await groupServices.getGroupWithPermissions(id)
			.catch((e) => {
				message.value = e.response.data.message;
				editDialogue.value = false;
				error = true;
			});
		if (error)
			return;
		group.value = response.data;
		const groupPermissions = group.value.permissions;
		group.value.permissions = [...permissions.value];
		groupPermissions.forEach(permission => {
			const match = group.value.permissions.findIndex(option => option.name == permission.name);
			if (match < 0)
				return;
			group.value.permissions[match] = {
				...group.value.permissions[match],
				...permission
			};
		});
		//message.value
	};

	const openDialog = (action, id) => {
		switch (action)
		{
			case ("add"):
				addDialogue.value = true;
				break;
			case ("view"):
				viewDialogue.value = true;
				findPeople(id);
				findPermissions(id);
				break;
			case ("edit"):
				editDialogue.value = true;
				configureEdit(id);
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
		//resetPermissions();
	});

</script>

<template>
    <v-container>
		<v-row>
			<v-spacer></v-spacer>
        	<v-btn class="mt-7 mr-3" color="primary" @click="openDialog('add', null)">Add group</v-btn>
		</v-row>
		<v-card class="mt-7" variant="outlined" color="grey-lighten-1">
			<v-data-table :headers="headers" :items="groups" :sort-by="[{ key: 'name', order: 'asc' }]">
				<template v-slot:[`item.actions`]="{ item }">
					<v-btn class="ma-2" color="primary"
					icon="mdi-format-list-bulleted-type" @click="openDialog('view', item.id)">
					</v-btn>
					<v-btn class="ma-2" color="primary"
					icon="mdi-pencil" @click="openDialog('edit', item.id)">
					</v-btn>
					<v-btn class="ma-2" color="primary" variant="outlined"
					icon="mdi-trash-can" @click="openDialog('delete', item.id)">
					</v-btn>
				</template>
        	</v-data-table>
		</v-card>
		<b>{{ message }}</b>
    </v-container>

	<v-dialog v-model="addDialogue" max-width="90%" persistent>
	  <v-card>
		<v-container>
			<v-card>
				<v-form @submit.prevent><!---->
					<v-card-title class="text-h5">
						<v-row class="mt-auto mx-auto mb-auto">
							Create a New Group
							<v-spacer></v-spacer>
							<v-btn color="primary" type="submit" class="mr-3" @click="addGroup(groupName)">Save</v-btn>
							<v-btn variant=outlined color="primary" @click="addDialogue=false; console.log('console.log sucks')">Cancel</v-btn>
						</v-row>
					</v-card-title>
					<div class="ml-8 mr-16">
						<v-row>
							<v-col>
								<br />
								<v-row>
									<v-text-field required variant=outlined
									label="Name" v-model=groupName></v-text-field>
								</v-row>
								<br />
								<v-list>
									<v-list-item v-for="(item, index) in permissions" :key="index">
										<div v-if="!item.categorySpecific">
											<v-divider></v-divider>
											<v-checkbox :label=item.name :value=item.name @click="changePerm(item)">
											</v-checkbox>
										</div>
										<div v-else>
											<v-divider></v-divider>
											<v-row>
												<v-select class="mt-8" :label="item.name"
												:items="['View', 'Edit', 'Create', 'Delete']">
												</v-select>
												<v-checkbox class="mt-8" label="Reportable?">
												</v-checkbox>
											</v-row>
										</div>
									</v-list-item>
								</v-list>
							</v-col>
						</v-row>
					</div>
				</v-form>
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
							<v-list-item v-for="(item, index) in displayPermissions.permissions" :key="index"
								:title="item.name" :subtitle="item.clearance == 'full' ? `` : `${item.clearance}, ${item.report ? 'can report' : 'cannot report'}`">
								<v-divider></v-divider>
							</v-list-item>
						</v-list>
					</v-col>
				</v-card>
				<v-card min-width="50%" max-width="50%">
					<v-col>
						<v-card-title> People </v-card-title>
						<v-list lines="one">
							<v-list-item v-show=displayPeople[index] v-for="(item, index) in people"
							:key="index">
							<router-link :to="router.resolve({ name: 'person', params: { id: item.id }})">
								{{ item.fName+spacing+item.lName }}
							</router-link>
							<v-divider></v-divider>
							</v-list-item>
						</v-list>
					</v-col>
				</v-card>
			</v-row>
		</v-card>
      </v-container>
    </v-card>
  </v-dialog>

  <v-dialog v-model="editDialogue" max-width="90%" persistent>
    <v-card>
      <v-container>
		<v-card>
			<v-form @submit.prevent><!---->
					<v-card-title class="text-h5">
						<v-row class="mt-auto mx-auto mb-auto">
							Edit Group
							<v-spacer></v-spacer>
							<v-btn color="primary" type="submit" class="mr-3" @click="editGroup(groupId)">Save</v-btn>
							<v-btn variant=outlined color="primary" @click="editDialogue=false; console.log('this one suck too!')">Cancel</v-btn>
						</v-row>
					</v-card-title>
					<div class="ml-8 mr-16">
						<v-row>
							<v-col>
								<br />
								<v-row>
									<v-text-field required variant=outlined
									label="Name" v-model=groupName></v-text-field>
								</v-row>
								<br />
								<v-list>
									<v-list-item v-for="(item, index) in permissions" :key="index">
										<div v-if="!item.categorySpecific">
											<v-divider></v-divider>
											<v-checkbox :label=item.name :value=item.name @click="changePerm(item.name)">
											</v-checkbox>
										</div>
										<div v-else>
											<v-divider></v-divider>
											<v-row>
												<v-select class="mt-8" :label="item.name"
												:items="['View', 'Edit', 'Create', 'Delete']">
												</v-select>
												<v-checkbox class="mt-8" label="Reportable?">
												</v-checkbox>
											</v-row>
										</div>
									</v-list-item>
								</v-list>
							</v-col>
						</v-row>
					</div>
				</v-form>
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