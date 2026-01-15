import React from "react";
import Taches from "./Taches";

// Admin tasks page - just a wrapper around Taches component
// The isAdmin prop tells Taches to show admin features
function AdminTaches() {
  return <Taches isAdmin={true} />;
}

export default AdminTaches;