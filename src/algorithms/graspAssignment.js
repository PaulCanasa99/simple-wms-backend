const HandlingUnit = require("../models/handlingUnit");
const Location = require("../models/location");

const NUM_MAX_ITERACIONES = 50;
const NUM_MAX_ITERACIONES_LOCAL = 10;
const ALFA = 0.25;
const ROTACION_A = 1;
const ROTACION_B = 0.5;
const ROTACION_C = 0.1;
const FACTOR_DISTANCIA_VERTICAL = 10;
let MAX_DISTANCIA;
const MIN_DISTANCIA = 0;

const graspAssignment = async (incomingHandlingUnits) => {
    let mejorSolucion = {
        candidatos: [],
        valor: 0,
    };
    const warehouseHandlingUnits = await HandlingUnit.find().populate('product');
    const handlingUnits = incomingHandlingUnits.map(incomingHandlingUnit => warehouseHandlingUnits.find((handlingUnit) => incomingHandlingUnit === handlingUnit._id.toString()));
    const locations = await Location.find();
    MAX_DISTANCIA = Math.max(...locations.map(location => getDistance(location)));
    for (let i = 0; i < NUM_MAX_ITERACIONES; i++) {
        let solucion = await construccion(ALFA, handlingUnits, locations);
        solucion = busquedaLocal(solucion);
        if (solucion.valor > mejorSolucion.valor) {
            mejorSolucion = solucion;
        }
        console.log('Iteración: ', i + 1);
        console.log('Valor: ', mejorSolucion.valor);
    }
    return mejorSolucion.candidatos;
}

const construccion = async (alfa, incomingHandlingUnits, warehouseLocations) => {
    const solucion = {
        candidatos: [],
        valor: 0
    };
    let locations = [...warehouseLocations];
    locations = locations.filter(location => location.status === 'Libre');
    let handlingUnits = [...incomingHandlingUnits];
    for (let i = 0; i < incomingHandlingUnits.length; i++) {
      const RCL = obtenerRCL(handlingUnits, locations, alfa);
      const candidatoAleatorio = RCL[Math.floor(Math.random() * RCL.length)];
      solucion.candidatos.push(candidatoAleatorio);
      solucion.valor += obtenerValor(candidatoAleatorio);
      locations = actualizarUbicaciones(locations, candidatoAleatorio);
      handlingUnits = updateHandlingUnits(handlingUnits, candidatoAleatorio);
    }
    return solucion;
}

const obtenerRCL = (handlingUnits, ubicaciones, alfa) => {
  const paresPosibles = obtenerParesPosibles(handlingUnits, ubicaciones);
  const valorPeorCandidato = obtenerValorPeorCandidato(paresPosibles);
  const valorMejorCandidato = obtenerValorMejorCandidato(paresPosibles);
  const RCL = [];
  const minRCL = valorMejorCandidato - alfa*(valorMejorCandidato - valorPeorCandidato);
  paresPosibles.forEach(handlingUnitLocation => {
    const valor = obtenerValor(handlingUnitLocation);
    if (valor >= minRCL) RCL.push(handlingUnitLocation);
  })
  return RCL;
}

const obtenerParesPosibles = (handlingUnits, locations) => {
  const paresPosibles = [];
  handlingUnits.forEach(handlingUnit => {
    locations.forEach(location => {
      if (handlingUnit.product.clasification === location.clasification ){
          const handlingUnitLocation = {handlingUnit: {...handlingUnit._doc}, location: {...location._doc}};
          paresPosibles.push(handlingUnitLocation);
      }
    });    
});
  return paresPosibles;
}

const convertirRotacion = (producto) => {
    switch (producto.rotation) {
        case 'A':
            return ROTACION_A;
        case 'B':
            return ROTACION_B;
        case 'C':
            return ROTACION_C;
        default:
            return 0;
    }
}

const getDistance = (location) => {
  return location.xDistance + location.yDistance + location.zDistance * FACTOR_DISTANCIA_VERTICAL;
}

const obtenerValorPeorCandidato = (paresPosibles) => {
  return Math.min(...paresPosibles.map(productoUbicacion => obtenerValor(productoUbicacion)));
}

const obtenerValorMejorCandidato = (paresPosibles) => {
  return Math.max(...paresPosibles.map(productoUbicacion => obtenerValor(productoUbicacion)));
}

const obtenerValor = (handlingUnitLocation) => {
  return convertirRotacion(handlingUnitLocation.handlingUnit.product) / normalizar(getDistance(handlingUnitLocation.location), MIN_DISTANCIA, MAX_DISTANCIA);
}

const actualizarUbicaciones = (locations, handlingUnitLocation) => {
  return locations.filter((location) => location.code !== handlingUnitLocation.location.code);;
}

const updateHandlingUnits = (handlingUnits, handlingUnitLocation) => {
  return handlingUnits.filter((handlingUnit) => handlingUnit._id !== handlingUnitLocation.handlingUnit._id);;
}

const busquedaLocal = (solucion) => {
    let mejorSolucion = {...solucion};
    for (let i = 0; i < NUM_MAX_ITERACIONES_LOCAL; i++) {
        let solucionLocal = alternarCandidatos(mejorSolucion);
        if (solucion.valor > mejorSolucion.valor) {
            mejorSolucion = solucionLocal;
            console.log("Nueva solución local: ", mejorSolucion.valor);
        }
    }
    return solucion;
}

const alternarCandidatos = (solucion) => {
    const solucionAlterada = {candidatos: [...solucion.candidatos], valor: 0};
    const par1 = solucionAlterada.candidatos[Math.floor(Math.random() * solucionAlterada.candidatos.length)];
    const par2 = obtenerParPosible(par1, solucionAlterada.candidatos);
    if (par2) {
        solucionAlterada.valor = calcularValorCandidatos(solucionAlterada.candidatos);
        let temp = par1.handlingUnit;
        par1.handlingUnit = par2.handlingUnit;
        par2.handlingUnit = temp;
    }
    return solucionAlterada;
}

const obtenerParPosible = (par1, candidatos) => {
    const paresPosibles = candidatos.filter((handlingUnitLocation) => handlingUnitLocation.handlingUnit.product.clasification === par1.handlingUnit.product.clasification);
    if (!paresPosibles.length) return null;
    return paresPosibles[Math.floor(Math.random() * paresPosibles.length)];
}

const calcularValorCandidatos = (solucion) => {
    return solucion.reduce((prev, curr) => prev + obtenerValor(curr), 0);
}

const normalizar = (val, min, max) => {
    const delta = max - min;
    return (val - min) / delta
}

module.exports = {
  graspAssignment,
}