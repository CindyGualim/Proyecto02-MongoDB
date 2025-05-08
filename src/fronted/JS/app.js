/* src/fronted/JS/app.js */
const { useState } = React;

function Login() {
  const [correo,   setCorreo]   = useState('');
  const [password, setPassword] = useState('');
  const [msg,      setMsg]      = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!correo || !password) return setMsg('Completa todos los campos');

    try {
      const r = await fetch('http://localhost:5000/api/login', {
        method : 'POST',
        headers: { 'Content-Type':'application/json' },
        body   : JSON.stringify({ correo, password })
      });

      const data = await r.json();
      if (!r.ok) return setMsg(data.message);

      /* Guarda token y usuario en localStorage */
      localStorage.setItem('token',   data.token ?? '');     // para endpoints protegidos
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      /* Redirección */
      window.location.href = correo === 'admin@mail.com'
        ? 'homeadmin.html'
        : 'home.html';

    } catch { setMsg('Error de conexión con el servidor'); }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input type="email"    placeholder="Correo"
               value={correo}   onChange={e=>setCorreo(e.target.value)} />
        <input type="password" placeholder="Contraseña"
               value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Entrar</button>
        {msg && <p className="mensaje">{msg}</p>}
      </form>
      <hr/>
      <button className="secundario"
              onClick={()=>window.location.href='register.html'}>
        Registrarse
      </button>
    </div>
  );
}

ReactDOM.render(<Login/>, document.getElementById('root'));
