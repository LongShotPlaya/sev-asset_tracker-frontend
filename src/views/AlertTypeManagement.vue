<script setup>
import Utils from "../config/utils.js";
import alertTypeServices from "../services/alertTypeService";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
 

const alertTypes = ref([]);
const dialog = ref(false);
const deleteDialogue = ref(false)
const editDialogue = ref(false)
const addDialogue = ref(false)
const item = ref({})


const router = useRouter();
const user = Utils.getStore("user");
const message = ref("Add, Edit or Delete alert types");


const updateAlertTypes = (id) => {
    console.log(id);
  const data = {
    name: item.value.name,
  };
  alertTypeServices.updateAlertType(id, data)
  .then(response => {
    router.go(0);
  })
  .catch(err => {
    message.value = err?.response?.data?.message;
  });
  closeDialog();
};

const addAlertTypes = () => { 
  alertTypeServices.createAlertType(item.value)
  .then(response => {
    router.go(0);
  })
  .catch(err => {
    message.value = err?.response?.data?.message;
  });
  closeDialog();
};

//edit function 
const editAlertType = (itemData) => {
  console.log('Editing asset:', itemData);
  closeDialog(); 
};


const deleteAlertTypes = () => {
  if(!isNaN(parseInt(item.value.id))){
    alertTypeServices.deleteAlertTypes(item.value.id)
      .then(() => {
        retrieveAlertTypes();
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



const retrieveAlertTypes = () => {
  alertTypeServices.getAllAlertTypes()
    .then((response) => {
      const allItems = response.data;
      alertTypes.value = response.data;
      console.log(alertTypes.value);
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
    
};

const openDialog = (itemId) => {
  if (itemId != undefined && itemId != null){
    item.value = alertTypes.value?.find(type => type.id == itemId);
    editDialogue.value = true;
  }
  else {
    addDialogue.value = true;
  }
}

const openDeleteDialogue = (itemId) =>{
  item.value = alertTypes.value?.find(type => type.id == itemId);
  deleteDialogue.value = true;
}


const closeDialog = () => {
  dialog.value = false;
  deleteDialogue.value = false;
  editDialogue.value = false;
  addDialogue.value = false;
  item.value = {}; // Reset item
}

const headers = [
  {title: 'Name', value: 'name', sortable: true },
  {title: '', value: 'actions', align: 'end', sortable: false},
];


onMounted(() => {
  retrieveAlertTypes();
}) 

</script>

<template>
<v-container class="space">  
    <v-toolbar>
        <v-toolbar-title>Alert Type Management</v-toolbar-title>
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
            :items ="alertTypes"
            item-key ="id"
          >

            <template v-slot:[`item.actions`]="{ item }">
              <v-btn class="ma-2" color="primary" icon="mdi-pencil" @click="openDialog(item.id)">
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

<!-- Delete Dialog -->
  <v-dialog v-model="deleteDialogue" persistent max-width="800px">
    <v-card>
      <v-container>
        <v-card-title class="text-h5, space2" align="center">Are you sure you want to delete the alert type "{{ item.name }}"?</v-card-title>
        <v-row justify="center">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="outlined"  @click="deleteAlertTypes">
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
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" variant="outlined" @click="updateAlertTypes(item.id)">
            Save
          </v-btn>
          <v-btn color="grey-darken-3" variant="outlined" @click="closeDialog">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>

  <!-- add pop-up -->
  <v-dialog v-model="addDialogue" persistent max-width="800px">
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
      
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="outlined" @click="addAlertTypes">
            Save
          </v-btn>
          <v-btn color="grey-darken-3" variant="outlined" @click="closeDialog">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>

</template>

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
</style>