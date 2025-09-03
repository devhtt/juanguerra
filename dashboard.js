function mostrarSeccionCursos() {
  limpiarTimerCurso();
  agregarCursoPorDefecto();
  const main = document.getElementById("main-contenido");
  main.innerHTML = `
    <div class="encabezado-panel">
      <h1>Bienvenido a tu panel</h1>
      <img src="IEJG.png" class="logo-ucv">
    </div>
    <p class="mensaje-inicio">
      "En el Colegio Juan Guerra, cada clase no solo forma profesionales, sino también seres humanos capaces de <br>
      transformar su realidad. Nuestras plataformas educativas están diseñadas para que aprendas a tu ritmo,<br>
      desarrolles tu potencial y te superes cada día. Porque cuando estudias con pasión y constancia,<br>
      no solo cambias tu futuro: te cambias a ti mismo."<br><br>
      #SoyJuanGuerra #TransformaTuVida #AprenderParaCrecer
    </p>
    <div class="dashboard-section">
      <div class="dashboard-title">Gestión de Cursos</div>
      <div class="dashboard-grid">
        <button class="dashboard-card" onclick="mostrarCrearCurso()">
          CREAR CURSO
        </button>
        <button class="dashboard-card" onclick="mostrarNotas()">
          VER NOTAS
        </button>
      </div>
    </div>
    <div class="dashboard-section lista-cursos">
      <div class="dashboard-title" style="font-size:1.5rem;">Cursos creados</div>
      <ul id="cursos-guardados"></ul>
    </div>
  `;
  mostrarCursosGuardados();
}

function mostrarCrearCurso(cursoEdit = null, editIndex = null) {
  const main = document.getElementById("main-contenido");
  let nombre = cursoEdit ? cursoEdit.nombre : "";
  let duracion = cursoEdit ? cursoEdit.duracion : 2;
  let preguntas = cursoEdit ? cursoEdit.preguntas : [crearPreguntaVacia()];

  function crearPreguntaVacia() {
    return {
      tipo: "opcion-multiple",
      texto: "",
      puntos: 1,
      opciones: [""],
      correcta: 0
    };
  }

  function render() {
    let html = `
      <div class="crear-curso">
        <h2>${cursoEdit ? "Editar curso" : "Crear nuevo curso"}</h2>
        <label>Nombre del curso:</label>
        <input type="text" id="nombre-curso" value="${nombre}" placeholder="Nombre del curso" />
        <label>Duración (minutos):</label>
        <input type="number" id="duracion-curso" value="${duracion}" min="1" max="120" />
        <div id="preguntas-curso">
          ${preguntas.map((preg, idx) => renderPregunta(preg, idx)).join("")}
        </div>
        <button id="agregar-pregunta-btn" ${preguntas.length >= 10 ? "disabled" : ""}>+1 Pregunta</button>
        <br><br>
        <button id="guardar-curso-btn">${cursoEdit ? "Guardar cambios" : "Guardar Curso"}</button>
        <button id="cancelar-curso-btn">Cancelar</button>
      </div>
    `;
    main.innerHTML = html;
    // Eventos
    document.getElementById("agregar-pregunta-btn").onclick = () => {
      preguntas.push(crearPreguntaVacia());
      render();
    };
    document.getElementById("guardar-curso-btn").onclick = guardarCursoPersonalizado;
    document.getElementById("cancelar-curso-btn").onclick = mostrarSeccionCursos;
    preguntas.forEach((preg, idx) => {
      document.getElementById(`tipo-pregunta-${idx}`).onchange = (e) => {
        preguntas[idx].tipo = e.target.value;
        if (e.target.value === "respuesta-escrita") {
          preguntas[idx].opciones = [];
          preguntas[idx].correcta = "";
        } else {
          if (!preguntas[idx].opciones || preguntas[idx].opciones.length === 0) {
            preguntas[idx].opciones = [""];
            preguntas[idx].correcta = 0;
          }
        }
        render();
      };
      document.getElementById(`texto-pregunta-${idx}`).oninput = (e) => {
        preguntas[idx].texto = e.target.value;
      };
      document.getElementById(`puntos-pregunta-${idx}`).oninput = (e) => {
        preguntas[idx].puntos = parseInt(e.target.value) || 1;
      };
      if (preguntas[idx].tipo === "opcion-multiple") {
        preguntas[idx].opciones.forEach((opc, j) => {
          document.getElementById(`opcion-${idx}-${j}`).oninput = (e) => {
            preguntas[idx].opciones[j] = e.target.value;
          };
        });
        document.getElementById(`agregar-opcion-${idx}`).onclick = () => {
          preguntas[idx].opciones.push("");
          render();
        };
        document.getElementById(`correcta-${idx}`).onchange = (e) => {
          preguntas[idx].correcta = parseInt(e.target.value);
        };
      } else if (preguntas[idx].tipo === "respuesta-escrita") {
        document.getElementById(`correcta-escrita-${idx}`).oninput = (e) => {
          preguntas[idx].correcta = e.target.value;
        };
      }
      document.getElementById(`eliminar-pregunta-${idx}`).onclick = () => {
        preguntas.splice(idx, 1);
        render();
      };
    });
  }

  function renderPregunta(preg, idx) {
    let html = `
      <div class="pregunta-bloque" style="margin-bottom:18px;border-bottom:1px solid #eee;padding-bottom:12px;">
        <label>Tipo de pregunta:</label>
        <select id="tipo-pregunta-${idx}">
          <option value="opcion-multiple" ${preg.tipo === "opcion-multiple" ? "selected" : ""}>Opción múltiple</option>
          <option value="respuesta-escrita" ${preg.tipo === "respuesta-escrita" ? "selected" : ""}>Respuesta escrita</option>
        </select>
        <label>Pregunta:</label>
        <input type="text" id="texto-pregunta-${idx}" value="${preg.texto}" placeholder="Texto de la pregunta" />
        <label>Puntos:</label>
        <input type="number" id="puntos-pregunta-${idx}" value="${preg.puntos}" min="1" max="100" />
    `;
    if (preg.tipo === "opcion-multiple") {
      html += `<label>Opciones (puedes poner texto o img:URL):</label>`;
      preg.opciones.forEach((opc, j) => {
        html += `<input type="text" id="opcion-${idx}-${j}" value="${opc}" placeholder="Opción ${j + 1}" style="margin-bottom:4px;" />`;
      });
      html += `<button type="button" id="agregar-opcion-${idx}" style="margin-bottom:6px;">+1 Opción</button>`;
      html += `<br><label>Respuesta correcta:</label>
        <select id="correcta-${idx}">
          ${preg.opciones.map((opc, j) => `<option value="${j}" ${preg.correcta == j ? "selected" : ""}>Opción ${j + 1}</option>`).join("")}
        </select>`;
    } else if (preg.tipo === "respuesta-escrita") {
      html += `<label>Respuesta correcta (texto):</label>
        <input type="text" id="correcta-escrita-${idx}" value="${preg.correcta || ""}" placeholder="Respuesta correcta" />`;
    }
    html += `<br><button type="button" id="eliminar-pregunta-${idx}" style="margin-top:6px;background:#e53935;color:#fff;">Eliminar pregunta</button>`;
    html += `</div>`;
    return html;
  }

  function guardarCursoPersonalizado() {
    nombre = document.getElementById("nombre-curso").value.trim();
    duracion = parseInt(document.getElementById("duracion-curso").value) || 2;
    if (!nombre) return alert("Nombre del curso requerido");
    if (preguntas.length === 0) return alert("Agrega al menos una pregunta");
    for (let i = 0; i < preguntas.length; i++) {
      if (!preguntas[i].texto) return alert("Completa el texto de todas las preguntas");
      if (preguntas[i].tipo === "opcion-multiple") {
        if (!preguntas[i].opciones || preguntas[i].opciones.length < 2) return alert("Cada pregunta de opción múltiple debe tener al menos 2 opciones");
      }
    }
    const cursos = JSON.parse(localStorage.getItem("cursos")) || [];
    if (editIndex !== null) {
      cursos[editIndex] = { nombre, duracion, preguntas };
    } else {
      if (cursos.some(c => c.nombre === nombre)) {
        alert("Ya existe un curso con ese nombre.");
        return;
      }
      cursos.push({ nombre, duracion, preguntas });
    }
    localStorage.setItem("cursos", JSON.stringify(cursos));
    mostrarSeccionCursos();
  }

  render();
}

function eliminarCurso(index) {
  const cursos = JSON.parse(localStorage.getItem("cursos")) || [];
  const nombre = cursos[index].nombre;
  cursos.splice(index, 1);
  localStorage.setItem("cursos", JSON.stringify(cursos));
  // Elimina la nota asociada
  const notas = JSON.parse(localStorage.getItem("notas")) || [];
  const nuevasNotas = notas.filter(nota => nota.curso !== nombre);
  localStorage.setItem("notas", JSON.stringify(nuevasNotas));
  mostrarSeccionCursos();
}

function mostrarCursosGuardados() {
  const lista = document.getElementById("cursos-guardados");
  lista.innerHTML = "";
  const cursos = JSON.parse(localStorage.getItem("cursos")) || [];
  if (cursos.length === 0) {
    lista.innerHTML = "<li>No hay cursos aún.</li>";
    return;
  }
  cursos.forEach((curso, index) => {
    const li = document.createElement("li");
    li.textContent = curso.nombre;
    const btns = document.createElement("span");
    btns.style.display = "inline-flex";
    btns.style.gap = "8px";
    // Botón iniciar (siempre)
    const btnIniciar = document.createElement("button");
    btnIniciar.textContent = "Iniciar";
    btnIniciar.className = "btn-iniciar-curso";
    btnIniciar.onclick = function() { resolverCurso(index); };
    btns.appendChild(btnIniciar);
    // Solo cursos creados por el usuario pueden eliminarse/editarse (no tienen autor)
    if (!curso.autor) {
      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.onclick = function() { eliminarCurso(index); };
      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.onclick = function() { mostrarCrearCurso(curso, index); };
      btns.appendChild(btnEliminar);
      btns.appendChild(btnEditar);
    }
    li.appendChild(btns);
    lista.appendChild(li);
  });
}

function mostrarNotas() {
  const main = document.getElementById("main-contenido");
  const notas = JSON.parse(localStorage.getItem("notas")) || [];
  let html = "<h2>Notas</h2>";
  if (notas.length === 0) {
    html += "<p>Aún no tienes notas registradas.</p>";
  } else {
    html += `<ul class="notas-lista">`;
    notas.forEach(nota => {
      html += `<li class="nota-item"><span>${nota.curso}</span> <span class="nota-etiqueta">${nota.puntaje}/${nota.total}</span></li>`;
    });
    html += `</ul>`;
  }
  main.innerHTML = html;
}

function cerrarSesion() {
  localStorage.removeItem("usuarioNombre");
  window.location.href = "index.html";
}

// --- Curso por defecto ---
function agregarCursoPorDefecto() {
  const cursos = JSON.parse(localStorage.getItem("cursos")) || [];
  const cursosDefecto = [
    {
      nombre: "Matemáticas",
      autor: "Hilter Arce",
      duracion: 3,
      preguntas: [
        {
          tipo: "opcion-multiple",
          texto: "¿Cuál es el resultado de 12 x 12?",
          puntos: 1,
          opciones: ["124", "144", "132", "156", "120", "112"],
          correcta: 1
        },
        {
          tipo: "opcion-multiple",
          texto: "¿Cuánto es la raíz cuadrada de 225?",
          puntos: 1,
          opciones: ["14", "15", "16", "17", "18", "20"],
          correcta: 1
        },
        {
          tipo: "respuesta-escrita",
          texto: "¿Cuál es el valor de π (pi) redondeado a dos decimales?",
          puntos: 1,
          correcta: "3.14"
        },
        {
          tipo: "opcion-multiple",
          texto: "¿Cuál es el resultado de 7 x 8?",
          puntos: 1,
          opciones: ["54", "56", "58", "60", "64", "48"],
          correcta: 1
        }
      ]
    },
    {
      nombre: "Ciencia y Tecnología",
      autor: "Hilter Arce",
      duracion: 3,
      preguntas: [
        {
          tipo: "opcion-multiple",
          texto: "¿Qué órgano produce la insulina?",
          puntos: 1,
          opciones: ["Riñón", "Hígado", "Páncreas", "Estómago", "Intestino", "Corazón"],
          correcta: 2
        },
        {
          tipo: "opcion-multiple",
          texto: "¿Cuál es el hueso más largo del cuerpo humano?",
          puntos: 1,
          opciones: ["Radio", "Fémur", "Tibia", "Húmero", "Peroné", "Cúbito"],
          correcta: 1
        },
        {
          tipo: "respuesta-escrita",
          texto: "¿Cuál es el planeta más grande del sistema solar?",
          puntos: 1,
          correcta: "Júpiter"
        },
        {
          tipo: "opcion-multiple",
          texto: "¿Cuál es el elemento químico con símbolo 'O'?",
          puntos: 1,
          opciones: ["Oro", "Osmio", "Oxígeno", "Oganesón", "Olivino", "Óxido"],
          correcta: 2
        }
      ]
    },
    {
      nombre: "Ciencias Sociales",
      autor: "Hilter Arce",
      duracion: 3,
      preguntas: [
        {
          tipo: "opcion-multiple",
          texto: "¿Quién escribió 'Cien años de soledad'?",
          puntos: 1,
          opciones: ["Mario Vargas Llosa", "Gabriel García Márquez", "Julio Cortázar", "Pablo Neruda", "Isabel Allende", "Carlos Fuentes"],
          correcta: 1
        },
        {
          tipo: "respuesta-escrita",
          texto: "¿Cuál es el país más poblado del mundo?",
          puntos: 1,
          correcta: "China"
        },
        {
          tipo: "opcion-multiple",
          texto: "¿Cuál es el río más largo del mundo?",
          puntos: 1,
          opciones: ["Amazonas", "Nilo", "Yangtsé", "Misisipi", "Danubio", "Volga"],
          correcta: 0
        },
        {
          tipo: "opcion-multiple",
          texto: "¿En qué continente está Perú?",
          puntos: 1,
          opciones: ["Asia", "Europa", "África", "América", "Oceanía", "Antártida"],
          correcta: 3
        }
      ]
    },
    {
      nombre: "Desarrollo Cívico para la Ciudadanía",
      autor: "Hilter Arce",
      duracion: 3,
      preguntas: [
        {
          tipo: "opcion-multiple",
          texto: "¿Qué significa democracia?",
          puntos: 1,
          opciones: ["Gobierno de uno", "Gobierno del pueblo", "Gobierno militar", "Gobierno religioso", "Gobierno de ricos", "Gobierno de pobres"],
          correcta: 1
        },
        {
          tipo: "respuesta-escrita",
          texto: "¿Quién es el presidente actual del Perú?",
          puntos: 1,
          correcta: "Dina Boluarte"
        },
        {
          tipo: "opcion-multiple",
          texto: "¿Qué documento garantiza los derechos en Perú?",
          puntos: 1,
          opciones: ["Constitución", "Biblia", "Código Civil", "Ley de Educación", "Reglamento Interno", "Manual de Convivencia"],
          correcta: 0
        },
        {
          tipo: "opcion-multiple",
          texto: "¿Qué valor representa la bandera peruana?",
          puntos: 1,
          opciones: ["Libertad", "Justicia", "Patria", "Solidaridad", "Respeto", "Igualdad"],
          correcta: 2
        }
      ]
    },
    {
      nombre: "Comunicación",
      autor: "Hilter Arce",
      duracion: 3,
      preguntas: [
        {
          tipo: "opcion-multiple",
          texto: "¿Cuál es el sustantivo en la frase: 'El perro corre rápido'?",
          puntos: 1,
          opciones: ["corre", "rápido", "perro", "El", "frase", "sustantivo"],
          correcta: 2
        },
        {
          tipo: "respuesta-escrita",
          texto: "¿Qué es una metáfora?",
          puntos: 1,
          correcta: "Comparación indirecta"
        },
        {
          tipo: "opcion-multiple",
          texto: "¿Cuál es el verbo en la frase: 'María estudia matemáticas'?",
          puntos: 1,
          opciones: ["María", "estudia", "matemáticas", "frase", "verbo", "sujeto"],
          correcta: 1
        },
        {
          tipo: "opcion-multiple",
          texto: "¿Qué tipo de texto es una noticia?",
          puntos: 1,
          opciones: ["Narrativo", "Descriptivo", "Informativo", "Argumentativo", "Expositivo", "Poético"],
          correcta: 2
        }
      ]
    },
    {
      nombre: "Inglés",
      autor: "Hilter Arce",
      duracion: 3,
      preguntas: [
        {
          tipo: "opcion-multiple",
          texto: "Translate: 'Casa'",
          puntos: 1,
          opciones: ["Car", "House", "Dog", "Cat", "Table", "Chair"],
          correcta: 1
        },
        {
          tipo: "respuesta-escrita",
          texto: "How do you say 'Gracias' in English?",
          puntos: 1,
          correcta: "Thank you"
        },
        {
          tipo: "opcion-multiple",
          texto: "Which is a color?",
          puntos: 1,
          opciones: ["Apple", "Blue", "Dog", "Run", "Book", "Chair"],
          correcta: 1
        },
        {
          tipo: "opcion-multiple",
          texto: "What is the plural of 'child'?",
          puntos: 1,
          opciones: ["childs", "childes", "children", "child", "childen", "childer"],
          correcta: 2
        }
      ]
    },
    {
      nombre: "Religión",
      autor: "Hilter Arce",
      duracion: 3,
      preguntas: [
        {
          tipo: "opcion-multiple",
          texto: "¿Quién es considerado el hijo de Dios en el cristianismo?",
          puntos: 1,
          opciones: ["Moisés", "Abraham", "Jesús", "David", "Pedro", "Juan"],
          correcta: 2
        },
        {
          tipo: "respuesta-escrita",
          texto: "¿Cuál es el libro sagrado del cristianismo?",
          puntos: 1,
          correcta: "Biblia"
        },
        {
          tipo: "opcion-multiple",
          texto: "¿En qué día se celebra la Navidad?",
          puntos: 1,
          opciones: ["24 de diciembre", "25 de diciembre", "31 de diciembre", "1 de enero", "6 de enero", "15 de agosto"],
          correcta: 1
        },
        {
          tipo: "opcion-multiple",
          texto: "¿Qué significa 'Amén'?",
          puntos: 1,
          opciones: ["Gracias", "Así sea", "Por favor", "Hola", "Adiós", "Perdón"],
          correcta: 1
        }
      ]
    },
    {
      nombre: "Física",
      autor: "Hilter Arce",
      duracion: 3,
      preguntas: [
        {
          tipo: "opcion-multiple",
          texto: "¿Cuál es la unidad de fuerza en el Sistema Internacional?",
          puntos: 1,
          opciones: ["Joule", "Newton", "Watt", "Pascal", "Volt", "Ampere"],
          correcta: 1
        },
        {
          tipo: "respuesta-escrita",
          texto: "¿Qué estudia la física?",
          puntos: 1,
          correcta: "La materia y la energía"
        },
        {
          tipo: "opcion-multiple",
          texto: "¿Cuál es la aceleración de la gravedad en la Tierra?",
          puntos: 1,
          opciones: ["8.9 m/s²", "9.8 m/s²", "10 m/s²", "7.5 m/s²", "12 m/s²", "6.5 m/s²"],
          correcta: 1
        },
        {
          tipo: "opcion-multiple",
          texto: "¿Quién formuló la ley de la gravitación universal?",
          puntos: 1,
          opciones: ["Einstein", "Newton", "Galileo", "Tesla", "Faraday", "Bohr"],
          correcta: 1
        }
      ]
    }
  ];

  // Solo agrega si no existe cada curso
  cursosDefecto.forEach(def => {
    if (!cursos.some(c => c.nombre === def.nombre)) {
      cursos.push(def);
    }
  });
  localStorage.setItem("cursos", JSON.stringify(cursos));
}

// --- Limpieza global de temporizador de curso ---
function limpiarTimerCurso() {
  if (window.timerBarInterval) {
    clearInterval(window.timerBarInterval);
    window.timerBarInterval = null;
  }
}

// --- Resolver curso con barra de tiempo progresiva para todas las preguntas ---
function resolverCurso(index) {
  limpiarTimerCurso();
  const cursos = JSON.parse(localStorage.getItem("cursos")) || [];
  const curso = cursos[index];
  const main = document.getElementById("main-contenido");
  let respuestas = [];
  let preguntaActual = 0;

  // Tiempo total para el curso (en segundos)
  let tiempoTotal = (curso.duracion && curso.duracion > 0 ? curso.duracion : 2) * 60;
  let tiempoRestante = tiempoTotal;

  function actualizarBarraTiempoGlobal() {
    const bar = document.getElementById("timer-bar-global");
    if (bar) {
      const percent = (tiempoRestante / tiempoTotal) * 100;
      bar.style.width = percent + "%";
    }
    const timerText = document.getElementById("timer-text-global");
    if (timerText) {
      const min = Math.floor(tiempoRestante / 60);
      const sec = tiempoRestante % 60;
      timerText.textContent = `${min}:${sec.toString().padStart(2, "0")}`;
    }
  }

  function mostrarPregunta(i) {
    const preg = curso.preguntas[i];
    let contenido = `
      <div style="margin-bottom:24px;">
        <div class="timer-bar-container">
          <span class="timer-text" id="timer-text-global">0:00</span>
          <div class="timer-bar-bg" style="width:80%;margin-left:10px;">
            <div class="timer-bar" id="timer-bar-global"></div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-start;margin-bottom:10px;">
        <h2 class="pregunta-titulo" style="color:#000;margin-bottom:6px;">${preg.texto}</h2>
        <span style="font-size:15px;color:#1976d2;font-weight:bold;">Autor: ${curso.autor || "Hilter Arce"}</span>
      </div>
      <div class="opciones-rectangulos">
    `;

    if (preg.tipo === "opcion-multiple" && preg.opciones && preg.opciones.length > 0) {
      preg.opciones.forEach((opc, j) => {
        if (opc.startsWith("img:")) {
          contenido += `<div class="opcion-rect" data-valor="${j}" tabindex="0"><img src="${opc.slice(4)}" alt="Opción ${j + 1}" style="max-height:40px;"></div>`;
        } else {
          contenido += `<div class="opcion-rect" data-valor="${j}" tabindex="0">${opc}</div>`;
        }
      });
    } else if (preg.tipo === "respuesta-escrita") {
      contenido += `<div style="display:flex;align-items:center;gap:10px;">
        <input type="text" id="respuesta-escrita" placeholder="Escribe tu respuesta aquí" style="width:98%;max-width:300px;margin-bottom:18px;font-size:16px;" />
        <button id="enviar-respuesta-btn" class="dashboard-card" style="background:#1976d2;color:#fff;">Enviar</button>
      </div>`;
    }

    contenido += `</div>
      <div style="display:flex;justify-content:center;margin-top:40px;">
        <button id="cancelar-curso-btn" class="dashboard-card" type="button" style="background:#e53935;color:#fff;">Cancelar</button>
      </div>
    `;
    main.innerHTML = `<div class="pregunta-unica" style="position:relative;">${contenido}</div>`;

    actualizarBarraTiempoGlobal();

    if (preg.tipo === "opcion-multiple") {
      document.querySelectorAll('.opcion-rect').forEach(div => {
        div.onclick = () => {
          const seleccion = parseInt(div.dataset.valor);
          const correcta = preg.correcta;
          document.querySelectorAll('.opcion-rect').forEach((d, idx) => {
            d.classList.remove('opcion-correcta', 'opcion-incorrecta');
            if (idx === seleccion) {
              if (seleccion === correcta) {
                d.classList.add('opcion-correcta');
              } else {
                d.classList.add('opcion-incorrecta');
              }
            }
          });
          setTimeout(() => guardarRespuestaYContinuar(seleccion), 500);
        };
        div.onkeydown = (e) => {
          if (e.key === "Enter" || e.key === " ") {
            const seleccion = parseInt(div.dataset.valor);
            const correcta = preg.correcta;
            document.querySelectorAll('.opcion-rect').forEach((d, idx) => {
              d.classList.remove('opcion-correcta', 'opcion-incorrecta');
              if (idx === seleccion) {
                if (seleccion === correcta) {
                  d.classList.add('opcion-correcta');
                } else {
                  d.classList.add('opcion-incorrecta');
                }
              }
            });
            setTimeout(() => guardarRespuestaYContinuar(seleccion), 500);
          }
        };
      });
    } else if (preg.tipo === "respuesta-escrita") {
      document.getElementById('enviar-respuesta-btn').onclick = function() {
        const valor = document.getElementById('respuesta-escrita').value.trim();
        if (valor) guardarRespuestaYContinuar(valor);
      };
      document.getElementById('respuesta-escrita').onkeydown = function(e) {
        if (e.key === "Enter") {
          const valor = this.value.trim();
          if (valor) guardarRespuestaYContinuar(valor);
        }
      };
    }

    document.getElementById('cancelar-curso-btn').onclick = function() {
      limpiarTimerCurso();
      mostrarSeccionCursos();
    };
  }

  function guardarRespuestaYContinuar(valor) {
    respuestas[preguntaActual] = valor;
    preguntaActual++;
    if (preguntaActual < curso.preguntas.length && tiempoRestante > 0) {
      mostrarPregunta(preguntaActual);
    } else {
      limpiarTimerCurso();
      evaluarRespuestasRapido(curso, respuestas);
    }
  }

  window.timerBarInterval = setInterval(() => {
    tiempoRestante--;
    actualizarBarraTiempoGlobal();
    if (tiempoRestante <= 0) {
      limpiarTimerCurso();
      evaluarRespuestasRapido(curso, respuestas);
    }
  }, 1000);

  mostrarPregunta(0);
}

// --- Evaluar respuestas y guardar nota ---
function evaluarRespuestasRapido(curso, respuestas) {
  let puntaje = 0;
  curso.preguntas.forEach((preg, i) => {
    if (preg.tipo === "opcion-multiple") {
      if (respuestas[i] === preg.correcta) puntaje += preg.puntos || 1;
    } else if (preg.tipo === "respuesta-escrita") {
      if (
        typeof respuestas[i] === "string" &&
        respuestas[i].toLowerCase().trim() === (preg.correcta || "").toLowerCase().trim()
      ) {
        puntaje += preg.puntos || 1;
      }
    }
  });
  // Guardar nota
  const notas = JSON.parse(localStorage.getItem("notas")) || [];
  notas.push({
    curso: curso.nombre,
    puntaje: puntaje,
    total: curso.preguntas.length
  });
  localStorage.setItem("notas", JSON.stringify(notas));
  mostrarNotas();
}

window.addEventListener('DOMContentLoaded', mostrarSeccionCursos);

document.getElementById("nombre-usuario").onclick = function() {
  const main = document.getElementById("main-contenido");
  const nombre = localStorage.getItem("usuarioNombre") || "Usuario";
  main.innerHTML = `<h2>Perfil</h2><p>Nombre: ${nombre}</p>`;
};
