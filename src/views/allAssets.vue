<script setup>
import AssetServices from "../services/assetServices";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { format } from "@formkit/tempo";

const router = useRouter();

const headers = [
    {
        title: "Category",
        key: "assetCategory",
        sortable: true,
    },
    {
        title: "Type",
        key: "assetType",
        sortable: true,
    },
    {
        title: "Identifier",
        key: "assetIdentifier",
        sortable: true,
    },
    {
        title: "Location",
        key: "location",
        sortable: true,
    },
    {
        title: "Alerts",
        key: "data-table-expand",
        align: "end",
        sortable: false,
    },
    {
        title: "",
        key: "actions",
        align: "end",
        sortable: false,
    },
];
const search = ref(null);

const assets = ref([]);
const filteredAssets = computed(() => {
    return assets.value;
});
const loadingAssets = ref(false);

const retrieveAssets = () => {
    loadingAssets.value = true;
    AssetServices.getAllAssets()
    .then(response => {
        assets.value = response.data.map(asset => {
            return {
                id: asset.id,
                assetCategory: asset.type.category.name,
                assetType: asset.type.name,
                assetIdentifier: asset.type.identifier?.assetData,
                location: !!asset.location ? `${asset.location.building.abbreviation} ${asset.location.name}` : `No location`,
                alerts: asset.alerts.map(alert => { return { id: alert.id, type: alert.type.name, date: format(alert.date) } }),
            };
        });
        loadingAssets.value = false;
    })
    .catch(err => {
        console.log(err?.data?.response?.message ?? "Error retrieving asset categories!");
        loadingAssets.value = false;
    });
};

const addAsset = () => {
    console.log("Trying to add an asset!");
};

const editAsset = (assetId) => {
    console.log("Editing asset with id of " + assetId);
};

const deleteAsset = (assetId) => {
    AssetServices.deleteAsset(assetId)
    .then(response => {
        retrieveAssets();
    })
    .catch(err => {
        console.log(err?.data?.response?.message ?? "Error deleting asset!");
    });
};

retrieveAssets();
</script>

<template>
    <v-container>
        <v-toolbar>
            <v-toolbar-title>All Assets</v-toolbar-title>
        </v-toolbar>
        <br>
        <v-card>
            <v-container>
                <v-row>
                    <v-col>
                        <v-text-field
                            v-model="search"
                            label="Search"
                            prepend-inner-icon="mdi-magnify"
                            variant="outlined"
                            hide-details
                            single-line
                            full-width
                        />
                    </v-col>
                </v-row>
                <v-row justify="end">
                    <v-col class="text-right">
                        <v-btn
                            color="primary"
                            size="large"
                            @click="addAsset"
                        >Add Asset</v-btn>
                    </v-col>
                </v-row>
            </v-container>
            <v-data-table
                :loading="loadingAssets"
                :headers="headers"
                :items="filteredAssets"
            >
                <template v-slot:expanded-row="{ columns, item }">
                    <tr
                        v-for="alert in item.alerts"
                        :key="alert.id"
                        style="background-color: rgb(var(--v-theme-secondary));"
                    >
                        <td>{{ alert.type }}</td>
                        <td>{{ alert.date }}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-btn
                        class="ma-2"
                        color="primary"
                        icon="mdi-pencil"
                        @click="editAsset(item.id)"
                    />
                    <v-btn
                        class="ma-2"
                        color="primary"
                        variant="outlined"
                        icon="mdi-trash-can"
                        @click="deleteAsset(item.id)"
                    />
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<style>
</style>