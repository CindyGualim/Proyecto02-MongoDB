const { useState, useEffect } = React;

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><a href="homeadmin.html">Menú</a></li>
        <li><a href="#">Listado de Restaurantes</a></li>
      </ul>
    </nav>
  );
}

function Food() {
  const [foodItems, setFoodItems] = useState([]);
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Cargar artículos al inicio
  useEffect(() => {
    fetch('http://localhost:5000/api/articulos')
      .then(res => res.json())
      .then(data => setFoodItems(data))
      .catch(err => console.error('Error al cargar artículos:', err));
  }, []);

  const handleDeleteFood = async (id) => {
    try {
        const res = await fetch(`http://localhost:5000/api/articulos/${id}`, {
          method: 'DELETE',
        });

      if (!res.ok) throw new Error('Error al eliminar artículo');

      setFoodItems(foodItems.filter(item => item._id !== id));
      setMensaje('✅ Artículo eliminado correctamente');
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al eliminar artículo');
    }

    setTimeout(() => setMensaje(''), 3000);
  };

  const handleDeleteByName = async () => {
    if (!nombre) {
      setMensaje('❗ Ingresa el nombre del artículo');
      setTimeout(() => setMensaje(''), 3000);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/articulos/eliminar', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre }),
      });

      if (!res.ok) throw new Error('Error al eliminar artículo');

      const data = await res.json();
      setFoodItems(foodItems.filter(item => item.nombre !== nombre));
      setMensaje(`✅ Artículo(s) con nombre "${nombre}" eliminado(s) correctamente`);
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al eliminar artículo(s)');
    }

    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className="home-container">
      <Navbar />
      <main className="contenido-principal">
        <h2>Bienvenido a FoodApp</h2>
        <p>Explora los mejores lugares para comer y descubre nuevas opciones.</p>
        <img
          src="Recursos/img01.jpg"
          alt="Banner"
          width="100%"
          height="300"
        />

        <div>
          <h3>Eliminar artículos por Nombre</h3>
          <input
            type="text"
            placeholder="Nombre del Artículo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <button onClick={handleDeleteByName}>Eliminar por Nombre</button>

          {mensaje && (
            <p style={{
              marginTop: '10px',
              color: mensaje.includes('Error') || mensaje.includes('Por favor') ? 'red' : 'green'
            }}>
              {mensaje}
            </p>
          )}
        </div>

        <div className="container marketing">
          <h3>Lista de Comidas</h3>
          <div className="row">
            {foodItems.map((food, index) => (
              <div className="col-lg-2" key={food._id || index}>
                <img
                  className="img-circle"
                  src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
                  alt="Comida"
                  width="140"
                  height="140"
                />
                <h2>{food.nombre}</h2>
                <p>{food.descripcion}</p>
                <p><strong>Q{food.precio}</strong></p>
                <p style={{ fontSize: 'small', color: '#888' }}>Restaurante ID: {food.restauranteId}</p>
                <button onClick={() => handleDeleteFood(food._id)}>🗑️ Eliminar</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

ReactDOM.render(<Food />, document.getElementById('root'));
