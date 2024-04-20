<script setup>
    import { ref, onMounted, computed, watch } from "vue";
    import { useRouter } from "vue-router";
    import { date, format } from "@formkit/tempo";
    import { VBtn } from 'vuetify/components';

    import Utils from "../config/utils.js";
    import assetServices from "../services/assetServices.js";
    import assetTypeServices from "../services/assetTypeManagementServices.js";
    import alertTypeServices from "../services/alertTypeService.js";
    import logServices from "../services/logServices.js";
    import assetCatServices from "../services/assetCatServices";
    import assetTemplateServices from "../services/assetTemplateServices.js";
    import personServices from "../services/personServices.js";
    import userServices from "../services/userServices.js";
    import alertServices from "../services/alertServices.js";
    import roomServices from "../services/roomServices.js";
    import buildingServices from "../services/buildingManagementServices.js";

    const user = Utils.getStore("user");
    const router = useRouter();
    const message = ref("");

    const props = defineProps({
      id: {
        required: true,
        default: null,
      },
    });

    const isBuilding = computed(() => {
        return allAssetCategories.value.length > 0
        && allAssetCategories.value.find(assetCat => assetCat.value == fullAsset.value.type.categoryId)?.title=='Locations';
    });

    const fullAsset = ref({
        id: (isNaN(parseInt(props.id)) || isNaN(new Number(props.id))) ? null : props.id,
        acquisitionDate: format(new Date(), "YYYY-MM-DD"),
        acquisitionPrice: 0,
        dueDate: null,
        condition: 'Like New',
        type: {
            id: null,
            identifierId: null,
            categoryId: null,
            fields: [],
        },
        templateId: null,
        template: {
            id: null,
        },
        borrower: {
            id: null,
            fName: null,
            lName: null,
            email: null,
        },
        location: null,
        building: {
            id: null,
            abbreviation: null,
        },
        logs: [],
        alerts: [],
    });
    const adding = computed(() => !fullAsset.value.id);
    const assetType = ref(null);
    const locations = ref([]);
    const tab = ref('alerts');
    const allAssetTypes = ref([]);
    const filteredAssetTypes = computed(() => allAssetTypes.value.filter(type => !fullAsset.value.type.categoryId || type.categoryId == fullAsset.value.type.categoryId ));
    const alertTypes = ref([]);
    const allAssetCategories = ref([]);
    const allAssetTemplates = ref([]);
    const formattedAccPrice = ref("0.00");
    const validAccPrice = computed(() => {
        const removeCommas = formattedAccPrice.value.replace(/,/g, "");
        return !isNaN(parseFloat(removeCommas)) && !isNaN(new Number(removeCommas));
    });
    const validAccDate = computed(() => {
        let success = !isNaN(new Date(fullAsset.value.acquisitionDate));
        try {
            format(fullAsset.value.acquisitionDate);
        }
        catch {
            success = false;
        }
        return success;
    });
    const validBuildingAbbreviation = computed (() => {
        const abb = fullAsset.value?.building?.abbreviation;
        return (!isBuilding.value
        || (isBuilding.value
        && (abb?.length ?? 0) > 0 && (abb?.length ?? 0) <= 25
        && locations.value.every(location => 
            abb != location.abbreviation
            || location.buildingId == fullAsset.value.building.id
        )));
    });
    const validateAbbreviation = computed(() => {
        const abb = fullAsset.value?.building?.abbreviation?.length ?? 0;
        return validBuildingAbbreviation.value || (abb > 0 && abb <= 25
        ? "Abbreviation must be unique!"
        : "Abbreviation must be between 0-25 characters!");
    });
    const filteredAssetTemplates = computed(() => allAssetTemplates.value.filter(template => template.assetTypeId == fullAsset.value.type.id));

    const fieldGridCols = ref(0);
    const fieldGridRef = ref([]);
    const fieldGrid = computed(() => {
        const grid = [];
        fieldGridCols.value = 0;

        fullAsset.value.type.fields.forEach(field => {
            if (!field.templateData && !field.assetData) field.assetData = { value: null };

            while (grid.length <= field.row)
            {
                const newRow = [];
                while (newRow.length <= field.column) newRow.push({ columnSpan: 1 });
                grid.push(newRow);
            }
            
            grid[field.row][field.column] = field;
            fieldGridCols.value = Math.max(fieldGridCols.value, grid[field.row].reduce((prev, curr) => prev += curr.columnSpan, 0));
        });
        
        grid.forEach(row => {
            let columns = row.reduce((prev, curr) => prev += curr.columnSpan, 0);
            while (columns != fieldGridCols.value)
            {
                if (columns < fieldGridCols.value)
                {
                    row.push({ columnSpan: 1 });
                    columns++;
                }
                else
                {
                    columns -= row.pop().columnSpan ?? 1;
                }
            }
        });
        
        fieldGridRef.value = grid;
        return grid;
    });

    const validAsset = computed(() => {
        return !!fullAsset.value.type.id
        && validAccPrice.value
        && validAccDate.value
        && !!validBuildingAbbreviation.value;
    });

    watch(formattedAccPrice, (newValue, oldValue) => {
        if (!validAccPrice.value) return;
        const decimal = formattedAccPrice.value.includes('.');
        fullAsset.value.acquisitionPrice = parseInt(formattedAccPrice.value.replace(".", "").replace(/,/g, "")) * (decimal ? 1 : 100);
    });

    const validNewAlert = computed(() => {
        const newAlert = fullAsset.value.alerts.find(alert => (alert.id ?? null) === null);
        if (!newAlert) return true;

        try {
            newAlert.date = format(newAlert.date, "YYYY-MM-DD");
        }
        catch {
            return false;
        }
        return !!alertTypes.value.find(type => type.value == newAlert.typeId);
    });

    const validNewLog = computed(() => {
        return true;
    });

    const validNewRoom = computed(() => {
        const targetRoomName = fullAsset.value.building.rooms.find(room => (room.value ?? null) === null)?.name ?? "";
        const uniqueNames = new Set(fullAsset.value.building?.rooms?.map(room => room.name) ?? []);
        return targetRoomName.length > 0 && targetRoomName.length <= 50 && uniqueNames.size == (fullAsset.value.building?.rooms?.length ?? 0);
    });

    const getFullAssetDetails = () => {
        assetServices.getFullAsset(fullAsset.value.id)
        .then(response => {
            fullAsset.value = response.data;
            fullAsset.value.acquisitionDate = format(fullAsset.value.acquisitionDate, 'YYYY-MM-DD');
            const unformattedAccPrice = `${fullAsset.value.acquisitionPrice}`; 
            formattedAccPrice.value = "";
            for(let i = 0; i < unformattedAccPrice.length; i++) {
                formattedAccPrice.value += unformattedAccPrice.length - i == 2 ? '.' + unformattedAccPrice[i] : unformattedAccPrice[i];
            }
            fullAsset.value.alerts.forEach((alert) => {
                alert.editing = false;
                alert.status = new Date(alert.date) > new Date() ? "Active" : "Expired";
                alert.date = format(alert.date, 'YYYY-MM-DD');
            });
            fullAsset.value.building?.rooms?.forEach((room) => {
                room.editing = false;
            });
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const getAllAlertTypes = () => {
        alertTypeServices.getAllAlertTypes()
        .then(response => {
            alertTypes.value = response.data.map((item) => {
                return {
                    title: item.name,
                    value: item.id,
                };
            })
        })
        .catch(error => {
            message.value = error.response.data.message;
        });
    };

    const getAllAssetTypes = () => {
        assetTypeServices.getAllAssetTypes() 
        .then(response => {
            allAssetTypes.value = response.data.map(assetType => ({
                title: assetType.name, 
                value: assetType.id,
                categoryId: assetType.categoryId,
            }));
            changeAssetType();
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const changeAssetCategory = () => {
        if (!!fullAsset.value.type.categoryId
            && allAssetTypes.value.find(type => type.value == fullAsset.value.type.id)?.categoryId !== fullAsset.value.type.categoryId)
            fullAsset.value.type.id = null;

        changeAssetType();
    };

    const changeAssetType = () => {
        if (!fullAsset.value?.type?.id) 
        {
            assetType.value = null;
            fullAsset.value.type.fields = [];
            return;
        }
        fullAsset.value.type.categoryId = allAssetTypes.value.find(type => type.value == fullAsset.value.type.id)?.categoryId;

        assetTypeServices.getFullAssetType(fullAsset.value.type.id)
        .then(response => {
            assetType.value = response.data;
            fullAsset.value.type.fields = response.data?.fields ?? [];
            if (!filteredAssetTemplates.value.map(template => template.value).includes(fullAsset.value.templateId))
            {
                fullAsset.value.templateId = null;
            }
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const getAllAssetCats = () => {
        allAssetCategories.value = [];
        assetCatServices.getAllAssetCats()
        .then(response => {
            allAssetCategories.value = response.data.map(assetCat => {
                return {
                    title: assetCat.name,
                    value: assetCat.id,
                }
            });
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const getAllAssetTemplates = () => {
        allAssetTemplates.value = [];
        assetTemplateServices.getAllAssetTemplates()
        .then(response => {
            allAssetTemplates.value = response.data.map(assetTemplate => {
                return {
                    title: assetTemplate.name,
                    value: assetTemplate.id,
                    assetTypeId: assetTemplate.assetTypeId,
                };
            });
            changeTemplate();
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const getAllRooms = () => {
        locations.value = [];
        roomServices.getAllRooms()
        .then(response => {
            locations.value = response.data.map(room => {
                return {
                    title: `${room.building.abbreviation} ${room.name}`,
                    value: room.id,
                    name: room.name,
                    buildingId: room.building.id,
                    abbreviation: room.building.abbreviation,
                };
            });
        })
        .catch(error => {
            message.value = error.response.data.message;
        });
    };

    const changeTemplate = () => {
        if (!fullAsset.value?.templateId)
            return;

        assetTemplateServices.getFullAssetTemplate(fullAsset.value.templateId)
        .then(response => {
            const templateData = response.data.assetType.fields
            .map(field => field.templateData)
            .filter(data => !!data);

            fullAsset.value.type.fields.forEach(field => {
                field.templateData = templateData.find(data => data.fieldId == field.id) ?? null;
            });
        })
        .catch(err => {
            message.value = err.response.data.message;
        });
    };

    const cancel = () => {
        router.go(-1);
    };

    const saveAsset = async () => {
        const addingAsset = adding.value;
        const request = () => addingAsset
        ? assetServices.createAsset(fullAsset.value)
        : assetServices.updateAsset(fullAsset.value.id, fullAsset.value);
        if (adding.value) fullAsset.value.typeId = fullAsset.value.type.id;

        const buildingRequest = (assetId) => addingAsset
        ? buildingServices.createBuilding({ ...fullAsset.value.building, assetId })
        : buildingServices.updateBuilding(fullAsset.value.building.id, fullAsset.value.building);
        
        let error = false;
        const response = await request()
        .catch(error => {
            console.log(error.response.data.message)
            error = true;
            message.value = error.response.data.message;
        });

        if (error) return;

        if (adding.value) fullAsset.value.id = response.data.id;

        await buildingRequest(fullAsset.value.id)
        .catch(error => {
            message.value = error.response.data.message;
        });

        getFullAssetDetails();
        getAllRooms();
    };

    //#region Alerts
    const editAlert = (id) => {
        const targetAlert = fullAsset.value.alerts.find(alert => alert.id == id);
        targetAlert.oldValues = { ...targetAlert };
        targetAlert.editing = true;
    };

    const cancelAlert = (id) => {
        const targetIndex = fullAsset.value.alerts.findIndex(alert => alert.id == id);
        if ((id ?? null) === null) return fullAsset.value.alerts.splice(targetIndex, 1);

        const targetAlert = fullAsset.value.alerts[targetIndex];
        fullAsset.value.alerts[targetIndex] = {
            ...targetAlert.oldValues,
        };
    };

    const saveAlert = (item) => {
        item.status = new Date(item.date) > new Date() ? "Active" : "Expired";
        item.assetId = fullAsset.value.id;
        const request = () => (item.id ?? null) === null
        ? alertServices.createAlert(item)
        : alertServices.updateAlert(item.id, item);
        
        request()
        .then(response => {
            router.go(0);
        })
        .catch(error => {
            console.log(error.response.data.message)
            message.value = error.response.data.message;
        });
    };

    const deleteAlert = (id) => {
        alertServices.deleteAlert(id)
        .then(response => {
            const targetIndex = fullAsset.value.alerts.findIndex(alert => alert.id == id);
            fullAsset.value.alerts.splice(targetIndex);
        })
        .catch(error => {
            message.value = error.response.data.message;
        })
    };

    const alertHeaders = ref([
        // { title: "Time Updated", value: "updatedAt", sortable: true },
        { title: "Expiration Date", value: "date", sortable: true },
        { title: "Alert Type", value: "typeId" },
        { title: "Notes", value: "description" },
        { title: "Status", value: "status" },
        { title: "", value: "actions", align: "end" },
    ]);

    const addAlert = () => {
        fullAsset.value.alerts = [{
            id: null,
            date: null,
            description: "",
            status: "",
            editing: true,
        }, ...fullAsset.value.alerts];
    };
    //#endregion

    //#region Logs
    const logHeaders = ref([
        { title: "Time Stamp", value: "date", sortable: true },
        { title: "Description", value: "description" },
        { title: "Type", value: "type" },
        { title: "Condition", value: "condition" },
        { title: "Status", value: "circulationStatus" },
    ]);

    const addLog = () => {
        fullAsset.value.alerts.push({
            id: null,
            date: null,
            description: "",
            type: "",
            condition: fullAsset.value.condition,
            status: "",
            editing: true,
        });

        // circulationStatus [dropdown]
        // maintenanceType [dropdown]
        // assetId [store, but don't display at all]
        // authorId [display author's person id, but store user id]
        // personId
    };
    //#endregion

    //#region Rooms
    const buildingHeaders = [
        {title: "Name", value: "name", sortable: true},
        {title: "", value: "actions", sortable: false, align: "end"},
    ];

    const addRoom = () => {
        fullAsset.value.building.rooms = [{
            id: null,
            name: "",
            buildingId: fullAsset.value.building.id,
            building: {
                abbreviation: fullAsset.value.building.abbreviation,
            },
            editing: true,
        }, ...fullAsset.value.building.rooms];
    };

    const cancelRoom = (id) => {
        const targetIndex = fullAsset.value.building.rooms.findIndex(room => room.id == id);
        if ((id ?? null) === null) return fullAsset.value.building.rooms.splice(targetIndex, 1);
        
        const targetRoom = fullAsset.value.building.rooms[targetIndex];
        fullAsset.value.alerts[targetIndex] = {
            ...targetRoom.oldValues,
        };
    };

    const editRoom = (id) => {
        const target = fullAsset.value.building.rooms.find(room => room.id == id);
        target.oldValues = { ...target };
        target.editing = true;
    };

    const deleteRoom = (id) => {
        roomServices.deleteRoom(id)
        .then(response => {
            let targetIndex = fullAsset.value.building.rooms.findIndex(room => room.id == id);
            fullAsset.value.building.rooms.splice(targetIndex, 1);
            
            targetIndex = locations.value.findIndex(room => room.value == id);
            if (targetIndex >= 0) locations.value.splice(targetIndex, 1);
        })
        .catch(error => {
            console.log(error)
            message.value = error.response.data.message;
        })
    };

    const saveRoom = (room) => {
        const request = () => !room.id
        ? roomServices.createRoom(room)
        : roomServices.updateRoom(room.id, room);

        request()
        .then(response => {
            router.go(0);
        })
        .catch(error => {
            message.value = error.response.data.message;
        });
    };
    //#endregion

    onMounted(() => {
        user.value = Utils.getStore("User");
        if (!adding.value) getFullAssetDetails();
        getAllAssetTypes();
        getAllAssetCats();
        getAllAssetTemplates(); 
        getAllAlertTypes();
        getAllRooms();
    });
</script>

<template>
    <v-container>
        <v-toolbar>
            <v-container>
                <v-row>
                    <v-col>
                        <v-toolbar-title
                        style="font-size: 28px;"
                        >{{ adding ? 'Add' : 'Edit' }} Asset
                        </v-toolbar-title>
                    </v-col>
                    <v-col>

                    </v-col>
                </v-row>
            </v-container>
        </v-toolbar>
        <br>
        <v-card>
            <v-container>
                <v-row>
                    <v-col>
                        <v-card-title 
                        style="
                        font-size: x-large;
                        ">General Asset Info</v-card-title>
                    </v-col>
                    <v-col class="mr-4">
                        <v-btn
                            @click="cancel()"
                            color="secondary" 
                            style= "margin-left: 2%;
                            float: right;
                            font-size: large;
                            "
                            size="large">
                            cancel
                        </v-btn>
                        <v-btn
                            @click="saveAsset(fullAsset.id)"
                            color="primary" 
                            style="float: right;
                            font-size: large;
                            "
                            size="large"
                            :disabled="!validAsset">
                            save
                        </v-btn>
                    </v-col>
                </v-row>
                <br>
                <v-row class="ma-1">
                    <v-col>
                        <v-combobox
                            :items="allAssetCategories"
                            :return-object = "false"
                            variant="outlined"
                            label="Category"
                            :readonly = "!adding"
                            :hint="adding?'' : 'Cannot change after creating asset'"
                            v-model="fullAsset.type.categoryId"
                            :clearable="adding"
                            @update:modelValue="changeAssetCategory()"
                        ></v-combobox>
                    </v-col>    
                    <v-col> 
                        <v-combobox
                        :items="filteredAssetTypes"
                        variant="outlined"
                        label="Type"
                        :return-object = "false"
                        auto-select-first
                        :readonly = '!adding'
                        :hint="adding?'' : 'Cannot change after creating asset'"
                        v-model="fullAsset.type.id"
                        :clearable="adding"
                        @update:modelValue="changeAssetType()"
                        ></v-combobox>
                    </v-col>
                    <v-col>
                        <v-combobox
                        :items="filteredAssetTemplates"
                        variant="outlined"
                        label="Template"
                        :return-object = 'false'
                        auto-select-first
                        v-model="fullAsset.templateId"
                        @update:modelValue="changeTemplate"
                        :hint="!fullAsset.type.id ? 'Cannot select template before asset type' : ''"
                        >
                        </v-combobox>
                    </v-col> 
                </v-row>
                <v-row class="ma-1">
                    <v-col>
                        <v-select
                        variant="outlined"
                        label="Condition"
                        rows="1"
                        :items="['Like New', 'Worn', 'Damaged', 'Out of Commission', 'Not in Inventory']"
                        v-model="fullAsset.condition"
                        />
                    </v-col>
                    <v-col>
                        <v-text-field
                        variant="outlined"
                        label="Aquisition Price"
                        prepend-inner-icon="mdi-currency-usd"
                        rows="1"
                        :rules="[validAccPrice]"
                        v-model="formattedAccPrice"
                        ></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field
                        variant="outlined"
                        type="date"
                        label="Acquisition Date"
                        v-model="fullAsset.acquisitionDate"
                        :rules="[validAccDate]"
                        ></v-text-field>
                    </v-col>                                           
                </v-row>
                <br>
                <v-row class="ma-1">
                    <v-col>
                        <v-combobox
                            v-if="!fullAsset.borrower"
                            label="Building and room"
                            variant="outlined"
                            :items="locations"
                        />
                        <v-combobox
                            v-else
                            label="Person"
                            variant="outlined"
                        />
                    </v-col>
                </v-row>
            </v-container>
        </v-card><br>
    <!--------------------------------------------------------------Fields Block----------------------------------------------------------->
        <v-card>
            <v-container>
                <v-row>
                    <v-col>
                        <v-card-title
                        class="mt-1"
                        style="
                        font-size: x-large;
                        ">Fields</v-card-title>
                    </v-col>
                    <v-col v-if="isBuilding">
                        <v-text-field
                            class="mr-4"
                            label="Building Abbreviation"
                            variant="outlined"
                            v-model="fullAsset.building.abbreviation"
                            :rules="[validateAbbreviation]"
                        />
                    </v-col>
                </v-row>
                <v-row v-for="(row, rowIndex) in fieldGrid" :key=rowIndex justify="center" class="ma-4">
                    <v-col v-for="(column, colIndex) in row"
                        :key="colIndex"
                        :cols="Math.round((fieldGridCols - column.columnSpan) / fieldGridCols * 12)"
                    >
                        <br>
                        <v-row v-if="column.label !== undefined" align="baseline">
                            <v-text-field
                                v-if="fieldGridRef[rowIndex][colIndex].templateField && !!fieldGridRef[rowIndex][colIndex].templateData?.value"
                                :label="fieldGridRef[rowIndex][colIndex].label"
                                v-model="fieldGridRef[rowIndex][colIndex].templateData.value"
                                variant="outlined"
                                disabled
                            />
                            <v-text-field
                                v-else
                                :label="fieldGridRef[rowIndex][colIndex].label"
                                v-model="fieldGridRef[rowIndex][colIndex].assetData.value"
                                variant="outlined"
                            />
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </v-card><br>
    <!------------------------------------------------------------Alerts and Logs------------------------------->
        <v-card :disabled="adding">
            <v-tabs
            v-model="tab"
            id="tabsBlock"
            >
                <v-tab value="alerts">Alerts</v-tab> 
                <v-tab value="logs">Logs</v-tab> 
                <v-tab v-if="isBuilding" value="rooms">{{ `${fullAsset.building.abbreviation} Rooms` }}</v-tab>
            </v-tabs>
            <v-card-text>
                <v-window v-model="tab">
                    <v-window-item value="alerts">
                        <v-data-table
                            :headers="alertHeaders"
                            :items="fullAsset.alerts"
                        >
                            <template v-slot:top>
                                <v-divider class="mx-4" inset vertical></v-divider>
                                <v-btn
                                    class="mb-2"
                                    color="primary"
                                    @click="addAlert"
                                    :disabled="!validNewAlert"
                                    style="margin-left: 85%; width: 15%;"
                                    dark
                                >
                                    Add Alert
                                </v-btn>
                            </template>

                            <!--Expiration Date-->
                            <template #item.date="{ item }">
                                <v-text-field
                                    v-if="item.editing"
                                    class="mt-6"
                                    label="Expiration Date"
                                    density="compact"
                                    variant="outlined"
                                    v-model="item.date"
                                    type = "date"
                                >
                                </v-text-field>
                                <td
                                v-else>
                                    {{ format(item.date) }}
                                </td>
                            </template>

                            <template #item.typeId="{ item }">
                                <v-autocomplete
                                v-if="item.editing"
                                    class="mt-6"
                                    label="Alert Type"
                                    density="compact"
                                    variant="outlined"
                                    v-model="item.typeId"
                                    :items="alertTypes"
                                >
                                </v-autocomplete>
                                <td v-else>
                                    {{ alertTypes.find(type => type.value == item.typeId)?.title ?? "Invalid Alert Type" }}
                                </td>
                            </template>

                            <template #item.description="{ item }">
                                <v-text-field
                                    v-if="item.editing"
                                    class="mt-6"
                                    label="Notes"
                                    density="compact"
                                    variant="outlined"
                                    v-model="item.description"
                                />
                                <td v-else>{{ item.description }}</td>
                            </template>

                            <template #item.actions="{ item }">
                                <v-btn @click="saveAlert(item)" 
                                :disabled="!validNewAlert"
                                class="mr-5"
                                color="primary"
                                v-if="item.editing"
                                >Save</v-btn>

                                <v-btn @click="cancelAlert(item.id)"
                                color="secondary"
                                v-if="item.editing"
                                >Cancel
                                </v-btn>

                                <v-btn 
                                class="ma-2"
                                color="primary"
                                @click="editAlert(item.id)"
                                size="small"
                                :icon="true"
                                v-if="!item.editing"
                                >
                                <v-icon>mdi-pencil</v-icon> 
                                </v-btn>

                                <v-btn 
                                    @click="deleteAlert(item.id)" 
                                    class="ma-2"
                                    color="primary"
                                    size="small"
                                    variant="outlined"
                                    :icon="true"
                                    v-if="!item.editing"
                                    >
                                    <v-icon>mdi-trash-can</v-icon>
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-window-item>
                    <v-window-item value="logs">
                        <v-data-table
                        :headers="logHeaders"
                        :items="fullAsset.logs"
                        :sort-by="[{ key: 'date', order: 'asc' }]"
                        >
                            <template v-slot:top>
                                <v-divider class="mx-4" inset vertical></v-divider>
                                <v-btn class="mb-2" color="primary" dark @click="addLog" style="margin-left: 85%; width: 15%;">
                                    Add Log
                                </v-btn>
                            </template>

                            <template #item.date="{ item }">
                                {{ format(item.date) }}
                            </template>
                        </v-data-table>
                    </v-window-item>
                    <v-window-item
                    v-if="isBuilding"
                    value="rooms"
                    >
                        <v-data-table
                        :headers="buildingHeaders"
                        :items="fullAsset.building?.rooms ?? []"
                        >
                            <template v-slot:top>
                                <v-divider class="mx-4" inset vertical></v-divider>
                                <v-btn class="mb-2" color="primary" dark @click="addRoom()" style="margin-left: 85%; width: 15%;">
                                    Add Room
                                </v-btn>
                            </template>

                            <template #item.name="{ item }">
                                <v-text-field
                                    v-if="item.editing"
                                    label="Room name"
                                    class="mt-6"
                                    density="compact"
                                    variant="outlined"
                                    :prefix="fullAsset.building.abbreviation"
                                    v-model="item.name"
                                />
                                <td v-else>
                                    {{ `${fullAsset.building.abbreviation} ${item.name}` }}
                                </td>
                            </template>

                            <template #item.actions="{ item }">
                                <v-btn @click="saveRoom(item)" 
                                :disabled="!validNewRoom"
                                class="mr-5"
                                color="primary"
                                v-if="item.editing"
                                >Save</v-btn>

                                <v-btn @click="cancelRoom(item.id)"
                                color="secondary"
                                v-if="item.editing"
                                >Cancel
                                </v-btn>

                                <v-btn 
                                class="ma-2"
                                color="primary"
                                @click="editRoom(item.id)"
                                size="small"
                                :icon="true"
                                v-if="!item.editing"
                                >
                                <v-icon>mdi-pencil</v-icon> 
                                </v-btn>

                                <v-btn 
                                    @click="deleteRoom(item.id)" 
                                    class="ma-2"
                                    color="primary"
                                    size="small"
                                    variant="outlined"
                                    :icon="true"
                                    v-if="!item.editing"
                                    >
                                    <v-icon>mdi-trash-can</v-icon>
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-window-item>
                </v-window>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<style>
.tabsBlock{ /**Def need this */
    width: 90%;
}
</style>