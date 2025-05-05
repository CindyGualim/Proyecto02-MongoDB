  const { useState } = React;

  function Register() {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleRegistro = async (e) => {
      e.preventDefault();

      if (!nombre || !correo || !password) {
        setMensaje('Completa todos los campos');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, correo, password })
        });

        const data = await res.json();

        if (res.ok) {
          setMensaje(' Registro exitoso. Redirigiendo...');
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 2000);
        } else {
          setMensaje(data.message || 'Error al registrarse');
        }
      } catch (err) {
        setMensaje('Error de conexión con el servidor');
      }
    };

    return (
      <div className="login-container">
        <h2>Registro</h2>
        <form onSubmit={handleRegistro}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Registrarse</button>
          {mensaje && <p className="mensaje">{mensaje}</p>}
        </form>
      </div>
    );
  }

  ReactDOM.render(<Register />, document.getElementById('root'));
