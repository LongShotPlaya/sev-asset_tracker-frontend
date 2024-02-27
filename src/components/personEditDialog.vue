<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps(['person', 'dialogVisible']);
const { emit } = defineEmits(['openDialog', 'closeDialog']);

const openDialog = () => {
    emit('openDialog');
};

const closeDialog = () => {
    emit('closeDialog');
};
</script>


<template>
    <v-dialog max-width="800px">
        <v-btn flat slot="activator" class="success">View</v-btn>
        <v-card>
            <v-card-title>
                <h2>Title</h2>
            </v-card-title>
            <!-- For goes here -->
        </v-card>
    </v-dialog>
</template>