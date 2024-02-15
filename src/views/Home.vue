<script setup>
import Utils from "../config/utils.js";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = Utils.getStore("user");
const message = ref("");

</script>

<template>
  <div>
    <v-container>
        <v-btn></v-btn>
    </v-container>
  </div>
</template>