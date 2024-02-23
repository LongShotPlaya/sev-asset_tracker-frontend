<script setup>
    import { ref } from 'vue';
    import peopleServices from "../services/personServices";

    const dialog = ref(false);
    const editedPerson = ref({...props.person});

    const props = defineProps({
        person: Object, 
    });

    const saveChanges = () => {
        peopleServices.updatePerson()
        .then((response) => {
            person.value = response.data,
            people.value - response.data;
        })
        .catch((e) => {
            MessageChannel.value = e.response.data.message;
        })
        console.log('Saved Changes: ', editedPerson.value);
        dialog.value = false;
    };

    
</script>

<template>
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
        <v-card-title>Edit Person</v-card-title>
        <v-card-text>
            <v-text-field v-model="editedPerson.fName" label="First Name"></v-text-field>
            <v-text-field v-model="editedPerson.lName" label="Last Name"></v-text-field>
            <v-text-field v-model="editedPerson.email" label="Email"></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" @click="saveChanges">Save</v-btn>
            <v-btn color="error" @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>
  