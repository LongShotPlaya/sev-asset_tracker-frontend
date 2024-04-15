 <template>
    <v-container class="space">
      <v-toolbar>
        <v-toolbar-title>Manage Custom Dropdowns</v-toolbar-title>
      </v-toolbar>
      <br>
      <v-row>
        <v-spacer></v-spacer>
        <v-col align="right">
          <v-btn color="primary" @click="addDropdown">
            Add
          </v-btn>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col>
          <v-card>
            <v-data-table
              :headers ="headers"
              :items ="dropdownfields"
              item-key ="id"
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
        </v-col>
      </v-row>
    </v-container>
  
    <!-- delete pop-up -->
    <v-dialog v-model="deleteDialogue" persistent max-width="800px">
      <v-card>
        <v-container>
          <v-card-title class="text-h5, space2" align="center">Are you sure you want to delete this dropdown?</v-card-title>
          <v-row justify="center">
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" variant="outlined"  @click="deleteFieldList">
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
  
    <!-- custom pop-up -->
    <v-dialog v-model="dialog" persistent max-width="800px">  
       <CustomDropdown :item="item" @close="closeDialog" :save-function="saveDropdown" :edit-function="editDropdown"/>
    </v-dialog>
  </template>
  
  
  
  <script setup>
  import Utils from "../config/utils.js";
  import DropdownServices from "../services/fieldListServices.js";
  import { onMounted, ref } from "vue";
  import { useRouter } from "vue-router";
  //import AssetCatAddEdit from "../components/AssetCatAddEdit.vue"; 
  import CustomDropdown from "../components/CustomDropdown.vue"; //Import the custom dropdown component


  // const assetcategories = ref([]);
  const dropdownfields = ref([]);
  const dialog = ref(false);
  const deleteDialogue = ref(false)
  const item = ref({})
  
  const router = useRouter();
  const tutorials = ref([]);
  const user = Utils.getStore("user");
  const message = ref("Search, Edit or Delete Dropdowns");
  
  
  const updateFieldList = async (id) => {
    const data = {
      name: dropdownfields.value.name,
    };
    try {
      const response = await DropdownServices.update(props.id, data);
      dropdownfields.value.id = response.data.id; //check to see if the item id matches the response id
      router.push({ name: "dropdowns" });  //then push the reponse 
    } catch (e) {
      message.value = e.response.data.message;
    }
    closeDialog();
  };
  
 
  const addDropdown = (data) => {
    openDialog({});
  };
  
  // save function
  const saveDropdown = async (newItemData) => {
    retrieveDropdown();
  };
  
  //edit function 
  const editDropdown = (itemData) => {
    console.log('Editing Dropdown:', itemData);
    closeDialog(); 
  };
  
  
  const deleteFieldList = () => {
    if(!isNaN(parseInt(item.value.id))){
      DropdownServices.deleteFieldList(item.value.id)
        .then(() => {
          retrieveDropdown();
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
  
  
  
  const retrieveDropdown = () => {
    DropdownServices.getAllFieldLists() 
      .then((response) => {
        const allItems = response.data;
        dropdownfields.value = response.data;
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
    item.value = dropdownfields.value?.find(cat => cat.id == itemId);
    deleteDialogue.value = true;
  }
  
  
  const closeDialog = () => {
    dialog.value = false;
    deleteDialogue.value = false;
    item.value = {}; // Reset item
  }
  
  const headers = [
    {title: 'Name', value: 'name', sortable: true },
    {title: '', value: 'actions', align: 'end', sortable: false},
  ];
  
  
  onMounted(() => {
    retrieveDropdown();
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
  