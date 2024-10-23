/* 
i. Crea la clase en un fichero independiente en el directorio correspondiente js/GastoCombustible.js
ii. Crea los atributos; vehicleType, date, kilometers y precioViaje
iii. Crea un método convertToJSON() que serialice a JSON los atributos del
objeto 
*/

class GastoCombustible {
    constructor(vehicleType, date, kilometers, precioViaje) {
        this.vehicleType = vehicleType;  // Tipo de vehículo (furgoneta, moto, camión)
        this.date = date;                // Fecha del gasto
        this.kilometers = kilometers;    // Kilómetros recorridos
        this.precioViaje = precioViaje;  // Precio del viaje 
    }

    // Método para convertir el objeto a formato JSON
    convertToJSON() {
        return JSON.stringify({
            vehicleType: this.vehicleType,
            date: this.date,
            kilometers: this.kilometers,
            precioViaje: this.precioViaje
        });
    }
}
// permite que esta clase se pueda importar y utilizar en otros archivos dentro del proyecto
export default GastoCombustible;