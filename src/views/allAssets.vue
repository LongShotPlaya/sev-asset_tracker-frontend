<script setup>

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Utils from "../config/utils.js";

const router = useRouter();
const user = Utils.getStore("user");
const message = ref("Everything is working");
const searchTerm = ref("");

const asset = ref({
    id: null,
    type: "",
    category: "",
    status: "",
    borrowerId: "",
    locationId: "",
});

const addAsset = () => {
    router.push({name: "/addAsset"});
}


onMounted(() => {
    user.value = Utils.getStore("user");
});

</script>

<template>
    <v-container>
		<v-toolbar>
			<v-toolbar-title>{{ "All Assets" }}</v-toolbar-title>
		</v-toolbar>

        <!--List of all assets-->
            <v-card>
                <v-card-text>
                </v-card-text>

                <v-row class="bar">  
                    <v-col cols="9">
                        <input v-model="searchTerm" @input="search" placeholder="Search" class="searchBar">
                    </v-col>

                    <v-col cols="3" class="d-flex justify-end">
                        <v-btn class="mx-2" color="primary" @click="addAsset">Add Asset</v-btn>
                    </v-col>
                </v-row>
            <br>
                <v-table>
                    <thead>
                            <tr>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Current Owner</th>
                                <th>Current Location</th>                            
                            </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(asset, index) in assets" :key="index">
                            <td>{{ `${asset.id}` }}</td>
                            <td>{{ `${asset.type}` }}</td>
                            <td>{{ `${asset.category}`}}</td>
                            <td>{{ `${asset.status}` }}</td>
                            <td>{{ `${asset.borrowerId}` }}</td>
                            <td>{{ `${asset.locationId}`}}</td>
                        </tr>
                    </tbody>
                </v-table>
                <v-card-text>
                    <b>{{ message }}</b>
                </v-card-text>
            </v-card>
    </v-container>
</template>

<style>
    .searchBar{
        padding-top: 1%; 
        padding-bottom: 1%; 
        padding-left: 1%;
        margin-top: 0.5%;
        border-style: solid;
        border-color: rgb(219, 219, 219);
        border-radius: 6px;
        box-shadow: 2px 2px 2px 0px rgb(174, 174, 174);        
        
    }
    .bar{
        padding-left: 5%; 
        padding-right: 4%;
    }

</style>