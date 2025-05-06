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

function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <main className="contenido-principal">
        <h2>Bienvenido a FoodApp</h2>
        <p>Explora los mejores lugares para comer y descubre nuevas opciones.</p>
        <img src="Recursos/img01.jpg" width="100%" height="300" />
      </main>
    </div>
  );
}

ReactDOM.render(<Home />, document.getElementById('root'));
