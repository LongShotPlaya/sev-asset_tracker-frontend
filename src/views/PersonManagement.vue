<script setup>

import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import Utils from "../config/utils.js";
import peopleServices from "../services/personServices";

const router = useRouter();
const user = Utils.getStore("user");
const message = ref("");
const search = ref("");
const person = ref("");
let people = ref([]);
const filteredPeople = ref([]);
const selectedPerson = ref(null);

const openDialog = (person) => {
  selectedPerson.value = person;
}

const getPeople = () => { 
  peopleServices.getAllPeople()
    .then((response) => {
      const sortedPeople = response.data.sort((a, b) => {
        return a.lName.localeCompare(b.lName);
      });
      person.value = response.data;
      people.value = response.data;
      filterPeople();
      console.log(response.data);
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

const filterPeople = () => {
  if (!search.value.trim()) {
    filteredPeople.value = people.value.filter(person => {
      return person.fName.toLowerCase().includes(search.value.trim().toLowerCase()) ||
             person.lName.toLowerCase().includes(search.value.trim().toLowerCase());
    });
  } 
  else {
      filteredPeople.value = people.value.filter(person => {
        return person.fName.toLowerCase().includes(search.value.trim().toLowerCase()) ||
               person.lName.toLowerCase().includes(search.value.trim().toLowerCase()) ||
               person.email.toLowerCase().includes(search.value.trim().toLowerCase());
      });
  }
};

onMounted(() => {
  user.value = Utils.getStore("user");
  getPeople();
});

watch(search, filterPeople);
</script>

<template>
  <v-toolbar>
    <v-toolbar-title>Find People</v-toolbar-title>
  </v-toolbar>
  <br>
  <v-card
  flat
  title="" class="title"
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
      <thead class="header">
        <tr>
          <th>
            <h4>Last Name</h4>
          </th>
          <th>
            <h4>First Name</h4>
          </th>
          <th>
            <h4>ID Number</h4>
          </th>
          <th>
            <h4>Email</h4>
          </th>
          <th>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="person in filteredPeople" :key="person.id" @click="openDialog(person.id)">
          <td class="column">{{ person.lName}}</td>
          <td class="column">{{ person.fName}}</td>
          <td class="column">{{ person.id }}</td>
          <td class="column">{{ person.email }}</td>
          <td class="column" style="text-align: right; padding-right: .5%;"><v-btn color="primary" @click="">
              View
          </v-btn></td>
        </tr>
      </tbody>
    </v-table>
  </v-card> 
    
</template>

<style>
    .title{
      padding-left: 5%;
      padding-right: 5%;
    }
    .table{
      margin-left: 5%;
      margin-right: 5%;
      margin-top: 1%;
      margin-bottom: 20%;
      border-radius: 5px;
    }
    .header{
      background-color: #811429;
    }
    .header h4{
      color: white;
    }
    /* .button-column{
      text-align: right;
    } */
</style>