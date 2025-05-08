const {useState,useEffect}=React;

const Navbar=()=>(
  <nav className="navbar">
    <ul className="nav-list">
      <li><a href="restaurant.html">Restaurantes</a></li>
      <li><a href="mejores.html">Mejores Rankeados</a></li>
      <li><a href="perfil.html">Mi Perfil</a></li>
    </ul>
  </nav>
);

function Mejores(){
  const [data,setData]=useState([]);
  const [skip,setSkip]=useState(0);

  const load=()=>fetch(`http://localhost:5000/api/mejores?skip=${skip}&limit=6`)
    .then(r=>r.json()).then(setData);

  useEffect(load,[skip]);

  return(
    <div className="home-container">
      <Navbar/>
      <main className="contenido-principal">
        <h2 className="titulo-pagina">TOP Restaurantes</h2>

        <section className="grid-rest">
          {data.map(r=>(
            <div className="rest-card" key={r.restauranteId}>
              <h3>{r.nombre}</h3>
              <p className="dir">{r.municipio}</p>
              <p>⭐ {r.avgRating.toFixed(1)} ({r.totalResenas})</p>
              <span className="ver-mas" onClick={()=>location.href=`menurestaurante.html?id=${r.restauranteId}`}>Ver menú ➜</span>
            </div>
          ))}
        </section>

        <div style={{marginTop:'1.5rem'}}>
          {skip>0 && <button onClick={()=>setSkip(skip-6)}>Anterior</button>}
          {data.length===6 && <button onClick={()=>setSkip(skip+6)}>Siguiente</button>}
        </div>
      </main>
    </div>
  );
}

ReactDOM.render(<Mejores/>,document.getElementById('root'));
