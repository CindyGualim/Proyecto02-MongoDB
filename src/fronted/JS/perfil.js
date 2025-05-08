const {useState,useEffect}=React;
const uid=localStorage.getItem('uid');   // guarda esto en login

function Perfil(){
  const [user,setUser]=useState({});
  const [edit,setEdit]=useState(false);
  const [msg,setMsg]=useState('');

  useEffect(()=>{
    fetch(`http://localhost:5000/api/usuario/${uid}?projection=nombre,correo`)
      .then(r=>r.json()).then(setUser);
  },[]);

  const save=()=>{
    fetch(`http://localhost:5000/api/usuario/${uid}`,{
      method:'PUT', headers:{'Content-Type':'application/json'},
      body:JSON.stringify(user)
    }).then(()=>{ setEdit(false); setMsg('Actualizado'); setTimeout(()=>setMsg(''),1500); });
  };

  return(
    <div className="home-container">
      <h2 className="titulo-pagina">Mi Perfil</h2>
      <div className="login-container" style={{width:'340px'}}>
        <input value={user.nombre||''} readOnly={!edit}
               onChange={e=>setUser({...user,nombre:e.target.value})}/>
        <input value={user.correo||''} readOnly/>
        {edit
          ?<button onClick={save}>Guardar</button>
          :<button onClick={()=>setEdit(true)}>Editar</button>}
        {msg&&<p className="mensaje">{msg}</p>}
      </div>
    </div>
  );
}
ReactDOM.render(<Perfil/>,document.getElementById('root'));
