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

const viewPerson = (id) => {
  router.push({ name: 'person', params: { id }});
}


const headers = [
  { title: 'Last Name', value: 'lName', width: '20%' },
  { title: 'First Name', value: 'fName', width: '20%' },
  { title: 'ID', value: 'id', width: '20%' },
  { title: 'Email', value: 'email', width: '20%' },
  { title: '', value: 'actions', align: 'end' },
];

onMounted(() => {
  user.value = Utils.getStore("user");
  getPeople();
});

watch(search, filterPeople);
</script>

<template>
  <v-app>

  <v-card flat title="" class="title">
    <v-toolbar>
      <v-toolbar-title>Find Person</v-toolbar-title>
    </v-toolbar>
    <br>

    <v-text-field class="searchBar"
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
    >
        <template v-slot:[`item.actions`]="{ item }">
            <v-btn class="ma-2" color="primary" :icon="true" size="small" @click="viewPerson(item.id)">
                <v-icon>mdi-pencil</v-icon> 
            </v-btn>
        </template>
  </v-data-table>
  </div>
</v-app>

</template>

<style>
.searchBar{
  margin-left: 5%;
  margin-right: 5%;
}
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
