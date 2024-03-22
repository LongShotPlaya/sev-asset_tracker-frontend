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
    
    const getPersonsAssets = () => { 
        assetServices.getAllAssets()
        .then((response) => {
            // personsAssets.value = response.data.filter(asset => asset.borrowerId === id); //Find to assets with borrowerId of id
            personsAssets.value = response.data;
            console.log("Person's Assets: ", personsAssets);
        })
        .catch((error) => {
            message.value = error.response.data.message;
        })
    };
    
    //Asset data table
    const headers = [
        { title: 'ID', value: 'id' },
        { title: 'Condition', value: 'condition' },
        { title: 'Type', value: 'typeId' },
        { title: 'BorrowerId', value: 'borrowerId' },
        { title: '', value: 'actions', align: 'end' },
    ];

    const select = ref();
    const roles = ['Super User', 'User', 'Person'];

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
    height="73%"
    >
        <v-app
        class="layout">
            <v-toolbar>
                <v-toolbar-title>{{ person.fName + ' ' + person.lName }}</v-toolbar-title>
            </v-toolbar>
            <v-container
            class="v-container">
                <v-row>
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
                    style="height: 100%;">
                        <v-card class="list">
                        <v-card-title>Assets</v-card-title>
                            <v-data-table
                                :headers="headers"
                                :items="personsAssets" 
                                loading-text="Loading... Please wait">
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
}
.layout{
    height: 100%;
    min-height: 900px;
}
.sidePanel{
    height: 400px;
    justify-content: center;
    width: auto;
}
#btn{
    width: 49%;
    height: 10%;
    font-size: large;
}
.side{
    min-height: 70%;
    width: 100%;
}
.list{
    height: 160%;
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