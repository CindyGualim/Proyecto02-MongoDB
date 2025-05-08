/* restaurant.js – listado de restaurantes con su propio menú */
const { useState, useEffect } = React;

/* ---------- Barra ----------------------- */
const Navbar = () => (
  <nav className="navbar">
    <ul className="nav-list">
      <li><a href="restaurant.html">Restaurantes</a></li>
      <li><a href="mejores.html">Mejores Rankeados</a></li>
      <li><a href="perfil.html">Mi Perfil</a></li>
    </ul>
  </nav>
);

/* ---------- Página ---------------------- */
function RestaurantPage() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [platos,       setPlatos]       = useState([]);
  const [err,          setErr]          = useState(null);

  /* Datos */
  useEffect(() => {
    fetch('http://localhost:5000/api/restaurantes')
      .then(r => r.json()).then(setRestaurantes)
      .catch(()=>setErr('Error cargando restaurantes'));

    fetch('http://localhost:5000/api/articulos')
      .then(r => r.json()).then(setPlatos)
      .catch(()=>setErr('Error cargando platillos'));
  }, []);

  /* Card restaurante */
  const Card = ({r}) => (
    <div className="rest-card" onClick={()=>{
      window.location.href=`menurestaurante.html?id=${r._id}`;
    }}>
      <h3>{r.nombre}</h3>
      <small className="dir">
        Zona {r.direccion?.zona} – {r.direccion?.municipio}
      </small>
      <span className="ver-mas">Ver menú ➜</span>
      {/* --- menú embebido cortito ---- */}
      {platos.filter(p => String(p.restauranteId) === String(r._id))
        .slice(0,3)           // sólo 3 para no alargar
        .map(p=><p key={p._id} style={{fontSize:'.8rem'}}>- {p.nombre}</p>)}
    </div>
  );

  return(
    <div className="home-container">
      <Navbar/>
      <main className="contenido-principal">
        <h2 className="titulo-pagina">Restaurantes Disponibles</h2>
        {err && <p>{err}</p>}
        <section className="grid-rest">
          {restaurantes.map(r => <Card key={r._id} r={r}/>)}
        </section>
      </main>
    </div>
  );
}

ReactDOM.render(<RestaurantPage/>, document.getElementById('root'));
