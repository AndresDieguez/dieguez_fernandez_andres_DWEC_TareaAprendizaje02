'use strict'
// Importar la clase GastoCombustible
import GastoCombustible from './GastoCombustible.js';
// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
// Incluir en las variables tarifasJSONpath y gastosJSONpath la ruta de los ficheros de datos
// declarmos variables tarifasJSON y gastosJSON donde se van a cargar ficheros JSON
let tarifasJSON = null;
let gastosJSON = null;
//b--Incluir en las variables tarifasJSONpath y gastosJSONpath la ruta de los ficherosde datos--
let tarifasJSONpath = 'data/tarifasCombustible.json';
let gastosJSONpath = 'data/gastosCombustible.json';

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
    y lo guardamos en la variable anio. Obtenemos el precio del viaje y lo guardamos 
    en la variable costeDelViaje. Usaremos el array aniosArray para guardar el gasto total por año 
    */
    
    for (let indice in gastosJSON) {
        let anio = new Date(gastosJSON[indice].date).getFullYear();
        let costeDelViaje = gastosJSON[indice].precioViaje;
        aniosArray[anio] += costeDelViaje;
    }

    //console.log('Array aniosArray: ' , aniosArray); // Para verificar aniosArray en la consola

    /* 
    d--Muestra el importe del gasto total para cada año en el apartado “Gastos Totales:”--  
    Actualizar el index.html con los gastos totales que obtenemos de  recorrer el Array aniosArray
    Pintamos en el index.html con ... ¿textContent o innerText? 
    textContent es una opción más eficiente pero no considera los estilos aplicados
    La expresión `gasto${anio}` toma la cadena "gasto" y le concatena el valor 
    de la variable anio para introducir el gasto en el span que corresponda. Redondeamos a dos decimales.
    */
    for (let anio in aniosArray) {
        document.getElementById(`gasto${anio}`).textContent = aniosArray[anio].toFixed(2);
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
    Y buscamos con find() las tarifas correspondientes en tarifasJSON a ese año
    */
    const anio = fecha.getFullYear();
    const tarifaAnio = tarifasJSON.tarifas.find(t => t.anio === anio);

    if (!tarifaAnio || !tarifaAnio.vehiculos[tipoVehiculo]) {
        console.error('No se encontró una tarifa válida para el año o el tipo de vehículo.');
        return;
    }
    // find() nos devuelve el primer objeto dentro del array tarifas que cumpla con la condicion, 
    // que es el año introducido por el ususario
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
    const convertidoJSON = nuevoGasto.convertToJSON();

    // Mostramos en nueva fila el ultimo gasto añadido, en formato JSON sin formatear, en "Gastos recientes"
    /* para ello vamos creando li dentro de la ul y metemos dentro de ellas los datos
        
        const listaGastos = document.getElementById('expense-list');
        const nuevoElemento = document.createElement('li'); 
        nuevoElemento.textContent = convertidoJSON;
        listaGastos.appendChild(nuevoElemento);
        
        Simplificando tenemos:
    */
    document.getElementById('expense-list').appendChild(document.createElement('li')).textContent = convertidoJSON;
 
    /* Y si quisieramos formater el contenido del nuevo gasto de forma legible prodriamos volver a pasear:
       const gastoJSON = JSON.parse(convertidoJSON);
       nuevoElemento.textContent = `Vehículo: ${gastoJSON.vehicleType}, Fecha: ${new Date(gastoJSON.date).toLocaleDateString()}, Kilómetros: ${gastoJSON.kilometers}, Precio del Viaje: €${gastoJSON.precioViaje.toFixed(2)}`;
    */
    
    // -- d. Actualizar el gasto total correspondiente en el apartado “Gastos Totales:” --
    actualizarGastoTotal(anio, precioViaje);

    // --e. Dejar el formulario en blanco de nuevo
    document.getElementById('fuel-form').reset();
}

// Función para actualizar el gasto total del año correspondiente
// parametros fecha y precioViaje. Sumamos al gasto total del año correspondiente, el nuevo precioViaje calculado
function actualizarGastoTotal(anio, precioViaje) {
    
    const spanGasto = document.getElementById(`gasto${anio}`);

    if (spanGasto) {
        const gastoActual = parseFloat(spanGasto.textContent) || 0;
        spanGasto.textContent = (gastoActual + precioViaje).toFixed(2); // Actualizar el gasto total del año
    }
}

