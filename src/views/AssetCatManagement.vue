<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-title>Manage Asset Categories</v-toolbar-title>
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
            <v-btn color="primary" size="x-large" @click="addAssetCats">
              Add Category
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-data-table
        :headers ="headers"
        :items ="searchResults"
        item-key ="id"
        :sort-by="[{ key: 'name', order: 'asc' }]"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn class="ma-2" color="primary" icon="mdi-pencil" @click="openDialog(item)">
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

  <!-- delete pop-up -->
  <v-dialog v-model="deleteDialogue" persistent max-width="800px">
    <v-card>
      <v-container>
        <v-card-title class="text-h5, space2" align="center">Are you sure you want to delete asset category "{{ item.name }}"?</v-card-title>
        <v-row justify="center">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="tertiary" variant="outlined" @click="deleteAssetCats">
              Yes
            </v-btn>
            <v-btn color="primary" variant="flat" @click="closeDialog">
              No
            </v-btn>
          </v-card-actions>
        </v-row>
        
      </v-container>
    </v-card>
  </v-dialog>

  <!-- edit pop-up -->
  <v-dialog v-model="dialog" persistent max-width="800px">  
    <AssetCatAddEdit :item="item" @close="closeDialog" :save-function="saveAssetCat" :edit-function="editAssetCat"/> 
  </v-dialog>
</template>



<script setup>
import Utils from "../config/utils.js";
import CatServices from "../services/assetCatServices.js";
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import AssetCatAddEdit from "../components/AssetCatAddEdit.vue"; 

const assetcategories = ref([]);
const dialog = ref(false);
const deleteDialogue = ref(false);
const item = ref({});
const search = ref("");
const searchResults = computed(() => assetcategories.value.filter(cat => {
  return new RegExp(search.value, "i").test(cat.name)
  || new RegExp(search.value, "i").test(cat.description);
}));


const router = useRouter();
const tutorials = ref([]);
const user = Utils.getStore("user");
const message = ref("Search, Edit or Delete Categories");


const updateAssetCats = async (id) => {
  const data = {
    name: assetcategories.value.name,
    description: assetcategories.value.description,
  };
  try {
    const response = await CatServices.update(props.id, data);
    assetcategories.value.id = response.data.id; //check to see if the cat id matches the responce id
    router.push({ name: "asset-categories" });  //then push the reponse to asset cat
  } catch (e) {
    message.value = e.response.data.message;
  }
  closeDialog();
};

const addAssetCats = (data) => {
  openDialog({});
};

// save function
const saveAssetCat = async (newItemData) => {
  retrieveAssetCats();
};

//edit function 
const editAssetCat = (itemData) => {
  console.log('Editing asset:', itemData);
  closeDialog(); 
};


const deleteAssetCats = () => {
  if(!isNaN(parseInt(item.value.id))){
    CatServices.deleteAssetCat(item.value.id)
      .then(() => {
        retrieveAssetCats();
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



const retrieveAssetCats = () => {
  CatServices.getAllAssetCats()
    .then((response) => {
      assetcategories.value = response.data;
      assetcategories.value.sort((a, b) => a.name.localeCompare(b.name));
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

const openDialog = (itemData) => { 
  const newItem = { ...itemData }; // Copy the item data 
  item.value = newItem;  // Update the item value with the new copy
  dialog.value = true;
}

const openDeleteDialogue = (itemId) =>{
  item.value = assetcategories.value?.find(cat => cat.id == itemId);
  deleteDialogue.value = true;
}

const closeDialog = () => {
  dialog.value = false;
  deleteDialogue.value = false;
  setTimeout(() => item.value = {}, 150);
}

const headers = [
  {title: 'Name', value: 'name', sortable: true },
  {title: 'Description', value: 'description', sortable: true },
  {title: '', value: 'actions', align: 'end', sortable: false},
];


onMounted(() => {
  retrieveAssetCats();
}) 

</script>

<style>
  th.column,
  td.column{
    width: 33.3%;
  }
  .space{
    padding-left: 5%;
    padding-right: 5%;
    margin-top: 1%;
  }

  .space2{
    margin-bottom: 4%;
    margin-top: 1%;
  }

  .fontcolor{
    color: rgb(255, 255, 255);
  }
</style>
