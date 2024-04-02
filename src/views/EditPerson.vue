<script setup> 
    import { ref, onMounted } from "vue";
    import { useRouter } from "vue-router";
    import Utils from "../config/utils.js";
    import peopleServices from "../services/personServices.js";
    import assetServices from "../services/assetServices.js";
    import groupServices from "../services/groupServices.js";
    import userServices from "../services/userServices.js";
    import assetTypeServices from "../services/assetTypeManagementServices.js";
import personServices from "../services/personServices.js";
    
    const message = ref("");
    const person = ref("");
    const personsAssets = ref([]);
    const select = ref("Not a user");
    const userGroupId = ref("");
    const assetTypeName = ref("");
    const assetTypeId = ref("");
    const setPersonId = ref("Not a User");
    const fullPerson = ref();

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
            select.value = response.data.name; // Non-exsistant group Id being called here: For non-user
        })
        .catch((error) => {
            message.value = error.response.data.message;
        })
    };
    
    const getSomeone = (id) => {
        peopleServices.getPerson(id) 
            .then((response) => {
                person.value = response.data;
            })
            .catch((error) => {
                message.value = error.response.data.message;
            })
    };

    const getPersonId = (id) => {
        userServices.getUser(id)
        .then((response) => {
            setPersonId.value = response.data.personId; // Non-exsistant user id being called here: For non-user
            console.log("Person ID: ", setPersonId); 
        })
        .catch((error) => {
            message.value = error.response.data.message;
        })
    };

    const getUserGroupId = (id) => {
        userServices.getUser(id) //Non-exsistant user ID being called here: For non-user
        .then((response) => {
            userGroupId.value = response.data.groupId; // User's Group Id, permissions
            // console.log("User Group ID: ", userGroupId);
        })
        .catch((error) => {
            message.value = error.response.data.message;
        })
    };

    const getAssetTypeName = () => {
        assetTypeServices.getAllAssetTypes()
        .then((response) => {
            assetTypeName.value = response.data.name; // get Asset Name
            assetTypeId.value = response.data.id; // get Asset ID
            // console.log("Asset Type Names: ", assetTypeName );
            // console.log("Asset Type ID: ", assetTypeId);
        })
        .catch((error) => {
            message.value = error.response.data.message;
        })
    };

    const getFullPerson = (id) => {
        personServices.getFullPerson(id) 
        .then((response) => {
            fullPerson.value = response.data;
            personsAssets.value = response.data.borrowedAssets;
            console.log("Full person: ", fullPerson);
            console.log("Full persons assets: ", personsAssets);
        })
        .catch((error) => {
            message.value = error.response.data.message;
        })
    }

    //Asset data table
    const headers = [
        { title: 'Type', value: 'type.name', width: '25%' },
        { title: 'ID', value: 'id', width: '25%' },
        { title: 'Status', value: 'status', width: '25%' },
        { title: "Date?", value: '', width: '25%' },
        { title: '', value: 'actions', align: 'end' },
    ];

    const roles = [
        { title: 'Super User', value: 1 }, 
        { title: 'User', value: 2 }, 
        { title: 'Person', value: 3 }, 
    ];

    const saveChanges = (id) => { 
        const userId = id;
        const data = { groupId: select.value };

        userServices.updateUser(userId, data)
        .then(() => {
            console.log("Group ID updated successfully: ", data);
        })
        .catch((error) => {
            if (error.response.status === 404) {
                console.error("Asset type not found:", error.response.data.message);
            } else {
                console.error("Error:", error.message);
            }        
        })
    };

    const cancel = () => {
        router.go(-1);
    };

    const viewAsset = (id) => {
        router.push({ name: "asset", props: id }); //Change when page is made. 
    };

    onMounted(() => {
        user.value = Utils.getStore("user");
        const id = props.id;
        getGroup(id);
        getSomeone(id);
        getPersonId(id);
        getUserGroupId(id); //Test
        getAssetTypeName(); //Test
        getFullPerson(id); //Test
    });
</script>

<template>
    <br>
    <v-card
    class="mx-auto"
    width="90%"
    height="90%"
    >
        <v-app
        class="layout">
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
                                    return-object
                                    single-line
                                    :disabled="select === 'Not a user'"
                                    ></v-select>
                            </v-card-title>
                            <v-divider></v-divider>
                            <table id="contact">
                                <tr>
                                    <td>Email: </td>
                                    <td>
                                        <a :href=" 'https://mail.google.com/mail/?view=cm&fs=1&to=' + person.email" target="_blank">{{ person.email }}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Person ID: </td>
                                    <td>{{ person.id }}</td>
                                </tr>
                                <tr>
                                    <td>User ID: </td>
                                    <td>{{ setPersonId }}</td>
                                </tr>
                            </table>
                        </v-card>
                        <br>
                        <v-card class="side2">
                        <v-card-title>Label for third block</v-card-title>
                        <v-divider></v-divider>
                        <v-card-text id="block3txt">Block 3</v-card-text>
                        </v-card>
                        <v-btn
                            @click="saveChanges(person.id)"
                            id="btn"
                            color="green" 
                            style="margin-top: 3%;"
                            x-large>
                            save
                        </v-btn>
                        <v-btn
                            @click="cancel()"
                            id="btn"
                            color="#811429" 
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
                                    <v-btn class="ma-2" color="primary" :icon="true" size="small" @click="viewAsset(item.id)">
                                        <v-icon>mdi-pencil</v-icon> 
                                    </v-btn>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-app>
    </v-card>
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
    min-height: 40%;
    width: 100%;
}
.side2 {
    min-height: 49.5%;
    width: 100%;
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