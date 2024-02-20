<script setup>

import { ref, onMounted } from "vue";
// import { useRouter } from "vue-router";
import Utils from "../config/utils.js";
import peopleServices from "../services/personServices";

// const router = useRouter();
const user = Utils.getStore("user");
const message = ref("Everything is working");
const search = ref("");
const headers = ref("");
let people = [];
const person = ref("");

const desserts = ref("");

const getAllPeople = () => {
  people = [];
  peopleServices.getAllPeople()
    .then((response) => {
      person.value = response.data;
      person.value.forEach((currentPerson) => {
        people.push(currentPerson.role);
      });
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

onMounted(() => {
  user.value = Utils.getStore("user");
  getAllPeople();
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

  <v-data-table
    :headers="headers"
    :items="desserts"
    :search="search"
  ></v-data-table>
</v-card>

            
    
</template>

<style scoped>
    .title{
        padding-left: 5%;
        padding-right: 5%;
    }

</style>