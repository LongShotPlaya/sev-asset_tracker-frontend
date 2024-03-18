<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import peopleServices from "../services/personServices";
import assetServices from "../services/assetServices.js";

const message = ref("");
const person = ref("");
const personsAssets = ref([]);

const props = defineProps({
  id: {
    required: true,
  },
});

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
        personsAssets.value = response.data.filter(asset => asset.borrowerId === id);
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

onMounted(() => {
    const id = props.id; 
    getSomeone(id);
    getPersonsAssets(id);
});
</script>

<template>
    <br><br>
    <v-card
    class="mx-auto"
    max-width="90%"
    max-height="75%"
    >
        <v-app>
            <v-toolbar>
                <v-toolbar-title>{{ person.fName + ' ' + person.lName }}</v-toolbar-title>
            </v-toolbar>

            <v-container>
                <v-row>
                    <v-col cols="3">
                        <v-card class="side">
                            <v-card-title>Person Role: {{ person.id }}</v-card-title>
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
                        :items-per-page="5"
                        :hide-default-footer="true"
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