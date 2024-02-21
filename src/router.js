import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
import TutorialsList from "./views/TutorialsList.vue";
import EditTutorial from "./views/EditTutorial.vue";
import AddTutorial from "./views/AddTutorial.vue";
import ViewTutorial from "./views/ViewTutorial.vue";
import AddLesson from "./views/AddLesson.vue";
import EditLesson from "./views/EditLesson.vue";


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
      path: "/assetData",
      name: "assetData",
      component: AssetData,
    },
    {
      path: "/assetType",
      name: "assetType",
      component: AssetTypeManagement,
    },
    {
      path: "/assetCategory",
      name: "assetCategory",
      component: AssetCatManagement,
    },
    {
      path: "/assetTemplate",
      name: "assetTemplate",
      component: AssetTemplateManagement,
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
      path: "/rooms",
      name: "rooms",
      component: RoomManagement,
    },
    {
      path: "/templateData",
      name: "templateData",
      component: TemplateDataManagement,
    },
    {
      path: "/vendors",
      name: "vendors",
      component: VendorManagement,
    },
    {
      path: "/alertType",
      name: "alertType",
      component: AlertTypeManagement,
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
