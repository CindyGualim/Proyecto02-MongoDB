const { useState, useEffect } = React;

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><a href="restaurant.html">Listado de Restaurantes</a></li>
        <li><a href="#">Mejores Rankeados</a></li>
      </ul>
    </nav>
  );
}

function Home() {
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    // Obtener platos desde el backend
    fetch('http://localhost:5000/api/articulos')
      .then((res) => res.json())
      .then((data) => setFoodItems(data))
      .catch((err) => console.error('Error al cargar los platos:', err));
  }, []);

  return (
    <div className="home-container">
      <Navbar />
      <main className="contenido-principal">
        <h2>Bienvenido a FoodApp</h2>
        <p>Explora los mejores lugares para comer y descubre nuevas opciones.</p>
        <img src="Recursos/img01.jpg" width="100%" height="300" />
        <h2>Menu </h2>
        <p>Listado de comidas</p>
        {/* Cards de comidas */}
        <section style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '30px', justifyContent: 'center' }}>
          {foodItems.map((food, index) => (
            <div
              key={index}
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
                alt={food.nombre}
                style={{ width: '100%', height: '140px', objectFit: 'cover' }}
              />
              <div style={{ padding: '15px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{food.nombre}</h3>
                <p style={{ fontSize: '14px', color: '#555' }}>{food.descripcion}</p>
                <p style={{ fontWeight: 'bold', color: '#333' }}>Q{food.precio}</p>
                <p style={{ fontSize: '12px', color: '#888' }}>Restaurante ID: {food.restauranteId}</p>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

ReactDOM.render(<Home />, document.getElementById('root'));
