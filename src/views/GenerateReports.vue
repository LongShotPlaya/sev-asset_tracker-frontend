<script setup>
import AlertTypeServices from "../services/alertTypeService";
import TypeServices from "../services/assetTypeManagementServices";
import ReportServices from "../services/reportServices";
import { ref, computed, watch } from "vue";
import { format } from "@formkit/tempo";
import Papa from "papaparse";

const currTab = ref('report-by-type');

//#region Type Selection Variables
const category = ref(null);
const categories = ref([]);
const catHasTypes = computed(() => types.value.length > 0);
const catsLoading = ref(false);

const type = ref(null);
// Dynamically filters the available types based on the selected category
const types = computed(() => {
  const categoryId = parseInt(category.value?.id);
  return !isNaN(categoryId)
  ? allTypes.value.filter(assetType => assetType.value.categoryId == categoryId)
  : allTypes.value.slice();
});
const allTypes = ref([]);
const validType = computed(() => !isNaN(parseInt(type.value?.id)));
const typesLoading = ref(false);

const includeFields = ref([]);
const validFields = computed(() => validType.value && fields.value.length > 0);
const fields = ref([]);
const fieldsLoadingStack = ref([]); // A stack to ensure that asynchronous operations won't cause weird behavior
const fieldsLoading = computed(() => fieldsLoadingStack.value.length > 0);

// Dynamically ensures that type is valid
const typeValidator = () => {
  if (!catHasTypes.value || !types.value.find(assetType => assetType.value.id == type.value?.id))
  {
    type.value = catHasTypes.value ? null : { title: "This category has no asset types!", value: {} };
    fetchRelevantFields();
  }
};
watch(catHasTypes, typeValidator);
watch(types, typeValidator);
//#endregion

//#region Filtering Variables
const filters = ref([]);
const referenceOptions = computed(() => (includeFields.value ?? [])
  .map(field => {
    return {
      title: field.isField ? field.label : field.name,
      value: {
        ...field,
      },
    };
  })
);
//#endregion

//#region Reporting Variables
const byTypeReport = ref([]);
const byTypeHeaders = ref([]);

// In case someone tries to generate a report, but has changed the type selection (which
// would prevent us from getting its name otherwise)
let typeName = "";
const byTypeReportLoading = ref(false);
//#endregion

//#region Assignment Selection Variables

//#endregion



//#region Type selection Functions
// Grabs all categories from the backend (which the user is able to report) and sorts them by name
const fetchCategories = async () => {
  catsLoading.value = true;

  ReportServices.getReportableCategories()
  .then(response => {
    const data = response.data ?? [];
    categories.value = data.map(cat => {
      return {
        title: cat.name,
        value: cat,
      };
    })
    .sort((a, b) => a.title == b.title ? 0 : a.title < b.title ? -1 : 1);

    catsLoading.value = false;
  })
  .catch(err => {
    catsLoading.value = false;
    console.log("Error retrieving categories!");
  });
};

// Grabs all asset types from the backend (which the user is able to report) and sorts them by name
const fetchAssetTypes = async () => {
  typesLoading.value = true;

  ReportServices.getReportableTypes()
  .then(response => {
    const data = response.data ?? [];
    allTypes.value = data.map(assetType => {
      return {
        title: assetType.name,
        value: assetType,
      };
    })
    .sort((a, b) => a.title == b.title ? 0 : a.title < b.title ? -1 : 1);

    typesLoading.value = false;
  })
  .catch(err => {
    typesLoading.value = false;
    console.log("Error retrieving asset types!");
  });
};

// Grabs all relevant asset fields from the backend and sorts them by name
const fetchRelevantFields = async () => {
  fields.value = fields.value.filter(field => !field.value.isField && field.value.id != "acquisitionDate");
  if (!validType.value)
  {
    fieldsLoadingStack.value = [];
    includeFields.value = includeFields.value.filter(field => !field.isField);
    refreshFields();
    refreshReferences(true);
    return;
  }
  category.value = categories.value.find(cat => cat.value.id == type.value.categoryId).value;

  // Note: it doesn't actually matter what we push onto the stack, so I tried to make it something that
  // doesn't take too much time or space to push
  fieldsLoadingStack.value.push(true);
  const typeId = type.value.id;

  TypeServices.getFullAssetType(typeId)
  .then(async (response) => {
    // Reject the promise if it finished, but has the wrong type id
    if (type.value?.id != typeId) throw new Error();
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
    
    fields.value.push(
      {
        title: "Acquisition Date",
        value: {
          id: "acquisitionDate",
          name: "Acquisition Date",
          isField: false,
        },
      },
      {
        title: "Acquisition Price",
        value: {
          id: "acquisitionPrice",
          label: "Acquisition Price",
          isField: true,
        },
      },
      {
        title: "Condition",
        value: {
          id: "condition",
          label: "Condition",
          isField: true,
        },
      },
      {
        title: "Location",
        value: {
          id: "locationId",
          label: "Location",
          isField: true,
        },
      },
    );
    
    fields.value.sort((a, b) => a.title == b.title ? 0 : a.title < b.title ? -1 : 1);
    
    refreshFields();
    fieldsLoadingStack.value = [];
  })
  .catch(err => {
    console.log("Error retrieving fields!")
    fieldsLoadingStack.value.pop();
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
    refreshFields()
  })
  .catch(err => {
    console.log("Error retrieving alert types!");
  });
};

// Refreshes the fields
const refreshFields = () => {
  if (!validFields.value) includeFields.value = [{ title: "No fields for this asset type!", value: { isField: true } }];
  else includeFields.value = includeFields.value.filter(field => fields.value.some(option => option.value.id == field.id && option.value.isField == field.isField));
};
//#endregion

//#region Filtering
// Adds a filter to the list
const addFilter = () => {
  refreshReferences(true);
  filters.value.push({
    minimum: null,
    maximum: null,
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
          curr.description += parsedMin == parsedMax ? `exactly ${parsedMin}` : `between ${Math.min(parsedMin, parsedMax)} and ${Math.max(parsedMin, parsedMax)}`;
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
        curr.fieldType = null;
        break;
    }
  }
  else
  {
    if (getInputType(curr.minimum) != "alert" || getInputType(curr.maximum) != "alert")
    {
      curr.minimum = null;
      curr.maximum = null;
    }
    
    let parsedMin = null;
    let parsedMax = null;

    // Invalid dates can cause the formatter to freak out, so we need to be cautious of them
    // They need to be checked individually to prevent one causing both to be erased or ignored
    try {
      if (!!curr.minimum) format(curr.minimum, { date: "long" });
      parsedMin = curr.minimum;
    }
    catch {
      parsedMin = null;
    }

    try {
      if (!!curr.maximum) format(curr.maximum, { date: "long" });
      parsedMax = curr.maximum;
    }
    catch {
      parsedMax = null;
    }
    
    curr.fieldType = "Alert";
    if (parsedMin != null && parsedMax != null)
    {
      const actualMin = format(new Date(parsedMax) > new Date(parsedMin) ? parsedMin : parsedMax, { date: "long" });
      const actualMax = format(new Date(parsedMax) > new Date(parsedMin) ? parsedMax : parsedMin, { date: "long" });
      curr.description += parsedMin == parsedMax ? `on the date ${actualMin}` : `between ${actualMin} and ${actualMax}`;
      curr.valid = true;
    }
    else if (parsedMin != null)
    {
      curr.description += `on or after ${format(parsedMin, { date: "long" })}`;
      curr.valid = true;
    }
    else if (parsedMax != null)
    {
      curr.description += `on or before ${format(parsedMax, { date: "long" })}`;
      curr.valid = true;
    }
    else
    {
      curr.description += `...`;
      curr.valid = false;
    }
  }
};

// Returns the closest type of the input string
const getInputType = (input) => {
  if (!isNaN(Number(input, 10)) && !isNaN(parseFloat(input, 10))) return "number";

  if (/true/i.test(input) || /false/i.test(input)) return "bool";

  if (!isNaN(new Date(input))) return "alert";

  return "string";
};

// Ensures that boolean values are erased when the type is changed, since they seem out of place
const changeType = (index) => {
  const curr = filters.value[index];
  if (curr.fieldType != "True/False" && getInputType(curr.minimum) == "bool") curr.minimum = "";
  else if (curr.fieldType != "Text" && getInputType(curr.minimum) == "string") curr.minimum = curr.fieldType == "Number" ? "" : /true/i.test(curr.minimum);
  validateFilter(index);
};

// When dealing with numbers or dates, ensures that they are valid, or they will be erased when unfocusing
const adjustInput = (index, minimumField) => {
  const curr = filters.value[index];
  
  if (curr.fieldType == "Number")
  {
    if (minimumField) curr.minimum = getInputType(curr.minimum) == "number" ? Number(curr.minimum, 10) : "";
    else curr.maximum = getInputType(curr.maximum) == "number" ? parseFloat(curr.maximum) : "";

    // If the minimum and maximum are in the wrong order, switch them
    if (getInputType(curr.minimum) == "number" && getInputType(curr.maximum) == "number" && curr.minimum > curr.maximum)
    {
      const temp = curr.minimum;
      curr.minimum = curr.maximum;
      curr.maximum = temp;
    }
  }
  else if (curr.fieldType == "Alert")
  {
    // Check min and max to ensure that the formatter will accept them
    // They need to be checked individually to prevent one causing both to be erased
    try {
      let temp;
      if (!!curr.minimum) temp = format(curr.minimum, { date: "long" });
    }
    catch {
      curr.minimum = null;
    }
    
    try {
      let temp;
      if (!!curr.maximum) temp = format(curr.maximum, { date: "long" });
    }
    catch {
      curr.maximum = null;
    }

    // If the minimum and maximum are in the wrong order, switch them
    if (!!curr.minimum && !!curr.maximum && new Date(curr.minimum) - new Date(curr.maximum) > 0)
    {
      const temp = curr.minimum;
      curr.minimum = curr.maximum;
      curr.maximum = temp;
    }
  }
};
//#endregion

//#region Reporting
// Sends the request to the backend to report by asset type
const reportByAssetType = () => {
  byTypeReportLoading.value = true;

  ReportServices.getAssetReport(type.value.id, {
    fields: includeFields.value,
  })
  .then(response => {
    // Ensures that the file name is cleaned up
    typeName = type.value.name
    .replace(/^\s+|\s+$/g, '') // Trim leading and trailing spaces
    .replace(/[\\/:"*?<>|\.\s]/g, '_'); // Replace invalid characters with hyphens

    // Gathers all fields together
    byTypeReport.value = response.data.filter(entry => {
      delete entry.id;

      // Location needs an extra step
      if (Object.keys(entry).includes("locationId"))
      {
        const building = entry?.location?.building?.abbreviation;
        const room = entry?.location?.name;
        entry.locationId = !!building && !!room ? `${building} ${room}` : `No Location`;
        delete entry.location;
      }

      // Filter built-in fields
      entry.fields = Object.entries(entry)
      .filter(attribute => !isNaN(parseInt(attribute[1])) || typeof(attribute[1]) === "string")
      .map(builtIn => {
        return {
          id: builtIn[0],
          isField: builtIn[0] != "acquisitionDate",
          value: builtIn[1]
        };
      });

      // Filter additional fields
      entry.fields.push(...entry.data.map(data => {
        return {
          id: data.fieldId,
          value: data.value,
          isField: true,
        };
      }));

      // Filter alerts
      entry.fields.push(...entry.alerts.map(alert => {
        return {
          id: alert.typeId,
          value: alert.date,
          isField: false,
        }
      }));

      // Everything must match their constraints
      return entry.fields.every(field => applyFilter(field, filters.value));
    })
    .map(entry => {
      const result = {};

      entry.fields.forEach(field => {
        const matchingField = includeFields.value.find(included => included.id == field.id && included.isField == field.isField);
        result[matchingField.isField ? matchingField.label : matchingField.name] = field.value;
      });

      // Fills in missing values with an empty string so it can be converted to csv easier
      const resultAttributes = Object.keys(result);
      includeFields.value.forEach(field => {
        const fieldName = field.isField ? field.label: field.name;
        if (!resultAttributes.includes(fieldName)) result[fieldName] = "";
      })

      return result;
    }); // Normalizes the fields to a format easier to understand and display

    byTypeHeaders.value = includeFields.value.map(field => {
      const fieldName = field.isField ? field.label : field.name;
      return {
        title: fieldName,
        value: fieldName,
      };
    });

    byTypeReportLoading.value = false;
  })
  .catch(err => {
    byTypeReportLoading.value = false;
    console.log("Error Reporting By Asset Type!");
  });
};

// Ensures that the target adheres to any constraints specified for it in a list of filters
const applyFilter = (target, filterList) => {
  const applyOneFilter = (target, filter) => {
    const targetValue = target.value ?? "";
    const targetType = getInputType(targetValue);

    // For strings: ensure that the value matches
    if (filter.fieldType == "Text")
    {
      return ("" + targetValue) == (filter.minimum ?? "");
    }
    // For booleans: ensure that the value matches
    else if (filter.fieldType == "True/False" && targetType == "bool")
    {
      return /true/i.test("" + targetValue) == /true/i.test(filter.minimum);
    }
    // For numbers: ensure that the value falls within the specified range
    else if (filter.fieldType == "Number" && targetType == "number")
    {
      return !((getInputType(filter.minimum) == "number" && parseInt(filter.minimum) > parseInt(targetValue))
      || (getInputType(filter.maximum) == "number" && parseInt(targetValue) > parseInt(filter.maximum)));
    }
    // For dates: ensure that the date falls within the specified range
    else if (filter.fieldType == "Alert" && targetType == "alert")
    {
      return !((!!filter.minimum && new Date(targetValue) < new Date(filter.minimum))
      || (!!filter.maximum && new Date(filter.maximum) < new Date(targetValue)));
    }
    return true;
  };

  const targetFilters = filterList.filter(filter => !filter.nulled && filter.reference?.id == target.id && filter.reference?.isField == target.isField);
  return targetFilters.every(filter => applyOneFilter(target, filter));
};

const downloadByAssetTypeReport = () => {
  const csv = Papa.unparse(byTypeReport.value);

  // Create a blob from the CSV string
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });

  // Create a temporary anchor element
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);

  const fileName = `report_for_type_${typeName}_${format(new Date(), "YYYY-MM-DD_hh_mm_ss")}.csv`;
  link.setAttribute('download', fileName);

  // Simulate a click on the anchor element to trigger the download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
//#endregion

fetchCategories();
fetchAssetTypes();
fetchAlertTypes();
</script>

<template>
  <v-container fluid>
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
          <v-container fluid>
            <v-card-title align="center">
              Asset Selection
            </v-card-title>
            <v-row justify="center">
              <v-col cols="3">
                <v-combobox
                  v-model="category"
                  label="Category"
                  :items="categories"
                  :return-object="false"
                  :loading="catsLoading"
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
                  :loading="typesLoading"
                  auto-select-first
                  clearable
                />
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="6">
                <v-combobox
                  :disabled="fields.length <= 0 || fieldsLoading || !validType"
                  v-model="includeFields"
                  label="Fields to Report"
                  :items="fields.length > 0 && !fieldsLoading && validType ? fields : []"
                  :return-object="false"
                  @update:modelValue="refreshReferences(true)"
                  :clearable="fields.length > 0 && !fieldsLoading && validType"
                  :chips="fields.length > 0 && !fieldsLoading && validType"
                  :loading="fieldsLoading"
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
                            v-if="(filter.reference?.isField ?? true)"
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
                            density="comfortable"
                            @click="removeFilter(index)"
                          />
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col v-if="filter.fieldType != 'True/False'">
                          <v-text-field
                            :disabled="!filter.fieldType || filter.nulled || !filter.reference"
                            :type="(filter.reference?.isField ?? true) ? 'text' : 'date'"
                            v-model="filters[index].minimum"
                            @blur="adjustInput(index, true)"
                            @update:modelValue="validateFilter(index)"
                            :label="!(filter.reference?.isField ?? true) ? 'From Date' : filter.fieldType == 'Number' ? 'Minimum Value' : 'Value'"
                            clearable
                          />
                        </v-col>
                        <v-radio-group
                          v-else
                          v-model="filters[index].minimum"
                          :disabled="!filter.fieldType || filter.nulled || !filter.reference"
                          @update:modelValue="validateFilter(index)"
                          inline
                        >
                          <v-col>
                            <v-radio label="Value Must Be False" :value="false" />
                          </v-col>
                          <v-col>
                            <v-radio label="Value Must Be True" :value="true" />
                          </v-col>
                        </v-radio-group>
                        <v-col v-if="filter.fieldType == 'Number' || !(filter.reference?.isField ?? true)">
                          <v-text-field
                            :disabled="!filter.fieldType || filter.nulled || !filter.reference"
                            :type="(filter.reference?.isField ?? true) ? 'text' : 'date'"
                            v-model="filters[index].maximum"
                            @blur="adjustInput(index, false)"
                            @update:modelValue="validateFilter(index)"
                            :label="!filter.reference?.isField ? 'To Date' : 'Maximum Value'"
                            clearable
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
                :disabled="referenceOptions.length <= 0 || filters.some(filter => !filter.valid) || !validType || !validFields"
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
            <br><br>
            <v-card-title align="center" style="font-size: 28px;">
              Reporting
            </v-card-title>
            <br>
            <v-row justify="center">
              <v-col class="text-right">
                <v-btn
                  color="primary"
                  size="large"
                  @click="reportByAssetType"
                  :disabled="!validType || includeFields.length <= 0 || filters.some(filter => !filter.valid && !filter.nulled)"
                  :loading="byTypeReportLoading"
                >
                  <v-icon
                    icon="mdi-clipboard-edit-outline"
                    size="x-large"
                    start
                  />
                  Generate Report
                </v-btn>
              </v-col>
              <v-col align="start" shrink>
                <v-btn
                  color="secondary"
                  size="large"
                  @click="downloadByAssetTypeReport"
                  :disabled="byTypeReport.length <= 0"
                >
                  <v-icon
                    icon="mdi-file-download-outline"
                    size="x-large"
                    start
                  />
                  Download as .CSV
                </v-btn>
              </v-col>
            </v-row>
            <br>
            <br>
            <br>
            <v-data-table
              :items="byTypeReport"
              :headers="byTypeHeaders"
            />
          </v-container>
        </v-card>
      </v-window-item>

      <v-window-item value="report-by-assignment">
        <v-card>
          <v-container>
            
          </v-container>
        </v-card>
      </v-window-item>
    </v-window>
  </v-container>
</template>

<style>
.expansion-nulled {
  border: 2px solid rgb(var(--v-theme-primary)); /* Set border properties as needed */
  border-radius: 4px; /* Optional: Add border radius */
}
</style>