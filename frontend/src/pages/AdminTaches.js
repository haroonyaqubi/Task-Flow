import React from "react";
import Taches from "./Taches"; // FIXED: match exact filename

function AdminTaches() {
  return <Taches isAdmin={true} />;
}

export default AdminTaches;
