const { log } = require("node:console");
const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 1.
const users = [
  {
    nombre: "Administrador",
    documento: "1122334455",
    contraseña: "administrador888",
    tipo: 1,
  },
  {
    nombre: "Jhonier",
    documento: "1234567890",
    contraseña: "Jhonier123",
    tipo: 2,
  },
];

// 3 y 4
const cantidadDeBilletes = [
  { valor: 5000, cantidad: 0 },
  { valor: 10000, cantidad: 0 },
  { valor: 20000, cantidad: 0 },
  { valor: 50000, cantidad: 0 },
  { valor: 100000, cantidad: 0 },
];

// 2.
const solicitarDocumentoYContraseña = (callback) => {
  rl.question("Documento: ", (documento) => {
    rl.question("Contraseña: ", (contraseña) => {
      const user = users.find(
        (user) => user.documento === documento && user.contraseña === contraseña
      );
      if (!user) {
        console.log("El usuario no existe, Ingrese nuevamente.");
        return solicitarDocumentoYContraseña(callback);
      }
      callback(user);
    });
  });
};

const cargarCajero = () => {
  rl.question("Ingresa la Cantidad de billetes de 5 mil pesos: ", (c5k) => {
    cantidadDeBilletes[0].cantidad += parseInt(c5k);
    rl.question("Ingresa la cantidad de billetes de 10 mil pesos: ", (c10k) => {
      cantidadDeBilletes[1].cantidad += parseInt(c10k);
      rl.question(
        "Ingresa la cantidad de billetes de 20 mil pesos: ",
        (c20k) => {
          cantidadDeBilletes[2].cantidad += parseInt(c20k);
          rl.question(
            "Ingresa la cantidad de billetes de 50 mil pesos: ",
            (c50k) => {
              cantidadDeBilletes[3].cantidad += parseInt(c50k);
              rl.question(
                "Ingresa la cantidad de billetes de 100 mil pesos: ",
                (c100k) => {
                  cantidadDeBilletes[4].cantidad += parseInt(c100k);
                  informacionTotalDelCajero();
                  login();
                }
              );
            }
          );
        }
      );
    });
  });
};

// 5.
const informacionTotalDelCajero = () => {
  console.log("Informacion total del Cajero");
  let total = 0;
  for (const denominacion of cantidadDeBilletes) {
    const subtotal = denominacion.valor * denominacion.cantidad;
    total += subtotal;
    console.log(
      `Billetes de ${denominacion.valor}: ${denominacion.cantidad}, Total: ${subtotal}`
    );
  }
  console.log(`Total en cajero: ${total}`);
};

const retirarDinero = () => {
  rl.question("Cantidad a retirar: ", (monton) => {
    monton = parseInt(monton);
    let montonOriginal = monton;
    let cantidadDeRetiro = [];
    cantidadDeBilletes.sort((a, b) => b.valor - a.valor);
    for (const denominacion of cantidadDeBilletes) {
      const cantidad = Math.min(
        Math.floor(montonOriginal / denominacion.valor),
        denominacion.cantidad
      );
      if (cantidad > 0) {
        cantidadDeRetiro.push({ valor: denominacion.valor, cantidad });
        montonOriginal -= denominacion.valor * cantidad;
      }
    }
    if (montonOriginal > 0) {
      console.log("No hay suficiente dinero en el cajero");
      login();
    } else {
      console.log("Retirando, espere un momento");
      for (const retiro of cantidadDeRetiro) {
        console.log(`Billetes de ${retiro.valor}: ${retiro.cantidad}`);
        const denominacion = cantidadDeBilletes.find(
          (d) => d.valor === retiro.valor
        );
        denominacion.cantidad -= retiro.cantidad;
      }
      informacionTotalDelCajero();
      login();
    }
  });
};

const login = () => {
  solicitarDocumentoYContraseña((user) => {
    if (user.tipo === 1) {
      console.log(
        "Bienvenido administrador, puede cargar el dinero en el cajero"
      );
      cargarCajero();
    } else if (user.tipo === 2) {
      const totalMoney = cantidadDeBilletes.reduce(
        (acc, denominacion) => acc + denominacion.valor * denominacion.cantidad,
        0
      );
      if (totalMoney === 0) {
        console.log("Cajero en mantenimiento vuelva pronto");
        login();
      } else {
        console.log("Bienvenido cliente, puede retirar el dinero");
        retirarDinero();
      }
    }
  });
};

login();
