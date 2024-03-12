<script setup>
import { ref, onMounted, defineProps } from "vue";
import { useRouter } from "vue-router";
import Utils from "../config/utils.js";
import peopleServices from "../services/personServices";

const message = ref("");
const person = ref(null);

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

onMounted(() => {
    const id = props.id; 
    getSomeone(id);
})


</script>

<template>
    <v-card
    class="mx-auto"
    max-width="90%"
    max-height="60%"
    >
        <v-app>
            <v-toolbar>
                <v-toolbar-title>Found Person</v-toolbar-title>
            </v-toolbar>


        </v-app>
    </v-card>
</template>

<style scoped>

</style>