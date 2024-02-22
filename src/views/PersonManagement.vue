<script setup>

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Utils from "../config/utils.js";
import peopleServices from "../services/personServices";

const router = useRouter();
const user = Utils.getStore("user");
const message = ref("");
const search = ref("");
const person = ref("");
let people = ref([]);

const getPeople = () => { 
  peopleServices.getAllPeople()
    .then((response) => {
      person.value = response.data;
      people.value = response.data;
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

onMounted(() => {
  user.value = Utils.getStore("user");
  getPeople();
});

</script>

<template>
  <v-card
  flat
  title="People" class="title"
  >
    <v-text-field
      v-model="search"
      label="Search"
      prepend-inner-icon="mdi-magnify"
      single-line
      variant="outlined"
      hide-details
    ></v-text-field>
</v-card>


<v-card class="table">
    <v-table>
      <thead>
        <tr>
          <th class="text-left column">
            Name
          </th>
          <th class="text- column">
            Email
          </th>
          <th class="text-left column">
            Other Things...
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="person in people" :key="person.id">
          <td class="column">{{ person.fName + ' ' + person.lName}}</td>
          <td class="column">{{ person.email }}</td>
          <td class="column">
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card> 
    
</template>

<style scoped>
    .title{
      padding-left: 5%;
      padding-right: 5%;
    }
    .table{
      margin-left: 5%;
      margin-right: 5%;
      margin-top: 1%;
    }

</style>