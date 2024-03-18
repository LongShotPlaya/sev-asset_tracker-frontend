<script setup>
    import { ref, onMounted } from "vue";
    // import { useRouter } from "vue-router";
    import Utils from "../config/utils.js";
    import peopleServices from "../services/personServices";
    import assetServices from "../services/assetServices.js";
    import userServices from "../services/userServices.js";
    import roleServices from "../services/groupServices.js";
    
    const message = ref("");
    const person = ref("");
    const personsAssets = ref([]);
    const user = Utils.getStore("user");
    
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

    const select = ref('Default');
    const roles = ['Super User', 'User', 'Person'];
    
    onMounted(() => {
        user.value = Utils.getStore("user");
        const id = props.id; 
        getUserRole(id);
        getSomeone(id);
        getPersonsAssets(id);
        getPermissions(id);
    });
</script>


<template>
    <br><br>
    <v-toolbar>
        <v-toolbar-title>{{ user.fName }}</v-toolbar-title> <!--Make sure the master user data uis accurate-->
    </v-toolbar>
    <v-card
    class="mx-auto"
    max-width="90%"
    min-width="80%"
    max-height="75%"
    min-height="70%"
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
                <v-btn
                    color="error" 
                    x-large 
                    style="margin-top: .3%; margin-left: 1%;">
                    back
                </v-btn>
            </v-container>
        </v-app>
    </v-card>
</template>

<style scoped>
.side{
    min-height: 48%;
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
