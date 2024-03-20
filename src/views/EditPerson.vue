<script setup>
    import { ref, onMounted } from "vue";
    import { useRouter } from "vue-router";
    import Utils from "../config/utils.js";
    import peopleServices from "../services/personServices";
    import assetServices from "../services/assetServices.js";
    import userServices from "../services/userServices.js";
    import roleServices from "../services/groupServices.js";
    import PersonManagementVue from "./PersonManagement.vue";
    
    const message = ref("");
    const person = ref("");
    const personsAssets = ref([]);
    const user = Utils.getStore("user");
    const router = useRouter();
    
    const props = defineProps({
      id: {
        required: true,
      },
    });

    const getUserRole = (id) => {
        roleServices.getGroup(id)
        .then((response) => {
            select.value=response.data.role;
        })
        .catch((error) => {
            message.value = error.response.data.message;
        })
    }

    const getPermissions = () => {
        userServices.getAllUsers()
        .then((response) => {
            user.value = response.data.find(user => user.id ===id); //Find for users permissions
        })
        .catch((error) => {
            message.value = error.response.data.message;
        })
    }
    
    const getSomeone = (id) => {
        peopleServices.getPerson(id) 
            .then((response) => {
                person.value = response.data;
            })
            .catch((error) => {
                message.value = error.response.data.message;
            })
    };
    
    const getPersonsAssets = (id) => { 
        assetServices.getAllAssets()
        .then((response) => {
            personsAssets.value = response.data.find(asset => asset.borrowerId === id); //Find to assets with borrowerId of id
            console.log(personsAssets);
        })
        .catch((error) => {
            message.value = error.response.data.message;
        })
    };
    
    //Asset data table
    const headers = ref([
        { title: 'ID', value: 'id' },
        { title: 'Name', value: 'name' },
        { title: 'Type', value: 'type' },
        { title: '', value: 'actions', align: 'end' },
    ]);

    const select = ref();
    const roles = ['Super User', 'User', 'Person'];

    const saveChanges = () => {
        const id = person.value.id;
        const data = { role: select.value };

        roleServices.updateGroup(id, data)
        .then(() => {
            console.log("Group updated successfully");
        })
        .catch((error) => {
            message.value = error.response.data.message;
        })
    };

    const cancel = () => {
        select.value = getUserRole();
        router.push({ name: "people" });
    };
    
    onMounted(() => {
        user.value = Utils.getStore("user");
        const id = props.id;
        getUserRole(id);
        getSomeone(id);
        getPersonsAssets(id);
        // getPermissions();
    });
</script>

<template>
    <br><br>
    <!-- <v-toolbar>
        <v-toolbar-title>{{ user.fName }}</v-toolbar-title>
    </v-toolbar> -->
    <v-card
    class="mx-auto"
    max-width="90%"
    min-width="80%"
    max-height="73%"
    min-height="73%"
    >
        <v-app>
            <v-toolbar>
                <v-toolbar-title>{{ person.fName + ' ' + person.lName }}</v-toolbar-title>
            </v-toolbar>
            <v-container>
                <v-row>
                    <v-col cols="3">
                        <v-card class="side">
                            <v-card-title>Person Role: {{ user.groupId }}
                                <v-select
                                    v-model="select"
                                    :items="roles"
                                    return-object
                                    single-line
                                    ></v-select>
                            </v-card-title>
                            <v-divider></v-divider>
                            <table id="contact">
                                <tr>
                                    <td>ID: </td>
                                    <td>{{ person.id }}</td>
                                </tr>
                                <tr>
                                    <td>Email: </td>
                                    <td>
                                        <a :href=" 'https://mail.google.com/mail/?view=cm&fs=1&to=' + person.email" target="_blank">{{ person.email }}</a>
                                    </td>
                                </tr>
                            </table>
                        </v-card>
                        <br>

                        <v-card class="side">
                        <v-card-title>Label for third block</v-card-title>
                        <v-divider></v-divider>
                        <v-card-text id="block3txt">Block 3</v-card-text>
                    </v-card>
                        <v-btn
                            @click="cancel()"
                            id="btn"
                            color="primary" 
                            style="margin-top: 3%;"
                            x-large>
                            cancel
                        </v-btn>
                        <v-btn
                            @click="saveChanges(person.id, { role: select.value })"
                            id="btn"
                            color="green" 
                            style="margin-top: 3%; margin-left: 2%;"
                            x-large>
                            save
                        </v-btn>
                    </v-col>

                    <v-col cols="9">
                        <v-card class="list">
                        <v-card-title>Assets</v-card-title>
                        <v-divider></v-divider>
                            <v-data-table
                            :headers="headers"
                            :items="personsAssets"
                            :disable-items-per-page="true"
                            >
                            </v-data-table>
                        </v-card>
                    </v-col>
                </v-row>

            </v-container>
        </v-app>
    </v-card>
</template>

<style scoped>
#btn{
    width: 49%;
    height: 8%;
    font-size: large;
}
.side{
    min-height: 43%;
}
.list{
    min-height: 600px;
}
#contact{
    margin: 5%;
    width: 100%;
}
#contact td{
    margin-right: 5%;
    font-size: medium;
}
#block3txt{
    font-size: medium;
}
</style>