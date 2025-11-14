import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createHashRouter, RouterProvider } from "react-router";
import App from "./App";
import Home from "./components/Home";
import SenatorsTable from "./components/SenatorsTable";
import NomineesTable from "./components/NomineesTable";
import SlatesTable from "./components/SlatesTable";
import PositionsTable from "./components/PositionsTable";
import NomineeDetail from "./components/NomineeDetail";
import SenatorDetail from "./components/SenatorDetail";
import SlateDetail from "./components/SlateDetail";
import PositionDetail from "./components/PositionDetail";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "senators", element: <SenatorsTable /> },
      { path: "senators/:senatorId", element: <SenatorDetail /> },
      { path: "nominees", element: <NomineesTable /> },
      { path: "nominees/:nomineeId", element: <NomineeDetail /> },
      { path: "slates", element: <SlatesTable /> },
      { path: "slates/:slateId", element: <SlateDetail /> },
      { path: "positions", element: <PositionsTable /> },
      { path: "positions/:positionId", element: <PositionDetail /> },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
