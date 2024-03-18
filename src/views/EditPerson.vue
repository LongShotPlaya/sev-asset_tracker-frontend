<script setup>
import { ref, onMounted, defineProps } from "vue";
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

onMounted(() => {
    const id = props.id; 
    getSomeone(id);
    getPersonsAssets(id);
});

//Asset data table
const headers = ref([
    { title: 'Asset Name', value: 'id' },
]);
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
                        <v-card class="first">
                            <v-card-title>Person Role: {{ person.id }}</v-card-title>
                            <v-divider></v-divider>
                            <table id="contact">
                                <tr>
                                    <td>ID Number: </td>
                                    <td>{{ person.id }}</td>
                                </tr>
                                <tr>
                                    <td>Email: </td>
                                    <td>{{ person.email }}</td>
                                </tr>
                            </table>
                        </v-card>
                        <br>

                        <v-card class="last">
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
                        :items="items"
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

.first{
    min-height: 288px;
}
.list{
    min-height: 600px;
}
.last{
    min-height: 288px;
}
#contact{
    margin: 5%;
}
#block3txt{

}

</style>