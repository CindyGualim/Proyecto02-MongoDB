/*  Home.jsx – muestra platos con el nombre del restaurante  */
const { useState, useEffect } = React;

/* ---------- Navbar reutilizable ------------------------ */
const Navbar = () => (
  <nav className="navbar">
    <ul className="nav-list">
      <li><a href="restaurant.html">Restaurantes</a></li>
      <li><a href="mejores.html">Mejores Rankeados</a></li>
      <li><a href="perfil.html">Mi Perfil</a></li>
    </ul>
  </nav>
);

/* -------------------- Página --------------------------- */
function Home() {
  const [platos,       setPlatos]       = useState([]);
  const [restaurantes, setRestaurantes] = useState([]);
  const [err,          setErr]          = useState(null);

  /* 1. Traer restaurantes y platos ---------------------- */
  useEffect(() => {
    /* restaurantes */
    fetch('http://localhost:5000/api/restaurantes')
      .then(r => r.json())
      .then(setRestaurantes)
      .catch(() => setErr('No se pudieron cargar los restaurantes'));

    /* platos / artículos de menú */
    fetch('http://localhost:5000/api/articulos')
      .then(r => r.json())
      .then(setPlatos)
      .catch(() => setErr('No se pudieron cargar los platillos'));
  }, []);

  /* 2. Diccionario id → nombre para lookup rápido -------- */
  const mapaRest = Object.fromEntries(
    restaurantes.map(r => [String(r._id), r.nombre])
  );

  return (
    <div className="home-container">
      <Navbar/>

      <main className="contenido-principal">
        <h2>Bienvenido a FoodApp</h2>
        <p>Explora los mejores lugares para comer y descubre nuevas opciones.</p>
        <img src="Recursos/img01.jpg" width="100%" height="300" />

        <h2>Menú</h2>
        <p>Listado de comidas</p>

        {err && <p>{err}</p>}

        {/* GRID de tarjetas */}
        <section style={{
          display:'flex', flexWrap:'wrap', gap:'20px',
          marginTop:'30px', justifyContent:'center'
        }}>
          {platos.map((plato) => (
            <div key={plato._id} className="rest-card" style={{width:'250px'}}>
              <img
                src="Recursos/img02.jpg"
                alt={plato.nombre}
                style={{ width:'100%', height:'140px', objectFit:'cover' }}
              />
              <div style={{padding:'15px'}}>
                <h3 style={{margin:'0 0 .5rem 0'}}>{plato.nombre}</h3>
                <small style={{color:'#888'}}>
                  {/* 👇 nombre del restaurante */}
                  {mapaRest[plato.restauranteId] || 'Restaurante desconocido'}
                </small>
                <p style={{fontSize:'14px',margin:'.4rem 0'}}>{plato.descripcion}</p>
                <strong>Q{plato.precio}</strong>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

ReactDOM.render(<Home/>, document.getElementById('root'));
