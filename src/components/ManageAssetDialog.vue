<template>
    <v-card>
      <v-container>
        <v-card-title class="text-h5">{{ isNewItem ? 'Add' : 'Edit' }}</v-card-title> 
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
          <v-btn color="primary" variant="outlined" @click="saveAssetCat">
            {{ isNewItem ? 'Add' : 'Save' }} 
          </v-btn>
          <v-btn color="grey-darken-3" variant="outlined" @click="closeDialog">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue';
import CatServices from '../services/assetCatServices';

// Define props
const props = defineProps({
  item: {
    type: Object, 
    required: true
  },
  saveFunction: Function,  
  editFunction: Function 
});

const emit=defineEmits(["save", "add", "close"])

// Define reactive variables
const dialog = ref(false);
const isNewItem = computed(() => !props.item.id); // Check if the item is new or existing
const item = ref({ ...props.item }); // Make a copy of the prop to prevent mutation

const saveAssetCat = async () => {
  // either save asset category or add it
  const saveOrUpdate = isNewItem.value
  ? CatServices.createAssetCat(item.value)
  : CatServices.updateAssetCat(item.value.id, item.value);
  // .then( emit and close dialog )
  saveOrUpdate.then(data => {
    if (props.saveFunction) props.saveFunction(item.value);
    closeDialog();
  })
  .catch(err => {
    console.log(err);
    if (props.saveFunction) props.saveFunction(item.value);
    closeDialog();
  })
};

const closeDialog = () => {
  emit('close');
};
</script>

<style>
</style>