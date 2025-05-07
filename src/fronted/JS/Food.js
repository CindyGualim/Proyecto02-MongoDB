const { useState } = React;

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><a href="#">Menú</a></li>
        <li><a href="#">Listado de Restaurantes</a></li>
        <li><a href="#">Mejores Rankeados</a></li>
      </ul>
    </nav>
  );
}

function Food() {
  const [foodItems, setFoodItems] = useState([]);
  const [restauranteId, setRestauranteId] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleAddFood = async () => {
    if (restauranteId && nombre && descripcion && precio) {
      const newFoodItem = {
        restauranteId,
        nombre,
        descripcion,
        precio: parseFloat(precio),
      };

      try {
        const res = await fetch('http://localhost:5000/api/articulos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newFoodItem),
        });

        if (!res.ok) throw new Error('Error al guardar en el servidor');

        setFoodItems([...foodItems, newFoodItem]);
        setRestauranteId('');
        setNombre('');
        setDescripcion('');
        setPrecio('');
        setMensaje(' Comida agregada correctamente en la base de datos');
      } catch (err) {
        console.error(err);
        setMensaje(' Error al guardar comida en la base de datos');
      }

      setTimeout(() => setMensaje(''), 3000);
    } else {
      setMensaje('❗ Por favor llena todos los campos');
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  return (
    <div className="home-container">
      <Navbar />
      <main className="contenido-principal">
        <h2>Bienvenido a FoodApp</h2>
        <p>Explora los mejores lugares para comer y descubre nuevas opciones.</p>
        <img
          src="Recursos/img01.jpg"
          alt="Generic placeholder"
          width="100%"
          height="300"
        />

        {/* Formulario para agregar comida */}
        <div>
          <h3>Agregar Comida</h3>
          <input
            type="text"
            placeholder="ID del Restaurante"
            value={restauranteId}
            onChange={(e) => setRestauranteId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nombre de la comida"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <textarea
            placeholder="Descripción de la comida"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          ></textarea>
          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
          <button onClick={handleAddFood}>Agregar Comida</button>

          {mensaje && (
            <p style={{ marginTop: '10px', color: mensaje.includes('Error') || mensaje.includes('Por favor') ? 'red' : 'green' }}>
              {mensaje}
            </p>
          )}
        </div>

        {/* Mostrar lista de comidas agregadas */}
        <div className="container marketing">
          <h3>Lista de Comidas</h3>
          <div className="row">
            {foodItems.map((food, index) => (
              <div className="col-lg-2" key={index}>
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
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

ReactDOM.render(<Food />, document.getElementById('root'));