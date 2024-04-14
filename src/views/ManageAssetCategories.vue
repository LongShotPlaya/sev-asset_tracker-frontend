<template>
  <v-container class="space">
    <v-toolbar>
      <v-toolbar-title>Manage Asset Categories</v-toolbar-title>
    </v-toolbar>
    <br>
    <v-row>
      <v-spacer></v-spacer>
      <v-col align="right">
        <v-btn color="primary" @click="openDialog(null)">
          Add
        </v-btn>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col>
        <v-card>
          <v-data-table
            :headers ="headers"
            :items ="assetcategories"
            item-key ="id"
          >

            <template v-slot:[`item.actions`]="{ item }">
              <v-btn class="ma-2" color="primary" icon="mdi-pencil" size="small" @click="openDialog(item.id)">
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
      </v-col>
    </v-row>
  </v-container>
  
  <!-- add pop-up -->
  <v-dialog v-model="addDialogue" persistent max-width="800px">
  
<!--Call the AssetCatAddEdit component-->
  <v-dialog v-model="dialog" persistent max-width="800px">  
    <AssetCatAddEdit :item="item" @close="closeDialog" :save-function="saveAssetCat" :edit-function="editAssetCat"/> 
  </v-dialog>
    <v-card>
      <v-container>
        <v-card-title class="text-h5">Add</v-card-title>
        <v-text-field
          v-model="item.name"
          id="name"
          :counter="50"
          label="Name"
          required
        ></v-text-field>
        
        <v-textarea
          v-model="item.description"
          id="description"
          :counter="50"
          label="Description"
          required
        ></v-textarea>
      
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="outlined" @click="addAssetCats">
            Save
          </v-btn>
          <v-btn color="grey-darken-3" variant="outlined" @click="closeDialog">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>

  <!-- delete pop-up -->
  <v-dialog v-model="deleteDialogue" persistent max-width="800px">
    <v-card>
      <v-container>
        <v-card-title class="text-h5, space2" align="center">Are you sure you want to delete this category?</v-card-title>
        <v-row justify="center">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="outlined"  @click="deleteAssetCats">
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

  <!-- edit pop-up -->
  <v-dialog v-model="editDialogue" persistent max-width="800px">
    
    <v-card>
      <v-container>
        <v-card-title class="text-h5">Edit</v-card-title>
        <v-text-field
          v-model="item.name"
          id="name"
          :counter="50"
          label="Name"
          required
        ></v-text-field>
        
        <v-textarea
          v-model="item.description"
          id="description"
          :counter="50"
          label="Description"
          required
        ></v-textarea>
      
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" variant="outlined" @click="updateAssetCats">
            Save
          </v-btn>
          <v-btn color="grey-darken-3" variant="outlined" @click="closeDialog">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog> -->

  <v-btn color="primary" @click="addAssetCats">
    Add
  </v-btn>
</template>



<script setup>
import Utils from "../config/utils.js";
import CatServices from "../services/assetCatServices.js";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
// import AssetCatAddEdit from "../components/AssetCatAddEdit.vue"; 

const assetcategories = ref([]);
const editDialogue = ref(false)
const addDialogue = ref(false)
const deleteDialogue = ref(false)
const item = ref({})




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
    router.push({ name: "asset-category" });  //then push the reponse to asset cat
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
      const allItems = response.data;
      assetcategories.value = response.data;
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
  editDialogue.value = false;
  addDialogue.value = false;
  deleteDialogue.value = false;
  item.value = {}; // Reset item
}

const headers = [
  {title: 'Name', value: 'name'},
  {title: 'Description', value: 'description'},
  {title: '', value: 'actions', align: 'end'},
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
