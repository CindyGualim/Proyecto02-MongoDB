const { useEffect, useState } = React;

function OrderManager() {
  const [articulos, setArticulos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [mensaje, setMensaje] = useState('');

  // Cargar artículos y órdenes
  useEffect(() => {
    fetch('http://localhost:5000/api/articulos')
      .then(res => res.json())
      .then(setArticulos)
      .catch(err => console.error('Error al cargar artículos', err));

    fetchOrdenes();
  }, []);

  const fetchOrdenes = () => {
    fetch('http://localhost:5000/api/ordenes')
      .then(res => res.json())
      .then(setOrdenes)
      .catch(err => console.error('Error al cargar órdenes', err));
  };

  const toggleSeleccion = (id) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter(x => x !== id));
    } else {
      setSeleccionados([...seleccionados, id]);
    }
  };

  const crearOrden = async () => {
    if (seleccionados.length === 0) {
      setMensaje('❗ Selecciona al menos un artículo para crear la orden.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articulos: seleccionados }),
      });

      if (!res.ok) throw new Error('Error al crear orden');

      setSeleccionados([]);
      setMensaje('✅ Orden creada con éxito');
      fetchOrdenes();
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al crear la orden');
    }

    setTimeout(() => setMensaje(''), 3000);
  };

  const cancelarOrden = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/ordenes/${id}/cancelar`, {
        method: 'PUT',
      });

      if (!res.ok) throw new Error('Error al cancelar orden');

      setMensaje('⚠️ Orden cancelada');
      fetchOrdenes();
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al cancelar la orden');
    }

    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className="home-container">
      <h2>Gestión de Órdenes</h2>

      <h3>Selecciona artículos</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {articulos.map((art) => (
          <div
            key={art._id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              width: '200px',
              backgroundColor: seleccionados.includes(art._id) ? '#e0ffe0' : 'white',
              cursor: 'pointer',
            }}
            onClick={() => toggleSeleccion(art._id)}
          >
            <h4>{art.nombre}</h4>
            <p>{art.descripcion}</p>
            <p><strong>Q{art.precio}</strong></p>
          </div>
        ))}
      </div>

      <button style={{ marginTop: '15px' }} onClick={crearOrden}>
        Crear Orden
      </button>

      {mensaje && <p style={{ marginTop: '10px', color: 'blue' }}>{mensaje}</p>}

      <h3>Órdenes existentes</h3>
      <ul>
        {ordenes.map((orden) => (
          <li key={orden._id} style={{ marginBottom: '10px' }}>
            🧾 Orden ID: {orden._id} | Estado: {orden.estado || 'pendiente'}
            <br />
            Total: Q{orden.total}
            <br />
            <button onClick={() => cancelarOrden(orden._id)}>Cancelar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

ReactDOM.render(<OrderManager />, document.getElementById('root'));
