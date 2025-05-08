const { useState, useEffect } = React;

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><a href="#">Listado de Restaurantes</a></li>
        <li><a href="#">Mejores Rankeados</a></li>
      </ul>
    </nav>
  );
}

function Home() {
  const [restaurantes, setRestaurantes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/restaurantes') // NOTA: usa /api/restaurantes (sin /con-platos)
      .then((res) => res.json())
      .then((data) => setRestaurantes(data))
      .catch((err) => console.error('Error al cargar los restaurantes:', err));
  }, []);

  return (
    <div className="home-container">
      <Navbar />
      <main className="contenido-principal">
        <h2>Bienvenido a FoodApp</h2>
        <p>Explora los mejores lugares para comer y descubre nuevas opciones.</p>
        <img src="Recursos/img01.jpg" width="100%" height="300" />

        <h2>Restaurantes</h2>

        {restaurantes.map((restaurante, i) => (
            <div key={i} style={{ marginBottom: '30px' }}>
              <h3>{restaurante.nombre}</h3>
              {restaurante.direccion && restaurante.direccion.calle ? (
                <p>
                  {restaurante.direccion.calle}, Zona {restaurante.direccion.zona} -{' '}
                  {restaurante.direccion.municipio}, {restaurante.direccion.departamento}
                </p>
              ) : (
                <p>Dirección no disponible</p>
              )}
              <p>Teléfono: {restaurante.telefono || 'No disponible'}</p>
            </div>
          ))}


      </main>
    </div>
  );
}

ReactDOM.render(<Home />, document.getElementById('root'));
