const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");
const buscador = document.querySelector("#buscador");
let articulosCarrito = [];
let objTitles = [];
let resultadoTitles = [];
let target;

//*Registrador de Eventos
registrarEventListeners();
function registrarEventListeners() {
    listaCursos.addEventListener("click", obtenerInfoCard);
    vaciarCarritoBtn.addEventListener("click", vaciarCarrito);
    contenedorCarrito.addEventListener("click", borrarArticulo);
    buscador.addEventListener("input", () => {
        filtrarCurso();
    });
    document.addEventListener("scroll", irArriba);
}

//!______________________________________________Input_______________________________________________________
//*Obtener Titles
ObtenerTitles();
function ObtenerTitles() {
    const h4 = document.querySelectorAll(".card h4");
    h4.forEach((item) => {
        target = h4;
        objTitles.push(`${item.textContent}`);
    });
    objTitles.forEach((element, index) => {
        resultadoTitles[index] = element.toUpperCase();
        resultadoTitles[index] = resultadoTitles[index].split(" ");
        resultadoTitles[index] = resultadoTitles[index].reduce(juntar);
    });
}

//*Filtrar Curso en Input
function filtrarCurso() {
    const resultado = document.querySelector(".resultados");
    let valueInput = buscador.value.toUpperCase().split(" ").reduce(juntar);
    let listaTitles = "";

    if (valueInput !== "") {
        resultadoTitles.forEach((element, index) => {
            if (element.includes(valueInput)) {
                resultado.classList.add("active");
                resultado.innerHTML = " ";
                listaTitles +=
                    "<li onclick = (elementoElegido(this))>" +
                    `${objTitles[index]}` +
                    "</li>";
                resultado.innerHTML = listaTitles;
            }
        });
    } else {
        resultado.classList.remove("active");
        resultado.innerHTML = " ";
    }
}

//*elementoElegido()
function elementoElegido(e) {
    target.forEach((target) => {
        if (target.textContent === e.textContent) {
            let posicionElemento = target.parentElement.offsetTop;
            scroll({
                top: posicionElemento + 190,
                behavior: "smooth",
            });
            target.parentElement.classList.add("animation");
            setTimeout(() => {
                target.parentElement.classList.remove("animation");
            }, 2000);
        }
    });
}

const body = document.querySelector("body");
const arriba = document.createElement("p");
arriba.textContent = "🔝";
arriba.classList = "irArriba";
arriba.onclick = () => {
    scrollArriba();
};

function irArriba() {
    let y = window.scrollY;
    if (y > 453) {
        body.appendChild(arriba);
    } else {
        arriba.remove();
    }
}

function scrollArriba(e) {
    scroll({
        top: 0,
        behavior: "smooth",
    });
}
//!____________________________________________________________________________________________

//*Obtener Info
function obtenerInfoCard(e) {
    e.preventDefault();
    if (e.target.classList.contains("agregar-carrito")) {
        const card = e.target.parentElement.parentElement.children;
        const infoCard = {
            imagen: card[0].getAttribute("src"),
            nombre: card[1].querySelector("h4").textContent,
            precio: card[1].querySelector("span").textContent,
            id: card[1].querySelector("a").getAttribute("data-id"),
            cantidad: 1,
        };

        card[1].classList.add("animation");
        setTimeout(() => {
            card[1].classList.remove("animation");
        }, 2000);
        comprobarSiExiste(infoCard);
    }
}

//*Comprobando si existe la card
let memoriaIdArray = [];
function comprobarSiExiste(card) {
    const incluido = memoriaIdArray.includes(card.id);
    memoriaIdArray = [...memoriaIdArray, card.id];
    if (incluido) {
        //*Creará un array con todos los id que sean iguales al id del infoCard(que es dinámico)
        const memoriasFiltradasArray = memoriaIdArray.filter(
            (element) => element === card.id
        );
        let anchoIdsFiltrados = memoriasFiltradasArray.length.toString();
        articulosCarrito.forEach((element) => {
            if (element.id === card.id) {
                element.cantidad = parseInt(anchoIdsFiltrados);
            }
        });
        crearHTML(articulosCarrito);
    } else {
        articulosCarrito = [...articulosCarrito, card];
        crearHTML(articulosCarrito);
    }
}

//*Creando HTML
function crearHTML(articulosCarrito) {
    let HTMLCards = "";
    articulosCarrito.forEach((articulo) => {
        HTMLCards += /*html*/ `<tr id=${articulo.id}>
        <td><img src="${articulo.imagen}" style = "width: 10rem"></td>
        <td>${articulo.nombre}</td>
        <td>${articulo.precio}</td>
        <td>${articulo.cantidad}</td>
        <td><a href="#" class="borrar-curso">X</a></td>
    </tr>`;
    });
    calcularTotal(articulosCarrito);
    contenedorCarrito.innerHTML = HTMLCards;
}

//!_______________________________________Funcionalidades del e-commerce_______________________________________
//*BorrarArticulo
function borrarArticulo(e) {
    e.preventDefault();
    const article = Number(e.target.parentElement.parentElement.id);

    //*Eliminar el id de la memoria de IDs
    const index = memoriaIdArray.findIndex((id) => Number(id) === article);
    if (index > -1) {
        delete memoriaIdArray[index];
        memoriaIdArray = memoriaIdArray.filter((e) => e !== undefined);
    }

    articulosCarrito.forEach((element, index) => {
        //*iteramos el carrito de articulos hasta llegar al articulo que queremos
        if (Number(element.id) === article) {
            element.cantidad = element.cantidad - 1;
            if (element.cantidad < 1) {
                delete articulosCarrito[index];
                articulosCarrito = articulosCarrito.filter(
                    (e) => e !== undefined
                );
            }
        }
    });
    crearHTML(articulosCarrito);
}

//*Vaciar carrito
function vaciarCarrito(e) {
    e.preventDefault();
    memoriaIdArray = [];
    articulosCarrito = [];
    calcularTotal(articulosCarrito);
    contenedorCarrito.innerHTML = "";
}

//*CalcularTotal
function calcularTotal(articulosCarrito) {
    let total = document.querySelector("#total");
    let sumaTotal = 0;
    articulosCarrito.forEach((element) => {
        sumaTotal +=
            element.cantidad * parseInt(element.precio.substring(1, 3));
    });
    total.innerHTML = sumaTotal + "$";
}

//!______________________________________________________________________________________________________________

//*Function Juntar
function juntar(a, b) {
    return a + b;
}
