<script setup> 
    import { ref, onMounted } from "vue";
    import { useRouter } from "vue-router";
    import Utils from "../config/utils.js";
    import peopleServices from "../services/personServices.js";
    import groupServices from "../services/groupServices.js";
    import userServices from "../services/userServices.js";
    import assetTypeServices from "../services/assetTypeManagementServices.js";
    import personServices from "../services/personServices.js";
    
    const message = ref("");
    const person = ref("");
    const personsAssets = ref([]);
    const loadingGroup = ref(false);
    const select = ref("");
    const setPersonId = ref("Not a User");
    const fullPerson = ref();
    const assetsDue = ref([]);

    const user = Utils.getStore("user");
    const router = useRouter();
    
    const props = defineProps({
      id: {
        required: true,
      },
    });

    const getGroup = (id) => {
        groupServices.getGroup(id)
        .then((response) => {
            select.value = response.data?.id ?? "No Group";
            loadingGroup.value = false;
        })
        .catch((error) => {
            select.value = "No Group";
            message.value = error?.response?.data?.message;
            loadingGroup.value = false;
        })
    };

    const getFullPerson = async (id) => {
        let error = false;
        const response = await personServices.getFullPerson(id)
        .catch((error) => {
            error = true;
            if (error?.response?.status == 404) router.push({ name: "home" });
            message.value = error.response.data.message;
        });

        if (error) return;
        
        person.value = response.data;
        fullPerson.value = response.data;
        personsAssets.value = response.data.borrowedAssets;
        setPersonId.value = response.data.id;
        
        if ((fullPerson.value.user?.group?.id ?? null) !== null) getGroup(fullPerson.value.user.group.id);
        else
        {
            loadingGroup.value = false;
            select.value = "No Group";
        }
        getSoonDueAssets();
    };

    const getSoonDueAssets = () => {
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const dueAssets = personsAssets.value.filter(asset => {
            const dueDate = new Date(asset.dueDate);
            return dueDate <= nextMonth;
        });
        // console.log("Assets due soon: ", dueAssets);
    };

    //Asset data table
    const headers = [
        { title: 'Name', value: 'type.name', width: '25%' },
        { title: 'ID', value: 'id', width: '25%' },
        { title: 'Status', value: 'status', width: '25%' },
        { title: "Date Asset Last Updated", value: '', width: '25%' },
        { title: '', value: 'actions', align: 'end' },
    ];

    const roles = ref([]);

    const retrieveGroups = () => {
        groupServices.getAllGroups()
        .then(response => {
            roles.value = response.data.map(group => {
                return {
                    title: group.name,
                    value: group.id,
                    priority: group.priority,
                };
            });

            // Sort by group priority first, and then in alphabetical order
            // Higher priority will be placed later in the array to encourage security
            roles.value.sort((a, b) => {
                if (a.priority > b.priority) return -1;
                if (a.priority < b.priority) return 1;
                return a.title.localeCompare(b.title);
            });
            roles.value = [{ title: "No Group", value: "No Group", priority: null }, ...roles.value];
        })
        .catch(err => {
            console.log("Error retrieving groups!");
            message.value = err?.response?.data?.message;
        });
    }

    const saveChanges = () => {
        if (!person.value?.user?.id) return;
        const userId = person.value.user.id;
        const groupId = isNaN(parseInt(select.value)) ? null : parseInt(select.value);
        const data = { groupId };

        userServices.updateUser(userId, data)
        .then((response) => {
            // console.log("Group ID updated successfully! User ID: ", id, "Data: ", data);
            router.go(0);
        })
        .catch((error) => {
            if (error?.response?.status === 404) {
                console.error("User not found:", error.response.data.message);
            } else {
                console.error("Error:", error?.message);
            }        
        })
    };

    const cancel = () => {
        router.go(-1);
    };

    const viewAsset = (id) => {
        router.push({ name: "assets", props: id }); //Change when page is made. 
    };

    onMounted(() => {
        user.value = Utils.getStore("user");
        const id = props.id;
        loadingGroup.value = true;
        getFullPerson(id);
        retrieveGroups();
        // getUserGroupId(id); //Test
        // getAssetTypeName(); //Test
    });
</script>

<template>
    <v-container>
        <v-card>
            <v-toolbar>
                <v-toolbar-title>{{ person.fName + ' ' + person.lName }}</v-toolbar-title>
            </v-toolbar>
            <v-container
            class="v-container">
                <v-row style="height: 100%">
                    <v-col cols="3"
                    class="sidePanel">
                        <v-card class="side1">
                            <v-card-title>Person Role: 
                                <v-select
                                    v-model="select"
                                    :items="roles"
                                    :return-object="false"
                                    :disabled="select === 'Not a user'"
                                    :loading="loadingGroup"
                                    ></v-select>
                            </v-card-title>
                            <v-divider></v-divider>
                            <table id="contact">
                                <tr>
                                    <td>Email: </td>
                                    <td style="padding-right: 5%;">
                                        <a :href=" 'https://mail.google.com/mail/?view=cm&fs=1&to=' + person.email" target="_blank">{{ person.email }}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Student ID: </td>
                                    <td>{{ person.id }}</td>
                                </tr>
                            </table>
                        </v-card>
                    <br>
                        <v-card class="side2">
                            <v-card-title>Upcoming Assets Due</v-card-title>
                                <v-divider></v-divider>
                                    <v-card-text id="block3txt">
                                        <v-table
                                        class="assetsDue">
                                            <thead>
                                                <tr>
                                                    <th>Days until due</th>
                                                    <th>Due Date</th>
                                                    <th>ID</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <template v-if="assetsDue.length > 0">
                                                    <tr v-for="asset in assetsDue" :key="asset.id">
                                                        <td>{{ daysUntilDue(asset.dueDate) }}</td>
                                                        <td>{{ asset.dueDate }}</td>
                                                        <td>{{ asset.id }}</td>
                                                    </tr>
                                                </template>
                                                <template v-else>
                                                    <tr>
                                                        <td colspan="3">No assets due in the next month</td>
                                                    </tr>
                                                </template>
                                            </tbody>
                                        </v-table>
                                    </v-card-text>
                                </v-card>
                        <v-btn
                            @click="saveChanges()"
                            id="btn"
                            color="primary" 
                            style="margin-top: 3%;"
                            x-large>
                            save
                        </v-btn>
                        <v-btn
                            @click="cancel()"
                            id="btn"
                            color="secondary" 
                            style="margin-top: 3%;  margin-left: 2%;"
                            x-large>
                            cancel
                        </v-btn>
                    </v-col>

                    <v-col cols="9">
                        <v-card class="list">
                        <v-card-title>Assets</v-card-title>
                            <v-data-table
                                :headers="headers"
                                :items="personsAssets"
                                item-key="id"
                            >
                                <template v-slot:[`item.actions`]="{ item }">
                                    <v-btn class="ma-2" color="primary" :icon="true" @click="viewAsset(item.id)">
                                        <v-icon>mdi-pencil</v-icon> 
                                    </v-btn>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-container>
</template>

<style scoped>
.v-container{
    min-width: 100%;
    height: 820px; /**auto*/
}

.layout {
    min-height: max-content; /**Play with this */
}
.sidePanel{
    height: 96%;
    justify-content: center;
    width: auto;
    min-height: 725px;
}
#btn {
    width: 49%;
    height: 5.3%;
    font-size: large;
}
.side1 {
    min-height: 30%;
    width: 100%;
}
.side2 {
    min-height: 59.3%;
    width: 100%;
    overflow-y: auto;
    z-index: 9999;
}

.list {
    height: 730px;
    width: auto;
    overflow-y: auto;
    z-index: 9999;
}

#contact {
    margin: 5%;
    width: 100%;
}

#contact td {
    margin-right: 5%;
    font-size: medium;
}

#block3txt {
    font-size: medium;
}
</style>