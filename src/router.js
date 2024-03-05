import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
// import TutorialsList from "./views/TutorialsList.vue";
// import EditTutorial from "./views/EditTutorial.vue";
// import AddTutorial from "./views/AddTutorial.vue";
// import ViewTutorial from "./views/ViewTutorial.vue";
// import AddLesson from "./views/AddLesson.vue";
// import EditLesson from "./views/EditLesson.vue";
// import AllAssets from "./views/AllAssets.vue";
import AssetData from "./views/AssetData.vue";
import AssetTypeManagement from "./views/AssetTypeManagement.vue";
import AssetCatManagement from "./views/ManageAssetCategories.vue";
import AssetTemplateManagement from "./views/AssetTemplateManagement.vue";
import AssetFieldManagement from "./views/AssetFieldManagement.vue";
import BuildingManagement from "./views/BuildingManagement.vue";
import GroupManagement from "./views/GroupManagement.vue";
import PersonManagement from "./views/PersonManagement.vue";
import ViewPerson from './views/EditPerson.vue';
import RoomManagement from "./views/RoomManagement.vue";
import TemplateDataManagement from "./views/TemplateDataManagement.vue";
import VendorManagement from "./views/VendorManagement.vue";
import Alerts from "./views/AlertManagement.vue";
import AlertTypeManagement from "./views/AlertTypeManagement.vue";
import FieldList from "./views/fieldLists.vue";
import FieldListOptions from "./views/fieldListOptions.vue";
import Logs from "./views/logs.vue";
import Notifications from "./views/notificationsManagement.vue";
import Permissions from "./views/permissionManagement.vue";
import Users from "./views/userManagement.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
	{
		path: "/",
		alias: "/login",
		name: "login",
		component: Login,
	},
	{
		path: "/",
		alias: "/home",
		name: "home",
		component: Home,
	},
    {
      path: "/assets",
      name: "assets",
      component: AllAssets,
    },
    {
      path: "/asset-data",
      name: "asset-data",
      component: AssetData,
    },
    {
      path: "/asset-type",
      name: "asset-type",
      component: AssetTypeManagement,
    },
    {
      path: "/asset-categories",
      name: "asset-categories",
      component: AssetCatManagement,
    },
    {
      path: "/asset-templates",
      name: "asset-templates",
      component: AssetTemplateManagement,
    },
    {
      path: "/asset-fields",
      name: "asset-fields",
      component: AssetFieldManagement,
    },
    {
      path: "/buildings",
      name: "buildings",
      component: BuildingManagement,
    },
    {
      path: "/groups",
      name: "groups",
      component: GroupManagement,
    },
    {
      path: "/people",
      name: "people",
      component: PersonManagement,
    },
    {
      path: "/person",
      name: "person",
      component: ViewPerson,
    },
    {
      path: "/rooms",
      name: "rooms",
      component: RoomManagement,
    },
    {
      path: "/template-data",
      name: "template-data",
      component: TemplateDataManagement,
    },
    {
      path: "/vendors",
      name: "vendors",
      component: VendorManagement,
    },
    {
      path: "/alerts",
      name: "alerts",
      component: Alerts,
    },
    {
      path: "/alert-types",
      name: "alert-types",
      component: AlertTypeManagement,
    },
    {
      path: "/field-list",
      name: "field-list",
      component: FieldList,
    },
    {
      path: "/field-list-options",
      name: "field-list-options",
      component: FieldListOptions,
    },
    {
      path: "/logs",
      name: "logs",
      component: Logs,
    },
    {
      path: "/notifications",
      name: "notifications",
      component: Notifications,
    },
    {
      path: "/permissions",
      name: "permissions",
      component: Permissions,
    },
    {
      path: "/users",
      name: "users",
      component: Users,
    },
    //{
    //   path: "/tutorials",
    //   name: "tutorials",
    //   component: TutorialsList,
    // },
    // {
    //   path: "/edit/:id",
    //   name: "edit",
    //   component: EditTutorial,
    //   props: true,
    // },
    // {
    //   path: "/add",
    //   name: "add",
    //   component: AddTutorial,
    // },
    // {
    //   path: "/view/:id",
    //   name: "view",
    //   component: ViewTutorial,
    //   props: true,
    // },
    // {
    //   path: "/addLesson/:tutorialId",
    //   name: "addLesson",
    //   component: AddLesson,
    //   props: true,
    // },
    // {
    //   path: "/editLesson/:tutorialId/:lessonId",
    //   name: "editLesson",
    //   component: EditLesson,
    //   props: true,
    // },
  ],
});

export default router;
