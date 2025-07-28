import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Ferramentas from "./FrontEnd/Views/ViewFerramentas.jsx";
import FormFerramenta from "./FrontEnd/Views/FormFerramentas.jsx";
import MainPage from "./FrontEnd/Views/MainPage.jsx";
import ViewCategorias from "./FrontEnd/Views/ViewCategorias.jsx";
import ViewComponentes from "./FrontEnd/Views/ViewComponentes.jsx";
import FormCategorias from "./FrontEnd/Views/FormCategorias.jsx";
import FormComponentes from "./FrontEnd/Views/FormComponentes.jsx";
import ViewVideos from "./FrontEnd/Views/ViewVideos.jsx";
import AddSubtitles from "./FrontEnd/Views/AddSubtitles.jsx";
import FormAddIntrucao from "./FrontEnd/Views/AddInstrucaoTrabalho.jsx";
import ViewInstructions from "./FrontEnd/Views/ListIntrucoesTrabalho.jsx";
import EditComponentes from "./FrontEnd/Views/EditComponentes.jsx";
import EditFerramentas from "./FrontEnd/Views/EditFerramentas.jsx";
import Register from "./FrontEnd/Views/Register.jsx";
import Login from "./FrontEnd/Views/Login.jsx";
import ListaUtilizadores from "./FrontEnd/Views/ListUsers.jsx";
import MainPageUser from "./FrontEnd/Views/MainPageUser.jsx";
import MainPageCI from "./FrontEnd/Views/MainPageCI.jsx";
import MainPageAdmin from "./FrontEnd/Views/MainPageAdmin.jsx";
import AddVersaoInstrucao from "./FrontEnd/Views/AddVersaoInstrucao.jsx";
import FormEPI from "./FrontEnd/Views/FormEpi.jsx";
import ShowEpi from "./FrontEnd/Views/showEpi.jsx";
import InstrucaoResources from "./FrontEnd/Views/InstrucaoResources.jsx";
import ViewVersoes from "./FrontEnd/Views/ViewVersoes.jsx";
import FormularioAutoavaliacao from "./FrontEnd/Views/Formulario.jsx";
import ProtectedRoute from "./FrontEnd/Views/ProtectedRoute.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route
          path="/ListaUsers"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ListaUtilizadores />
            </ProtectedRoute>
          }
        />
        <Route path="/Login" element={<Login />} />
        <Route
          path="/MainPageUser"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MainPageUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/MainPageCI"
          element={
            <ProtectedRoute allowedRoles={["criador_instrucoes", "admin"]}>
              <MainPageCI />
            </ProtectedRoute>
          }
        />
        <Route
          path="/MainPageAdmin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MainPageAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/showFerramenta"
          element={
            <ProtectedRoute allowedRoles={["criador_instrucoes", "admin"]}>
              <Ferramentas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addFerramenta"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <FormFerramenta />
            </ProtectedRoute>
          }
        />
        <Route
          path="/showCategorias"
          element={
            <ProtectedRoute allowedRoles={["criador_instrucoes", "admin"]}>
              <ViewCategorias />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addCategoria"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <FormCategorias />
            </ProtectedRoute>
          }
        />
        <Route
          path="/showComponentes"
          element={
            <ProtectedRoute allowedRoles={["criador_instrucoes", "admin"]}>
              <ViewComponentes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addComponente"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <FormComponentes />
            </ProtectedRoute>
          }
        />
        <Route path="/ViewVideos/:videoId" element={<ViewVideos />} />
        <Route
          path="/AddSubtitles/:videoId"
          element={
            <ProtectedRoute allowedRoles={["criador_instrucoes"]}>
              <AddSubtitles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/InstrucaoResources/:videoId/:titulo/:versao"
          element={<InstrucaoResources />}
        />
        <Route
          path="/NovaVersao/:titulo/:versao"
          element={
            <ProtectedRoute allowedRoles={["criador_instrucoes"]}>
              <AddVersaoInstrucao />
            </ProtectedRoute>
          }
        />
        <Route
          path="/FormAddIntrucao"
          element={
            <ProtectedRoute allowedRoles={["criador_instrucoes"]}>
              <FormAddIntrucao />
            </ProtectedRoute>
          }
        />
        <Route path="/ViewInstrucoes" element={<ViewInstructions />} />
        <Route path="/ViewVersoes/:titulo" element={<ViewVersoes />} />
        <Route
          path="/NovaVersao/:titulo/:versao"
          element={<AddVersaoInstrucao />}
        />
        <Route
          path="/editarComponente/:numero_peca"
          element={<EditComponentes />}
        />
        <Route
          path="/editarFerramenta/:numero_peca"
          element={<EditFerramentas />}
        />
        <Route
          path="/FormEpi"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <FormEPI />
            </ProtectedRoute>
          }
        />
        <Route path="/showEpi" element={<ShowEpi />} />
        <Route
          path="/Formulario/:videoId/:titulo/:versao"
          element={<FormularioAutoavaliacao />}
        />
      </Routes>
    </Router>
  );
}

export default App;
