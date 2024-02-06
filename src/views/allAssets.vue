<script setup>

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Utils from "../config/utils.js";

const router = useRouter();
const user = Utils.getStore("user");
const message = ref("Everything is working");

const asset = ref({
    id: null,
    type: "",
    catergory: "",
    status: "",
    borrowerId: "",
    locationId: "",
});

const addAsset = () => {
    router.push({name: "addAsset"}); //Route to add asset page
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
                    <!-- <b>{{ message }}</b>
                    <h4>{{ user.fName }}</h4> -->
                </v-card-text>

                <v-row justify="end" style="padding-right: 4%">  
                    <v-btn class="mx-2" color="primary" @click="addAsset">Add Asset</v-btn>
                </v-row>
            <br>
                <v-table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>type</th>
                            <th>Catergory</th>
                            <th>Status</th>
                            <th>Current Owner</th>
                            <th>Current Location</th>                            
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(asset, index) in assets" :key="index">
                            <td>{{ `${asset.id}` }}</td>
                            <td>{{ `${asset.type}` }}</td>
                            <td>{{ `${asset.catergory}`}}</td>
                            <td>{{ `${asset.status}` }}</td>
                            <td>{{ `${asset.borrowerId}` }}</td>
                            <td>{{ `${asset.LocationId}`}}</td>
                        </tr>
                    </tbody>
                </v-table>

                <v-table>

                </v-table>
            </v-card>
    </v-container>
</template>

<style>

</style>