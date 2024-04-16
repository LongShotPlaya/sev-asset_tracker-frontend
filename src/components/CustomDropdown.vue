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
  
        <!-- Render text fields based on fields array -->
        <v-text-field
          v-for="(field, index) in item.fields"
          :key="index"
          v-model="field.value"
          :counter="50"
          :label="field.label"
          required
        ></v-text-field>
  
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- Button to add a new text field -->
          <v-btn color="primary" variant="outlined" @click="addTextField">
            Add Field
          </v-btn>
          <!-- Button to save -->
          <v-btn color="primary" variant="outlined" @click="saveDropdown">
            {{ isNewItem ? 'Add' : 'Save' }} 
          </v-btn>
          <!-- Button to cancel -->
          <v-btn color="grey-darken-3" variant="outlined" @click="closeDialog">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, ref, computed } from 'vue';
  import DropdownServices from "../services/fieldListServices.js";
  
  // Define props
  const props = defineProps({
    item: {
      type: Object, 
      required: true
    },
    saveFunction: Function,  
    editFunction: Function 
  });
  
  const emit = defineEmits(["save", "add", "close"]);
  
  // Define reactive variables
  const isNewItem = computed(() => !props.item.id); // Check if the item is new or existing
  const item = ref({ ...props.item }); // Make a copy of the prop to prevent mutation
  
  // Method to add a new text field
  const addTextField = () => {
    if (!item.value.fields) {
      item.value.fields = [];
    }
    item.value.fields.push({ label: 'New Field', value: '' });
  };
  
  // Method to save dropdown data
  const saveDropdown = async () => {
    console.log("Save: ",saveDropdown);
  try {
    // either save a dropdown or add a new one
    const saveOrUpdate = isNewItem.value
      ? () => DropdownServices.createFieldList(item.value)
      : () => DropdownServices.updateFieldList(item.value.id, item.value);
      
    const data = await saveOrUpdate();
    
    if (props.saveFunction) props.saveFunction(data);
    
    // Emit 'close' event after successful save
    emit('close');
  } catch (error) {
    console.error(error);
    // Handle error here if needed
  }
};

  
  const closeDialog = () => {
    emit('close');
  };
  </script>
  
  <style>
  </style>
  