const { useState } = React;

function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!correo || !password) {
      setMensaje('Completa todos los campos');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje(`Bienvenido ${data.usuario.nombre}`);
        // Redirección
        if (data.usuario.correo === "admin@mail.com") {
          window.location.href = 'homeadmin.html';
        } else {
          window.location.href = 'home.html';
        }
      } else {
        setMensaje(data.message);
      }
    } catch (err) {
      setMensaje('Error de conexión con el servidor');
    }
  };

  const irARegistro = () => {
    window.location.href = 'register.html';
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Entrar</button>
        {mensaje && <p className="mensaje">{mensaje}</p>}
      </form>
      <hr />
      <button className="secundario" onClick={irARegistro}>Registrarse</button>
    </div>
  );
}

ReactDOM.render(<Login />, document.getElementById('root'));
