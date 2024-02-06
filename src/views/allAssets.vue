<script setup>

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Utils from "../config/utils.js";

const router = useRouter();
const user = Utils.getStore("user");
const message = ref("Everything is working");

const asset = ref({
    id: ref(),
    returnDate: ref(),
    borrowerId: ref(),
    type: ref(""),
    catergory: ref(""),
})


const getAssets = () => {
    const data = {
        id: asset.value.id,
        returnDate: asset.value.returnDate,
        borrowerId: asset.value.borrowerId,
    };
};


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
                    <b>{{ message }}</b>
                    <h4>{{ user.fName }}</h4>
                </v-card-text>

                <v-row justify="flex-end">  
                    <v-btn class="mx-2" color="secondary" @click="saveChanges">Add Asset</v-btn>
                </v-row>

                <br>

                <v-table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Return Date</th>
                            <th>Current Owner</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(asset, index) in assets" :key="index">
                            <td>{{ `${asset.id}` }}</td>
                            <td>{{ `${asset.returnDate}`}}</td>
                            <td>{{ `${asset.borrowerId}`}}</td>
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