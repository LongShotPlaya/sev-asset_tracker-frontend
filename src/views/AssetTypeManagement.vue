<script setup>
import Utils from "../config/utils.js";
import TypeServices from "../services/assetTypeManagementServices.js";
import CatServices from "../services/assetCatServices.js";
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { format } from "@formkit/tempo";

const assetTypes = ref([]);
const assetcategories = ref([]);
const deleteDialogue = ref(false);
const item = ref({});
const search = ref("");
const searchResults = computed(() => assetTypes.value.filter(type => {
  return new RegExp(search.value, "i").test(type.name)
  || new RegExp(search.value, "i").test(type.circulatable)
  || new RegExp(search.value, "i").test(type.categoryName);
}))

const router = useRouter();
const user = Utils.getStore("user");
const message = ref("Search, Edit or Delete Tutorials");
const headers = [
    {title: 'Name', value: 'name', sortable: true },
    {title: 'Circulatable', value: 'circulatable', sortable: true },
    // {title: 'Created', value: 'createdAt', sortable: true },
    {title: 'Category', value: 'categoryName', sortable: true },
    {title: '', value: 'actions', align: 'end'},
];

const updateAssetTypes = async (id) => {
  const data = {
    name: assetTypes.value.name,
    description: assetTypes.value.description,
  };
  try {
    const response = await TypeServices.update(props.id, data);
    assetTypes.value.id = response.data.id;
    router.push({ name: "asset-type" });
  } catch (e) {
    message.value = e.response.data.message;
  }
};

const addAssetType = (data) => {
  router.push({ name: "asset-type", params: { assetId: props.id } });
};

const deleteAssetTypes = () => {
  if(!isNaN(parseInt(item.value.id))){
    TypeServices.deleteAssetType(item.value.id)
      .then(() => {
        retrieveAssetTypes();
        deleteDialogue.value = false;
      })
      .catch((e) => {
        message.value = e.response.data.message;
        deleteDialogue.value = false;
      });
  }
  else{
    deleteDialogue.value = false;
  }
};

const openDeleteDialogue = (itemId) =>{
  item.value = assetTypes.value?.find(cat => cat.id == itemId);
  deleteDialogue.value = true;
}

const closeDialog = () => {
  deleteDialogue.value = false;
  item.value = {}; // Reset item
}

const addEditLink = (id) => {
    router.push({
        name: "asset-type-edit",
        params: {id},
    });
}

const retrieveAssetTypes = async () => {
  assetcategories.value = (await CatServices.getAllAssetCats())?.data;
  if(!assetcategories.value){
    console.log("error getting asset categories")
    return 
  }
    
  TypeServices.getAllAssetTypes()
    .then((response) => {
      assetTypes.value = response.data;
      assetTypes.value = assetTypes.value.map(assetType => {
        return {
          ...assetType,
          categoryName: assetcategories.value.find(cat => cat.id == assetType.categoryId)?.name,
          createdAt: format(assetType.createdAt, "YYYY-MM-DD"),
        };
      });
      assetTypes.value.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
    })
    .catch((e) => {
        console.log(e)
      message.value = e.response.data.message;
    });
};

// const openDialog = (itemId) => {
//   if (itemId != undefined && itemId != null){
//     item.value = assetTypes.value?.find(cat => cat.id == itemId);
//     editDialogue.value = true;
//   }
//   else {
//     addDialogue.value = true;
//   }
// }


// const closeDialog = () => {
//   editDialogue.value = false;
//   addDialogue.value = false;
//   item.value = {}; // Reset item
// }


onMounted(() => {
    retrieveAssetTypes();
}) 
</script>

<template>
  <v-container>  
    <v-toolbar>
        <v-toolbar-title>Asset Type Management</v-toolbar-title>
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
        <v-row>
          <v-spacer></v-spacer>
          <v-col align="right">
            <v-btn color="primary" size="x-large" @click="router.push({ name: 'asset-type-add' })">
              Add Asset Type
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-data-table
        :headers ="headers"
        :items ="searchResults"
        item-key ="id"
      >

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn class="ma-2" color="primary" icon="mdi-pencil" @click="addEditLink(item.id)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            class="ma-2"
            color="primary"
            variant="outlined"
            icon="mdi-trash-can"
            @click="openDeleteDialogue(item.id)"
            ></v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>

<!-- Delete Dialog -->
  <v-dialog v-model="deleteDialogue" persistent max-width="800px">
    <v-card>
      <v-container>
        <v-card-title class="text-h5, space2" align="center">Are you sure you want to delete this type?</v-card-title>
        <v-row justify="center">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="outlined"  @click="deleteAssetTypes">
              Yes
            </v-btn>
            <v-btn color="grey-darken-3" variant="outlined" @click="closeDialog">
              No
            </v-btn>
          </v-card-actions>
        </v-row>
        
      </v-container>
    </v-card>
  </v-dialog>
</template>

<style>
    th.column,
    td.column{
        width: 33.3%;
    }
</style>