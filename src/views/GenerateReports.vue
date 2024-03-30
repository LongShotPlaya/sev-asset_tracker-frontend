<script setup>
import AlertTypeServices from "../services/alertTypeService";
import CatServices from "../services/assetCatServices";
import TypeServices from "../services/assetTypeManagementServices";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const currTab = ref('report-by-type');

//#region Type Selection Variables
const category = ref(null);
const categories = ref([]);
const catHasTypes = ref(true);

const type = ref(null);
const types = ref([]);
let allTypes = [];
const typeLoading = ref([]); // A stack to ensure that asynchronous operations won't cause weird behavior
const validType = ref(false);

const includeFields = ref([]);
const validFields = ref(false);
const fields = ref([]);
//#endregion

const filters = ref([]);
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

// Grabs all asset types from the backend (which the user is able to view) and sorts them by name
const fetchAssetTypes = async () => {
  TypeServices.getAllAssetTypes()
  .then(response => {
    const data = response.data ?? [];
    allTypes = data.map(assetType => {
      return {
        title: assetType.name,
        value: assetType,
      };
    })
    .sort((a, b) => a.title == b.title ? 0 : a.title < b.title ? -1 : 1);

    filterTypes();
  })
  .catch(err => {
    console.log("Error retrieving asset types!");
  });
};

// Filters asset types by their category
const filterTypes = async () => {
  const categoryId = parseInt(category.value?.id);

  types.value = !isNaN(categoryId) ?
  allTypes.filter(assetType => assetType.value.categoryId == categoryId) : allTypes.slice();

  catHasTypes.value = types.value.length > 0;
  if (!catHasTypes.value || !types.value.find(assetType => assetType.value.id == type.value?.id))
  {
    type.value = catHasTypes.value ? null : { title: "This category has no asset types!", value: {} };
    fetchRelevantFields();
  }
};

// Grabs all relevant asset fields from the backend and sorts them by name
const fetchRelevantFields = async () => {
  validType.value = !isNaN(parseInt(type.value?.id));
  if (!validType.value)
  {
    typeLoading.value = [];
    fields.value = fields.value.filter(field => !field.value.isField);
    includeFields.value = includeFields.value.filter(field => !field.isField);
    refreshFields();
    refreshReferences(true);
    return;
  }
  category.value = categories.value.find(cat => cat.value.id == type.value.categoryId).value;

  typeLoading.value.push(true);
  const typeId = type.value.id;

  TypeServices.getFullAssetType(typeId)
  .then(async (response) => {
    // Reject the promise if it finished, but has the wrong type id
    if (type.value?.id != typeId) throw new Error();
    fields.value = fields.value.filter(field => !field.value.isField);
    fields.value.push(...response.data.fields
    .map(field => {
      return {
        title: field.label,
        value: {
          ...field,
          isField: true,
        },
      };
    }));
    
    fields.value.sort((a, b) => a.title == b.title ? 0 : a.title < b.title ? -1 : 1);
    
    refreshFields();
    typeLoading.value = [];
  })
  .catch(err => {
    console.log("Error retrieving fields!")
    typeLoading.value.pop();
  });
};

// Grabs all alert types from the database
const fetchAlertTypes = async () => {
  AlertTypeServices.getAllAlertTypes()
  .then(response => {
    const data = (response.data ?? [])
    .map(alertType => {
      return {
        title: alertType.name,
        value: {
          ...alertType,
          isField: false,
        },
      };
    }).sort((a, b) => a.title == b.title ? 0 : a.title < b.title ? -1 : 1);
    
    fields.value.push(...data);
    // if (fields.value.length <= 0) includeFields.value.push({ title: "No fields for this asset type!", value: { isField: true } });
    refreshFields()
  })
  .catch(err => {
    console.log("Error retrieving alert types!");
  });
};

// Refreshes the fields
const refreshFields = () => {
  validFields.value = validType.value && fields.value.length > 0;
  if (!validFields.value) includeFields.value = [{ title: "No fields for this asset type!", value: { isField: true } }];
  else includeFields.value = includeFields.value.filter(field => fields.value.some(option => option.value.id == field.id && option.value.isField == field.isField));
};
//#endregion

// Adds a filter to the list
const addFilter = () => {
  refreshReferences(true);
  filters.value.push({
    minimum: null,
    parsedMin: null,
    maximum: null,
    parsedMax: null,
    nulled: false,
    valid: false,
    reference: null,
    fieldType: null,
    description: "Description: ...",
  });
};

// Removes a filter from the list
const removeFilter = (index) => {
  filters.value.splice(index, 1);
};

// Refreshes the references so they can be dynamic
const refreshReferences = (focused) => {
  if (!focused) return;
  
  referenceOptions.value = [];

  const newOptions = (includeFields.value ?? [])
  .map(option => {
    return {
      title: option.isField ? option.label : option.name,
      value: {
        ...option,
      },
    };
  });

  referenceOptions.value = newOptions;
  refreshFilters();
};

const refreshFilters = () => {
  filters.value.forEach(filter => {
    filter.nulled = filter.reference != null && !includeFields.value.find(field => field.id == filter.reference?.id && field.isField == filter.reference?.isField);
  });
};

const validateFilter = (index) => {
  const curr = filters.value[index];

  const selected = !!curr.reference;
  curr.description = selected ? `"${curr.reference?.name ?? curr.reference?.label}" must be ` : "Description: ..."
  
  if (!selected) return curr.valid = false;
  
  if (curr.reference.isField)
  {
    switch (curr.fieldType)
    {
      case "Number":
        const parsedMin = getInputType(curr.minimum) == "number" ? parseFloat(curr.minimum) : NaN;
        const parsedMax = getInputType(curr.maximum) == "number" ? parseFloat(curr.maximum) : NaN;
  
        if (!isNaN(parsedMin) && !isNaN(parsedMax))
        {
          curr.description += parsedMin == parsedMax ? `exactly ${parsedMin}` : `between ${parsedMin} and ${parsedMax}`;
          curr.valid = true;
        }
        else if (!isNaN(parsedMin))
        {
          curr.description += `at least ${parsedMin}`;
          curr.valid = true;
        }
        else if (!isNaN(parsedMax))
        {
          curr.description += `at most ${parsedMax}`;
          curr.valid = true;
        }
        else
        {
          curr.description += `...`;
          curr.valid = false;
        }
        break;
      case "Text":
        curr.minimum ??= "";
        curr.maximum = null;
        curr.description += `${curr.minimum}`.length > 0 ? `"${curr.minimum}"` : "Empty";
        curr.valid = true;
        break;
      case "True/False":
        curr.minimum = /true/i.test(curr.minimum);
        curr.maximum = null;
        curr.description += curr.minimum ? "True" : "False";
        curr.valid = true;
        break;
      default:
        curr.maximum = null;
        curr.minimum = null;
        curr.description += "...";
        curr.valid = false;
        break;
    }
  }
  else
  {
    // Do this in order to handle alerts! --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  }
};

// Returns the closest type of the input string
const getInputType = (input) => {
  if (!isNaN(Number(input, 10)) && !isNaN(parseFloat(input, 10))) return "number";

  if (/true/i.test(input) || /false/i.test(input)) return "bool";

  return "string";
};

// Ensures that boolean values are erased when the type is changed, since they seem out of place
const changeType = (index) => {
  const curr = filters.value[index];
  if (getInputType(curr.minimum) == "bool" && curr.fieldType != "True/False") curr.minimum = "";
  else if (getInputType(curr.minimum) == "string" && curr.fieldType != "Text") curr.minimum = curr.fieldType == "Number" ? "" : /true/i.test(curr.minimum);
  validateFilter(index);
};

// When dealing with numbers, ensures that they are valid, or they will be erased when unfocusing
const adjustInput = (index, minimumField) => {
  const curr = filters.value[index];
  if (curr.fieldType != "Number") return;

  if (minimumField) curr.minimum = getInputType(curr.minimum) == "number" ? Number(curr.minimum, 10) : "";
  else curr.maximum = getInputType(curr.maximum) == "number" ? parseFloat(curr.maximum) : "";
};

fetchCategories();
fetchAssetTypes();
fetchAlertTypes();
</script>

<template>
    <v-container>
        <v-toolbar>
          <v-toolbar-title align="center">Generate Reports</v-toolbar-title>

          <!-- This is to extend the toolbar to include the tabs -->
          <template v-slot:extension>
            <v-spacer />
            <v-tabs
              v-model="currTab"
              align-tabs="center"
              justify-content="center"
            >
              <v-tab value="report-by-type">
                By Type
              </v-tab>
              <v-tab value="report-by-assignment">
                By Assignment
              </v-tab>
            </v-tabs>
            <v-spacer />
          </template>
        </v-toolbar>

        <v-window v-model="currTab">
          <v-window-item value="report-by-type">
            <v-card>
              <v-container>
                <v-card-title align="center">
                  Asset Selection
                </v-card-title>
                <v-row justify="center">
                  <v-col cols="3">
                    <v-combobox
                      v-model="category"
                      @update:modelValue="filterTypes"
                      label="Category"
                      :items="categories"
                      :return-object="false"
                      auto-select-first
                      clearable
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-combobox
                      :disabled="!catHasTypes"
                      v-model="type"
                      @update:modelValue="fetchRelevantFields"
                      label="Asset Type"
                      :items="types"
                      :return-object="false"
                      :loading="typeLoading.length > 0"
                      auto-select-first
                      clearable
                    />
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col cols="6">
                    <v-combobox
                      :disabled="fields.length <= 0 || typeLoading.length > 0 || !validType"
                      v-model="includeFields"
                      label="Fields to Report"
                      :items="fields.length > 0 && typeLoading.length <= 0 && validType ? fields : []"
                      :return-object="false"
                      @update:modelValue="refreshReferences(true)"
                      :clearable="fields.length > 0 && typeLoading.length <= 0 && validType"
                      :chips="fields.length > 0 && typeLoading.length <= 0 && validType"
                      closable-chips
                      multiple
                    />
                  </v-col>
                </v-row>
                <br>
                <v-card-title align="center">
                  Asset Filters
                </v-card-title>
                <br>
                <v-row justify="center">
                  <v-col cols="6">
                    <v-expansion-panels>
                      <v-expansion-panel
                        v-for="(filter, index) in filters"
                        :key="index"
                        :value="filter"
                        justify="center"
                        :class="filter.nulled ? 'expansion-nulled' : ''"
                      >
                        <v-expansion-panel-title>
                          <template v-slot:default="{ expanded }">
                            <v-row>
                              <v-fade-transition leave-absolute>
                                <v-col
                                  v-if="expanded"
                                  key="0"
                                >
                                  {{ filter.reference != null ? `Filter For "${filter.reference?.name ?? filter.reference?.label}"` : "New Filter" }}
                                </v-col>
                                <v-col
                                  v-else
                                  key="1"
                                >
                                  {{ filter.nulled ? `Field "${filter.reference?.name ?? filter.reference?.label}" Removed From Selection!` : filter.reference != null ? filter.description : "New Filter" }}
                                </v-col>
                              </v-fade-transition>
                            </v-row>
                          </template>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <v-card-text style="font-weight: bold; font-size: 16px;">
                            {{ filter.nulled ? `Field "${filter.reference?.name ?? filter.reference?.label}" Removed From Selection!` : filter.description }}
                          </v-card-text>
                          <v-row>
                            <v-col>
                              <v-select
                                :disabled="filter.nulled"
                                v-model="filters[index].reference"
                                label="Alert Type or Field"
                                :items="referenceOptions"
                                :return-object="false"
                                @update:focused="refreshReferences"
                                @update:modelValue="validateFilter(index)"
                                clearable
                              />
                            </v-col>
                            <v-col>
                              <v-select
                                :disabled="filter.nulled || !filter.reference"
                                v-model="filters[index].fieldType"
                                label="Field Data Type"
                                :items="['Number', 'Text', 'True/False']"
                                :return-object="false"
                                @update:modelValue="changeType(index)"
                              />
                            </v-col>
                            
                            <v-col cols="1">
                              <v-btn
                                class="ma-2"
                                color="primary"
                                variant="outlined"
                                icon="mdi-trash-can"
                                @click="removeFilter(index)"
                              />
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col v-if="filter.fieldType != 'True/False'">
                              <v-text-field
                                :disabled="!filter.fieldType || filter.nulled || !filter.reference"
                                v-model="filters[index].minimum"
                                @blur="adjustInput(index, true)"
                                @update:modelValue="validateFilter(index)"
                                :label="filter.fieldType == 'Number' ? 'Minimum Value' : 'Value'"
                              />
                            </v-col>
                            <v-col v-else>
                              <v-checkbox
                                :disabled="!filter.fieldType || filter.nulled || !filter.reference"
                                v-model="filters[index].minimum"
                                @update:modelValue="validateFilter(index)"
                                label="Value Must Be True"
                              />
                            </v-col>
                            <v-col v-if="filter.fieldType == 'Number'">
                              <v-text-field
                                :disabled="!filter.fieldType || filter.nulled || !filter.reference"
                                v-model="filters[index].maximum"
                                @blur="adjustInput(index, false)"
                                @update:modelValue="validateFilter(index)"
                                label="Maximum Value"
                              />
                            </v-col>
                            <v-col cols="1" />
                          </v-row>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-col>
                </v-row>
                <br v-if="filters.length > 0">
                <br>
                <v-row justify="center">
                  <v-btn
                    :disabled="referenceOptions.length <= 0 || !validType || !validFields"
                    color="primary"
                    @click="addFilter"
                  >
                    <v-icon
                      icon="mdi-plus-circle-outline"
                      color="secondary"
                      size="x-large"
                      start
                    />
                    Add Filter
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
.expansion-nulled {
  border: 1px solid rgb(var(--v-theme-primary)); /* Set border properties as needed */
  border-radius: 4px; /* Optional: Add border radius */
}
</style>