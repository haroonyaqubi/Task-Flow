import React from "react";
import Taches from "./Taches";

function AdminTaches() {
  // Pass `isAdmin` prop to enable delete buttons and admin privileges
  return <Taches isAdmin={true} />;
}

export default AdminTaches;
