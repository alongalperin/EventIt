const CreateEventComponent = () => {
  auditLoading("CreateEventComponent");
  return import(/* webpackChunkName: "group-LoginComponent" */ "../components/CreateEventComponent");
};

const GuestComponent = () => {
  auditLoading("GuestComponent");
  return import(/* webpackChunkName: "group-LoginComponent" */ "../components/GuestComponent");
};

const ManageEventComponent = () => {
  auditLoading("ManageEventComponent");
  return import(/* webpackChunkName: "group-LoginComponent" */ "../components/ManageEventComponent");
};

function auditLoading(componentName) {
  console.log(`Lazy Loading: ${componentName}`);
}

const routes = [
  {
    path: "/",
    name: "create",
    component: CreateEventComponent,
    meta: {
      title: "a",
    },
  },
  {
    path: "/guest/:eventId/:guestId",
    name: "guest",
    component: GuestComponent,
  },
  {
    path: "/manage/:id",
    name: "manage",
    component: ManageEventComponent,
  },
];

export default routes;
