import { useNavigate } from 'react-router-dom';



const MainPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  navigate("/login");
};

  return (
    <div className='Container'>
      <p>Bem-vindo, {user?.nome || "Utilizador"} ({user?.role})</p>
      <button onClick={handleLogout} style={{ float: "left" }}>Logout</button>
      <h1>Main Page</h1>
      <button className="button" onClick={() => navigate('/addFerramenta')}>Adicionar Ferramentas</button>
      <button className="button" onClick={() => navigate('/addFamiliaComponentes')}>Adicionar Familia de Componentes</button>
      <button className="button" onClick={() => navigate('/addComponente')}>Adicionar Componentes</button>
      <button className="button" onClick={() => navigate('/showFerramenta')}>Mostrar Ferramentas</button>
      <button className="button" onClick={() => navigate('/showFamilias')}>Mostrar Familias</button>
      <button className="button" onClick={() => navigate('/showComponentes')}>Mostrar Componentes</button>
      <button className="button" onClick={() => navigate('/FormAddIntrucao')}>Adicionar Instrução de Trabalho</button>
      <button className="button" onClick={() => navigate('/ViewInstrucoes')}>Consultar Instruções de Trabalho</button>
      <button className="button" onClick={() => navigate('/ListaUsers')}>Consultar Users</button>
    </div>
  );
};

export default MainPage;
