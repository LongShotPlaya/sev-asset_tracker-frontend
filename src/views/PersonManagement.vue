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

const getPeople = () => { 
  peopleServices.getAllPeople()
    .then((response) => {
      const sortedPeople = response.data.sort((a, b) => {
        return a.lName.localeCompare(b.lName);
      });
      person.value = response.data;
      people.value = response.data;
      filterPeople();
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
    const searchString = search.value.trim().toLowerCase();
      filteredPeople.value = people.value.filter(person => {
        const idString = person.id.toString().toLowerCase();
        return person.fName.toLowerCase().includes(searchString) ||
               person.lName.toLowerCase().includes(searchString) ||
               person.email.toLowerCase().includes(searchString) ||
               idString.includes(searchString) ||
               idString.endsWith(searchString);
      });
  }
};

const headers = [
  { text: 'Last Name', value: 'lName' },
  { text: 'First Name', value: 'fName' },
  { text: 'ID', value: 'id' },
  { text: 'Email', value: 'email' },
];

onMounted(() => {
  user.value = Utils.getStore("user");
  getPeople();
});

watch(search, filterPeople);
</script>

<template>
  <v-app>
  <v-toolbar>
    <v-toolbar-title>Find People</v-toolbar-title>
  </v-toolbar>

  <v-card flat title="" class="title">
    <v-text-field
      v-model="search"
      label="Search"
      prepend-inner-icon="mdi-magnify"
      single-line
      variant="outlined"
      hide-details
    ></v-text-field>
  </v-card>

  <div class="table">
    <v-data-table
      :headers="headers"
      :items="filteredPeople"
      item-key="id"
      ></v-data-table>
  </div>
</v-app>

</template>

<style scoped>
.title {
  padding-left: 5%;
  padding-right: 5%;
}
.table {
  margin-top: 1%;
  padding-left: 5%;
  padding-right: 5%;
}
</style>
