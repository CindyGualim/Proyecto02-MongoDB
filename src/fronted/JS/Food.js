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
      const [foodName, setFoodName] = useState('');
      const [foodDescription, setFoodDescription] = useState('');

      const handleAddFood = () => {
        if (foodName && foodDescription) {
          const newFoodItem = {
            name: foodName,
            description: foodDescription,
          };
          setFoodItems([...foodItems, newFoodItem]);
          setFoodName('');
          setFoodDescription('');
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
                placeholder="Nombre de la comida"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
              />
              <textarea
                placeholder="Descripción de la comida"
                value={foodDescription}
                onChange={(e) => setFoodDescription(e.target.value)}
              ></textarea>
              <button onClick={handleAddFood}>Agregar Comida</button>
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
                    <h2>{food.name}</h2>
                    <p>{food.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      );
    }

    ReactDOM.render(<Food />, document.getElementById('root'));