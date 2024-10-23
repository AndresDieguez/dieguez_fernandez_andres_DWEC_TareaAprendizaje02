// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
// Incluir en las variables tarifasJSONpath y gastosJSONpath la ruta de los ficheros de datos
// declarmos variables tarifasJSON y gastosJSON donde se van a cargar ficheros JSON
let tarifasJSON = null;
let gastosJSON = null;
//b--Incluir en las variables tarifasJSONpath y gastosJSONpath la ruta de los ficherosde datos--
let tarifasJSONpath = 'data/tarifasCombustible.json';
let gastosJSONpath = 'data/gastosCombustible.json';

// Importar la clase GastoCombustible
import GastoCombustible from './GastoCombustible.js';

// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // mostrar datos en consola
    console.log('Tarifas JSON: ', tarifasJSON);
    console.log('Gastos JSON: ', gastosJSON);

    calcularGastoTotal();

    // Inicializar eventos el formularios
    document.getElementById('fuel-form').addEventListener('submit', guardarGasto);

    //a--Modifica el calendario para que solo puedan añadirse fechas entre 2010 y 2020--
    const fechaInput = document.getElementById('date');
    fechaInput.setAttribute('min', '2010-01-01'); // Fecha mínima
    fechaInput.setAttribute('max', '2020-12-31'); // Fecha máxima
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {

    try {
        // Esperar a que ambos ficheros se carguen
        tarifasJSON = await cargarJSON(tarifasJSONpath);
        gastosJSON = await cargarJSON(gastosJSONpath);

    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}


// ------------------------------ 3. FUNCIONES ------------------------------
// Calcular gasto total por año al iniciar la aplicación
// c-- Calcula los gastos entre 2010 y 2020 usando la función calcularGastoTotal()--

function calcularGastoTotal() {
    // Array asociativo con clave=año y valor=gasto total, objeto literal
    // guardaremos en el los gastos totales de cada año.
    let aniosArray = {
        2010: 0,
        2011: 0,
        2012: 0,
        2013: 0,
        2014: 0,
        2015: 0,
        2016: 0,
        2017: 0,
        2018: 0,
        2019: 0,
        2020: 0
    };

    /* 
    Iterar sobre gastosJSON para calcular el total gastos por año
    Recorremos con un For in gastosJSON que contiene los datos de gastosCombustible.json
    Dentro de gastosJSON en la propiedad date, nos quedamos solo con el año de la fecha
    y lo guardamos en la variable anio. Usaremos el array para guardar los datos aniosArray
    */
    
    for (let indice in gastosJSON) {
        const datosGastos = gastosJSON[indice];    
        // obtenemos el año y lo guardarlo en una variable: const anio = new Date(gastosJSON[indice].date).getFullYear()
        const fechaCompleta = new Date(datosGastos.date); 
        const anio = fechaCompleta.getFullYear(); 
        
        // Podriamos verificar que el año esté entre 2010 y 2020 si queremos asegurarnos
        if (anio >= 2010 && anio <= 2020) {
            // Obtenemos el precio del viaje y lo guardamos en la variable costeDelViaje
            let costeDelViaje = datosGastos.precioViaje; // let precioViaje = gastosJSON[indice].precioViaje
            aniosArray[anio] += costeDelViaje; // mientras el año sea el mismo se suman a los gasto de ese año
        }
    }

    console.log('Array aniosArray: ' , aniosArray); // Para verificar aniosArray en la consola

    /* 
    d--Muestra el importe del gasto total para cada año en el apartado “Gastos Totales:”--  
    Actualizar el index.html con los gastos totales que obtenemos de  recorrer el Array aniosArray
    Pintamos en el index.html con ... ¿textContent o innerText? textContent es una opción más eficiente pero no considera los estilos aplicados
    La expresión (template literal) `gasto${anio}` toma la cadena "gasto" y le concatena el valor de la variable anio
    */
    for (let anio in aniosArray) {
        document.getElementById(`gasto${anio}`).textContent = aniosArray[anio].toFixed(2); // Mostrar en el HTML
    }

}
// 3-- Cuando el usuario ingrese los datos de un nuevo gasto y los envíe, realiza lo siguiente enguardarGasto()
// a. Almacena el gasto en un objeto de tipo GastoCombustible
function guardarGasto(event) {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    // Obtener los datos del formulario
    const tipoVehiculo = document.getElementById('vehicle-type').value;
    const fecha = new Date(document.getElementById('date').value);
    const kilometros = parseFloat(document.getElementById('kilometers').value);
    
    // --b Calcula el precio del viaje y almacénalo en el atributo correspondiente del objeto--
    /* 
    Para ello lo primero vamos a cojer el año, de la fecha que ha introducido el usuario
    Y buscamos con find() las tarifas correspondiente en tarifasJSON a ese año
    */
    const anio = fecha.getFullYear();
    const tarifaAnio = tarifasJSON.tarifas.find(t => t.anio === anio);

    if (!tarifaAnio || !tarifaAnio.vehiculos[tipoVehiculo]) {
        console.error('No se encontró una tarifa válida para el año o el tipo de vehículo.');
        return;
    }
    
    // en tipoVehiculo tenemos el vehiculo introducido por el ususario
    // con tarifaAnio.vehiculos[tipoVehiculo] cojemos la tarifa del vehiculo introducido por el usuario
    const tarifa = tarifaAnio.vehiculos[tipoVehiculo];

    // Calcular el precio del viaje, tenemos la tarifa y la variable kilometros son los introducidos por el usuario
    const precioViaje = tarifa * kilometros;

    // Crear el objeto GastoCombustible a partir de la clase GastoCombustible
    const nuevoGasto = new GastoCombustible(tipoVehiculo, fecha, kilometros, precioViaje);

    /* 
        c En “Gastos recientes:”, muestra en una nueva fila el último gasto añadido usando convertToJSON()
    */
    // usamos el método convertToJSON()
    const gastoJSON = JSON.parse(nuevoGasto.convertToJSON());

    // Vamos a Mostrar, en nueva fila, el nuevo gasto en "Gastos recientes" para ello creamos li dentro de la ul
    const listaGastos = document.getElementById('expense-list');
    const nuevoElemento = document.createElement('li'); 

    // Mostramos en nueva fila el ultimo gasto añadido, pero formateamos el contenido del nuevo gasto de forma legible
    nuevoElemento.textContent = `Vehículo: ${gastoJSON.vehicleType}, Fecha: ${new Date(gastoJSON.date).toLocaleDateString()}, Kilómetros: ${gastoJSON.kilometers}, Precio del Viaje: €${gastoJSON.precioViaje.toFixed(2)}`;
    
    listaGastos.appendChild(nuevoElemento);

    // -- d. Actualizar el gasto total correspondiente en el apartado “Gastos Totales:” --
    actualizarGastoTotal(anio, precioViaje);

    // --e. Dejar el formulario en blanco de nuevo
    document.getElementById('fuel-form').reset();
}

// Función para actualizar el gasto total del año correspondiente
// parametros fecha y precioViaje, sumamos al gasto total del año correspondiente, el nuevo precioViaje calculado
function actualizarGastoTotal(anio, precioViaje) {
    
    const spanGasto = document.getElementById(`gasto${anio}`);

    if (spanGasto) {
        const gastoActual = parseFloat(spanGasto.textContent) || 0;
        spanGasto.textContent = (gastoActual + precioViaje).toFixed(2); // Actualizar el gasto total del año
    }
}

