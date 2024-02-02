<script setup>

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = Utils.getStore("user");
const message = ref("");

const id = ref();
const search = ref("");
const assets = ref([]);
const name = ref("");
const type = ref("");
const catergory = ref("");


onMounted();

</script>

<template>
    <v-container>
		<v-toolbar>
			<v-toolbar-title>{{ user + " All Assets" }}</v-toolbar-title>
		</v-toolbar>

        <!--List of all assets-->
            <div class="container">
                <v-form ref="form" v-model="valid" lazy validation>
                    <v-text-field required v-model="asset.id" id="id" label="ID">

                    </v-text-field>
                    <v-text-field required v-model="asset.name" id="name" label="Name">

                    </v-text-field>
                    <v-text-field required v-model="asset.type" id="type" label="Type">

                    </v-text-field>
                    <v-text-field required v-model="asset.catergory" id="catergory" label="Catergory">

                    </v-text-field>
                </v-form>
            </div>
    </v-container>
</template>

<style>

</style>