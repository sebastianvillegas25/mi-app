// src/components/MiComponente.jsx
import { useState } from 'react';
import './MiComponente.css'; // Puedes crear archivos CSS para tus componentes

function MiComponente({ titulo, contenido }) {
  const [contador, setContador] = useState(0);
  
  return (
    <div className="mi-componente">
      <h2>{titulo}</h2>
      <p>{contenido}</p>
      <p>Has hecho clic {contador} veces</p>
      <button onClick={() => setContador(contador + 1)}>
        Aumentar contador
      </button>
    </div>
  );
}

export default MiComponente;