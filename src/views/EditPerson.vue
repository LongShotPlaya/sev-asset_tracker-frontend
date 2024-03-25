<script setup>
    import { ref, onMounted } from "vue";
    import { useRouter } from "vue-router";
    import Utils from "../config/utils.js";
    import peopleServices from "../services/personServices";
    import assetServices from "../services/assetServices.js";
    import userServices from "../services/userServices.js";
    import groupServices from "../services/groupServices.js";
    
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

    // const getUserRoleNum = () => {
    //     userServices.getUser(id) 
    //     .then((response) => {
    //         role.value = response.data;
    //     })
    //     .catch((error) => {
    //         message.value = error.response.data.message;
    //     })
    // };

    const getGroup = (id) => {
        groupServices.getGroup(id)
        .then((response) => {
            select.value=response.data.role;
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
            personsAssets.value = response.data.filter(asset => asset.borrowerId == id);
            // personsAssets.value = response.data;
            console.log("Person's Assets: ", personsAssets);
        })
        .catch((error) => {
            message.value = error.response.data.message;
        })
    };

    
    //Asset data table
    const headers = [
        { title: 'Type', value: 'typeId', width: '30%' },
        { title: 'ID', value: 'id', width: '30%' },
        { title: 'Status', value: 'status', width: '30%' },
        { title: '', value: 'actions', align: 'end' },
    ];

    const select = ref();
    const roles = [
        { title: 'Super User', value: 1 }, 
        { title: 'User', value: 2 }, 
        { title: 'Person', value: 3 }, 
    ];

    const saveChanges = () => {
        const id = person.value.id;
        const data = { role: select.value };

        groupServices.updateGroup(id, data)
        .then(() => {
            console.log("Group updated successfully: ", data);
        })
        .catch((error) => {
            message.value = error.response.data.message;
        })
    };

    const cancel = () => {
        select.value = getGroup();
        router.push({ name: "people" });
    };

    const viewAsset = () => {
        router.push({ name: "asset" }); //Chnage when page is made. 
    }
    
    onMounted(() => {
        user.value = Utils.getStore("user");
        const id = props.id;
        getGroup(id);
        getSomeone(id);
        getPersonsAssets(id);
    });
</script>

<template>
    <br><br>
    <v-card
    class="mx-auto"
    width="90%"
    height="71%"
    >
        <v-app
        class="layout">
            <v-toolbar>
                <v-toolbar-title>{{ person.fName + ' ' + person.lName }}</v-toolbar-title>
            </v-toolbar>
            <v-container
            class="v-container">
                <v-row style="height: 49%">
                    <v-col cols="3"
                    class="sidePanel">
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
                            color="#811429" 
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

                    <v-col cols="9"
                    style="height: 102%;">
                        <v-card class="list">
                        <v-card-title>Assets</v-card-title>
                            <v-data-table
                                v-model:page="page"
                                :headers="headers"
                                :items="personsAssets"
                                :items-per-page="10"
                            >
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-btn class="ma-2" color="primary" :icon="true" size="small" @click="viewAsset(item.id)">
                                    <v-icon>mdi-pencil</v-icon> 
                                </v-btn>
                            </template>
                                <template v-slot:bottom>
                                    <div class="text-center pt-2">
                                        <v-pagination v-model="page" :length="pageCount"></v-pagination>
                                    </div>
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
    height: 100%;
}
.layout{
    height: 1000px;
}
.sidePanel{
    height: 96%;
    justify-content: center;
    width: auto;
}
#btn{
    width: 49%;
    height: 10.5%;
    font-size: large;
}
.side{
    min-height: 70%;
    width: 100%;
}
.list{
    height: 150%;
    width: auto;
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