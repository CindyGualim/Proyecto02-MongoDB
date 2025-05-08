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
  const [platos, setPlatos] = useState([]);

  useEffect(() => {
    // Cargar restaurantes
    fetch('http://localhost:5000/api/restaurantes')
      .then((res) => res.json())
      .then((data) => setRestaurantes(data))
      .catch((err) => console.error('Error al cargar los restaurantes:', err));

    // Cargar platos
    fetch('http://localhost:5000/api/articulos')
      .then((res) => res.json())
      .then((data) => setPlatos(data))
      .catch((err) => console.error('Error al cargar los platos:', err));
  }, []);

  return (
    <div className="home-container">
      <Navbar />
      <main className="contenido-principal">
        <h2>Bienvenido a FoodApp</h2>
        <p>Explora los mejores lugares para comer y descubre nuevas opciones.</p>
        <img src="Recursos/img01.jpg" width="100%" height="300" />

        <h2>Restaurantes y sus Platos</h2>

        {restaurantes.map((restaurante, i) => {
          const platosRestaurante = platos.filter(
            (plato) => plato.restauranteId === restaurante._id
          );

          return (
            <div key={i} style={{ marginBottom: '50px' }}>
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

              {platosRestaurante.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px', justifyContent: 'center' }}>
                  {platosRestaurante.map((plato, j) => (
                    <div
                      key={j}
                      style={{
                        width: '250px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden',
                        backgroundColor: 'white',
                        textAlign: 'center'
                      }}
                    >
                      <img
                        src="Recursos/img02.jpg"
                        alt={plato.nombre}
                        style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                      />
                      <div style={{ padding: '15px' }}>
                        <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{plato.nombre}</h3>
                        <p style={{ fontSize: '14px', color: '#555' }}>{plato.descripcion}</p>
                        <p style={{ fontWeight: 'bold', color: '#333' }}>Q{plato.precio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontStyle: 'italic' }}>Este restaurante aún no tiene platos registrados.</p>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}

ReactDOM.render(<Home />, document.getElementById('root'));
