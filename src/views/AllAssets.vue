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
    if (search.value == "") search.value = null;
    // category=category name, type=type name, identifier=, location=building or person name
    
    const filters = [];

    search.value?.split(",").forEach(filter => {
        const filterNameToKey = {
            assetcategory: 'assetCategory',
            assetidentifier: 'assetIdentifier',
            assettype: 'assetType',
            category: 'assetCategory',
            identifier: 'assetIdentifier',
            location: 'location',
            type: 'assetType',
        };

        // Step 1: determine type of filter
        //  Types: =, != [equality], <, >, >=, <= [range]
        const isRange = /^[^<>=]*[^<>=\s][^<>=]*(((<=|>=)[\s\S]*\S\s*)|([<>]([^=\s]|[^=]\S)[\s\S]*))+$/i.test(filter);
        const isInequality = !isRange && /^[^<>=]*[^<>=\s][^<>=]*!=[\s\S]+$/i.test(filter);
        const isEquality = !isRange && !isInequality && /^[^<>=]*[^<>=\s][^<>=]*=[\s\S]+$/i.test(filter);
        let isAlert = false;
        
        if (!isRange && !isEquality && !isInequality)
        {
            filters.push(asset => {
                const filterTest = new RegExp(filter, "i");
                return filterTest.test(asset.assetCategory)
                || filterTest.test(asset.assetType)
                || filterTest.test(asset.assetIdentifier)
                || filterTest.test(asset.location)
                || asset.alerts.some(alert => filterTest.test(alert.type) || filterTest.test(alert.date));
            });
            return;
        }
        let filterKey = filter.match(/^[^<>=]*[^<>=\s!][^<>=!]*/i)?.[0]?.trim()?.toLowerCase();
        let filterValue = filter.match(isRange
        ? /(((<=|>=)[\s\S]*\S\s*)|([<>]([^=\s]|[^=]\S)[\s\S]*))+$/i
        : /(=[\s\S]+)$/i)?.[0] ?? "";
        
        // Step 2: determine if filter key is valid
        if (filterNameToKey?.[filterKey] === undefined)
        {
            if ((filterKey.match(/^\s*alerts\s*\.[\s\S]+/i)?.[0] ?? null) !== null)
            {
                filterKey = filterKey.match(/\.[\s\S]+$/i)[0].substring(1).trim();
                isAlert = true;
            }
            else return;
        }
        else filterKey = filterNameToKey[filterKey];

        // Step 3: create function which takes in the asset and outputs a boolean based on filter value and add it to filters
        if (isEquality)
        {
            filterValue = filterValue.replace(/^=/i, "")?.trim();
            filters.push(isAlert
                ? asset => asset.alerts.some(alert => new RegExp(`^${filterKey}$`, "i").test(alert.type) && new RegExp(filterValue, "i").test(alert.date))
                : asset => new RegExp(`^${asset[filterKey]}$`, "i").test(filterValue)
            );
        }
        else if (isInequality)
        {
            filterValue = filterValue.replace(/^=/i, "")?.trim();
            filters.push(isAlert
                ? asset => !asset.alerts.some(alert => new RegExp(`^${filterKey}$`, "i").test(alert.type) && new RegExp(filterValue, "i").test(alert.date))
                : asset => !(new RegExp(`^${asset[filterKey]}$`, "i").test(filterValue))
            );
        }
        else if (isRange)
        {
            const gte = [];
            const lte = [];
            const gt = [];
            const lt = [];

            while ((filterValue?.length ?? 0) > 0)
            {
                if (filterValue.startsWith(">="))
                {
                    filterValue = filterValue.substring(2);
                    const nextValue = filterValue.match(/[^<>=]+/i)?.[0];
                    if (nextValue !== undefined) gte.push(nextValue);
                    filterValue = filterValue.substring(nextValue?.length ?? 0);
                }
                else if (filterValue.startsWith("<="))
                {
                    filterValue = filterValue.substring(2);
                    const nextValue = filterValue.match(/[^<>=]+/i)?.[0];
                    if (nextValue !== undefined) lte.push(nextValue);
                    filterValue = filterValue.substring(nextValue?.length ?? 0);
                }
                else if (filterValue.startsWith(">"))
                {
                    filterValue = filterValue.substring(1);
                    const nextValue = filterValue.match(/[^<>=]+/i)?.[0];
                    if (nextValue !== undefined) gt.push(nextValue);
                    filterValue = filterValue.substring(nextValue?.length ?? 0);
                }
                else if (filterValue.startsWith("<"))
                {
                    filterValue = filterValue.substring(1);
                    const nextValue = filterValue.match(/[^<>=]+/i)?.[0];
                    if (nextValue !== undefined) lt.push(nextValue);
                    filterValue = filterValue.substring(nextValue?.length ?? 0);
                }
                else filterValue = filterValue.substring(1);
            }

            filters.push(
                ...gte.map(value => {
                    return isAlert
                    ? asset => asset.alerts.some(alert => new RegExp(`^${filterKey}$`, "i").test(alert.type) && `${alert.date}` >= value)
                    : asset => `${asset[filterKey]}` >= value;
                }),
                ...lte.map(value => {
                    return isAlert
                    ? asset => asset.alerts.some(alert => new RegExp(`^${filterKey}$`, "i").test(alert.type) && `${alert.date}` <= value)
                    : asset => `${asset[filterKey]}` <= value;
                }),
                ...gt.map(value => {
                    return isAlert
                    ? asset => asset.alerts.some(alert => new RegExp(`^${filterKey}$`, "i").test(alert.type) && `${alert.date}` > value)
                    : asset => `${asset[filterKey]}` > value;
                }),
                ...lt.map(value => {
                    return isAlert
                    ? asset => asset.alerts.some(alert => new RegExp(`^${filterKey}$`, "i").test(alert.type) && `${alert.date}` < value)
                    : asset => `${asset[filterKey]}` < value;
                }),
            );
        }
    });

    const result = (search.value ?? null) === null ? assets.value : assets.value.filter(asset => filters.every(filter => filter(asset)));

    // Sort the list to be organized a bit better (but still allow for manual re-sorting)
    result.sort((a, b) => {
        if (a.assetCategory > b.assetCategory) return 1;
        if (a.assetCategory < b.assetCategory) return -1;
        if (a.assetType > b.assetType) return 1;
        if (a.assetType < b.assetType) return -1;
        if (a.assetIdentifier > b.assetIdentifier) return 1;
        if (a.assetIdentifier < b.assetIdentifier) return -1;
        if (a.location > b.location) return 1;
        if (a.location < b.location) return -1;
        return 0;
    });

    return result;
});
const loadingAssets = ref(false);

const retrieveAssets = () => {
    loadingAssets.value = true;
    AssetServices.getAllAssets()
    .then(response => {
        assets.value = response.data.map(asset => {
            const result = {
                id: asset.id,
                assetCategory: asset.type.category.name,
                assetType: asset.type.name,
                assetIdentifier: asset.type.identifier?.assetData?.value,
                location: !!asset.location ? `${asset.location.building.abbreviation} ${asset.location.name}` : !!asset.borrower ? `Checked Out to ${asset.borrower.fName} ${asset.borrower.lName}` : `No location`,
                borrowerId: asset.borrower?.id,
                borrowerName: `${asset.borrower?.fName} ${asset.borrower?.lName}`,
                alerts: asset.alerts.map(alert => { return { id: alert.id, type: alert.type.name, date: format(alert.date) } }),
            };

            if ((result.borrowerId ?? null) !== null)
            {
                let parsedDate;
                try {
                    parsedDate = format(asset.dueDate);
                }
                catch {
                    parsedDate = "No Due Date";
                }

                result.alerts = [{ id: 'Due Date', type: 'Due By', date: parsedDate }, ...result.alerts];
            }

            return result;
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

const checkInAsset = (assetId) => {
    console.log("Checking in asset with id of " + assetId);
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
                            clearable
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
                <template v-slot:item.location="{ item }">
                    <td v-if="(item.borrowerId ?? null) !== null">
                        {{ item.location.substring(0, item.location.length - item.borrowerName.length) }}
                        <router-link :to="router.resolve({ name: 'person', params: { id: item.borrowerId }})">
                            {{ item.borrowerName }}
                        </router-link>
                    </td>
                    <td v-else>
                        {{ item.location }}
                    </td>
                </template>
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
                        v-if="(item.borrowerId ?? null) !== null"
                        class="ma-2"
                        color="accent"
                        @click="checkInAsset(item.id)"
                    >
                        Check In
                    </v-btn>
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