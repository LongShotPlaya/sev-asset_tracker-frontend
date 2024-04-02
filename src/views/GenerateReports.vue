<script setup>
import AlertTypeServices from "../services/alertTypeService";
import CatServices from "../services/assetCatServices";
import FieldServices from "../services/assetFieldService";
import TypeServices from "../services/assetTypeManagementServices";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const currTab = ref('report-by-type');

//#region Type Selection Variables
const category = ref(null);
const categories = ref([]);
const catLoading = ref(false);
const validCategory = ref(false);

const type = ref(null);
const types = ref([]);
const typeLoading = ref(false);
const validType = ref(false);

const includeFields = ref([]);
const fields = ref([]);
const validFields = ref(false);

const includeAlerts = ref([]);
const alertTypes = ref([]);
//#endregion

const specs = ref([]);
const specDetails = ref([]);
const referenceOptions = ref([]);

//#region Type selection Functions
// Grabs all categories from the backend (which the user is able to view) and sorts them by name
const fetchCategories = async () => {
  CatServices.getAllAssetCats()
  .then(response => {
    const data = response.data ?? [];
    categories.value = data.map(cat => {
      return {
        title: cat.name,
        value: cat,
      };
    })
    .sort((a, b) => a.title == b.title ? 0 : a.title < b.title ? -1 : 1);
  })
  .catch(err => {
    console.log("Error retrieving categories!");
  });
};

// Grabs all relevant asset types from the backend and sorts them by name
const fetchRelevantTypes = async () => {
  validCategory.value = !isNaN(parseInt(category.value?.id));
  type.value = null;
  fetchRelevantFields()
  if (!validCategory.value) return catLoading.value = false;

  catLoading.value = true;
  const categoryId = category.value.id;

  TypeServices.getAllAssetTypes()
  .then(response => {
    // Reject the promise if it finished, but has the wrong category id
    if (category.value?.id != categoryId) throw new Error();
    types.value = response.data
    .filter(assetType => assetType.categoryId == categoryId)
    .map(assetType => {
      return {
        title: assetType.name,
        value: assetType,
      };
    })
    .sort((a, b) => a.title == b.title ? 0 : a.title < b.title ? -1 : 1);
    
    type.value = types.value.length > 0 ? null : { title: "No types for this category!", value: {} };

    catLoading.value = false;
  })
  .catch(err => {
    console.log("Error retrieving types!")
    catLoading.value = false;
  });
};

// Grabs all relevant asset fields from the backend and sorts them by name
const fetchRelevantFields = async () => {
  validType.value = !isNaN(parseInt(type.value?.id));
  if (!validType.value)
  {
    typeLoading.value = false;
    fields.value = [];
    includeFields.value = [];
    refreshReferences();
    return;
  }

  typeLoading.value = true;
  const typeId = type.value.id;

  FieldServices.getAllAssetFields()
  .then(response => {
    // Reject the promise if it finished, but has the wrong category id
    if (type.value?.id != typeId) throw new Error();
    fields.value = response.data
    .filter(field => field.assetTypeId == typeId)
    .map(field => {
      return {
        title: field.label,
        value: field,
      };
    })
    .sort((a, b) => a.title == b.title ? 0 : a.title < b.title ? -1 : 1);
    
    includeFields.value = fields.value.length > 0 ? null : { title: "No fields for this asset type!", value: {} };

    typeLoading.value = false;
  })
  .catch(err => {
    console.log("Error retrieving fields!")
    typeLoading.value = false;
  });
};

// Grabs all alert types from the database
const fetchAlertTypes = async () => {
  AlertTypeServices.getAllAlertTypes()
  .then(response => {
    const data = response.data ?? [];
    alertTypes.value = data.map(alertType => {
      return {
        title: alertType.name,
        value: alertType,
      };
    })
    .sort((a, b) => a.title == b.title ? 0 : a.title < b.title ? -1 : 1);
  })
  .catch(err => {
    console.log("Error retrieving alert types!");
  });
};
//#endregion

// Adds a specification
const addSpec = () => {
  refreshReferences(true);
  specs.value.push({
    index: specs.value.length,
    valid: ref(false),
    reference: ref(null),
  });
};

// Refreshes the references so they can be dynamic
const refreshReferences = (focused) => {
  if (!focused) return;
  
  referenceOptions.value = [];

  referenceOptions.value.push(...(includeFields.value?.map(field => {
    return {
      title: field.label,
      value: {
        id: field.id,
        isField: true,
      },
    };
  }) ?? []));
  
  referenceOptions.value.push(...(includeAlerts.value?.map(alertType => {
    return {
      title: alertType.name,
      value: {
        id: alertType.id,
        isField: false,
      },
    };
  }) ?? []));
};

fetchCategories();
fetchAlertTypes();
</script>

<template>
    <v-container>
        <v-toolbar>
          <v-toolbar-title align="center">Generate Reports</v-toolbar-title>

          <!-- This is to extend the toolbar to include the tabs -->
          <template v-slot:extension>
            <v-tabs
              v-model="currTab"
              align-tabs="center"
              align="center"
            >
              <v-tab value="report-by-type">
                By Type
              </v-tab>
              <v-tab value="report-by-assignment">
                By Assignment
              </v-tab>
            </v-tabs>
          </template>
        </v-toolbar>

        <v-window v-model="currTab">
          <v-window-item value="report-by-type">
            <v-card>
              <v-container>
                <v-card-title align="center">
                  Asset Type Selection
                </v-card-title>
                <v-row>
                  <v-spacer />
                  <v-col>
                    <v-combobox
                      v-model="category"
                      @update:modelValue="fetchRelevantTypes"
                      label="Category"
                      :items="categories"
                      :return-object="false"
                      :loading="catLoading"
                      auto-select-first
                      clearable
                    />
                  </v-col>
                  <v-col>
                    <v-combobox
                      :disabled="!validCategory || types.length <= 0"
                      v-model="type"
                      @update:modelValue="fetchRelevantFields"
                      label="Asset Type"
                      :items="types"
                      :return-object="false"
                      :loading="typeLoading"
                      auto-select-first
                      clearable
                    />
                  </v-col>
                  <v-spacer />
                </v-row>
                <v-row>
                  <v-spacer />
                  <v-col>
                    <v-combobox
                      v-model="includeAlerts"
                      label="Alert Types to Include"
                      :items="alertTypes"
                      :return-object="false"
                      @update:modelValue="refreshReferences(true)"
                      clearable
                      multiple
                      chips
                    />
                  </v-col>
                  <v-col>
                    <v-combobox
                      :disabled="!validType || fields.length <= 0"
                      v-model="includeFields"
                      label="Fields to Include"
                      :items="fields"
                      :return-object="false"
                      @update:modelValue="refreshReferences(true)"
                      clearable
                      multiple
                      chips
                    />
                  </v-col>
                  <v-spacer />
                </v-row>
                <br>
                <v-card-title align="center">
                  Asset Type Specifications
                </v-card-title>
                <br>
                <v-row
                  v-for="spec in specs"
                  :key="spec.index"
                  :value="spec"
                  justify="center"
                >
                  <v-col cols="9">
                    <v-card>
                      <br>
                      <v-row>
                        <v-col>
                          <v-select
                            v-model="specs[spec.index].reference"
                            label="Alert Type or Field"
                            :items="referenceOptions"
                            :return-object="false"
                            @update:focused="refreshReferences"
                            clearable
                          />
                        </v-col>
                        <v-col>

                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-btn
                    :disabled="specs.slice(-1)?.[0]?.valid == false || referenceOptions.length <= 0"
                    color="primary"
                    @click="addSpec"
                  >
                    <v-icon
                      icon="mdi-plus-circle-outline"
                      color="secondary"
                      size="x-large"
                      start
                    />
                    Add Specification
                  </v-btn>
                </v-row>
              </v-container>
            </v-card>
          </v-window-item>

          <v-window-item value="report-by-assignment">
            <v-card>
            </v-card>
            <v-card-text>This is another test, but for tabs 2!</v-card-text>
          </v-window-item>
        </v-window>
    </v-container>
</template>

<style>

</style>