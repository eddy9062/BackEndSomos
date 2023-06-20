"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const fs = require('fs');
const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');
//const demoSetup = require('./demosetup.js');
// On Windows and macOS, you can specify the directory containing the Oracle
// Client Libraries at runtime, or before Node.js starts.  On other platforms
// the system library search path must always be set before Node.js is started.
// See the node-oracledb installation documentation.
// If the search path is not correct, you will get a DPI-1047 error.
let libPath;
if (process.platform === 'win32') { // Windows
    libPath = 'C:\\oracle\\instantclient_21_3';
} /*else if (process.platform === 'darwin') {   // macOS
  libPath = process.env.HOME + '/Downloads/instantclient_19_8';
}*/
if (libPath && fs.existsSync(libPath)) {
    oracledb.initOracleClient({ libDir: libPath });
}
// Oracledb properties are applicable to all connections and SQL
// executions.  They can also be set or overridden at the individual
// execute() call level
// This script sets outFormat in the execute() call but it could be set here instead:
//
// oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
//module.exports = async function  run(p_codigo: number) {
function run(p_codigo) {
    return __awaiter(this, void 0, void 0, function* () {
        let connection;
        try {
            // Get a non-pooled connection
            connection = yield oracledb.getConnection(dbConfig);
            //await demoSetup.setupBf(connection);  // create the demo table
            // The statement to execute
            const sql = `select empcod, nombre,to_char(sysdate,'dd/mm/yyyy') fecha, 
              CASE 
                WHEN TO_NUMBER(to_char(sysdate,'HH24')) <= 10 THEN 1 
                WHEN TO_NUMBER(to_char(sysdate,'HH24')) <= 17 THEN 2 
                ELSE 3 
              END TIPO_MENU       
              from( 
            select empcod, empnom||' '||empape nombre  
            from humanos.rh_empleado 
            where empfecliq is null 
            union 
            select empcod, empnom||' '||empape nombre  
            from sisnom.rh_empleado, 
                  sisnom.rh_empleados_por_empresa 
            where empcod = codigo_empleado  
              and fecha_liquidacion is null
              UNION
              select EMPLEADO_ALIMEN,PRIMER_NOMBRE||' '||SEGUNDO_NOMBRE||' '||PRIMER_APELLIDO||' '||SEGUNDO_APELLIDO NOMBRE 
                  from sisnom.RH_PERSONAL_EXTERNO
                  WHERE EMPLEADO_ALIMEN IS NOT NULL
              )
            where empcod = :codigo `;
            const sql2 = `Select det.numero_operacion no_orden,det.item, det.cod_menu, im_componentes_menu.descripcion, det.estado
            From im_componentes_menu,  
                 im_detalle_ventas det 
            where im_componentes_menu.corporacion = det.corporacion 
            and im_componentes_menu.empresa = det.empresa 
            and im_componentes_menu.almacen = det.almacen 
            and im_componentes_menu.codigo = det.cod_menu 
            AND DET.COD_EMPLEADO = :codigo
            AND DET.TIEMPO_COMIDA = :tipomenu
            AND DET.FECHA_MENU = :fechamenu
            AND det.estado = 'DE' 
            AND det.despachado_sn is null
            ORDER BY 1,2 `;
            let menu;
            let result;
            let detresult;
            // Default Array Output Format
            /*  menu = await connection.execute(sql,[p_codigo],
                {
                  outFormat: oracledb.OBJECT
                 }
                 );
              console.log("----- Banana Farmers (default ARRAY output format) --------");*/
            //console.log(menu);
            /*  menu.movOrden = await connection.execute(sql2,[9062,2,'07/03/2022'],
              {
                outFormat: oracledb.OUT_FORMAT_OBJECT
               });
              console.log("----- Banana Farmers (default ARRAY output format) --------");
              console.log(JSON.stringify(menu));
          */
            // Optional Object Output Format
            result = yield connection.execute(sql, [p_codigo], // A bind parameter is needed to disambiguate the following options parameter and avoid ORA-01036
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT, // outFormat can be OBJECT or ARRAY.  The default is ARRAY
                // prefetchRows:   100,                    // internal buffer allocation size for tuning
                // fetchArraySize: 100                     // internal buffer allocation size for tuning
            });
            menu = result.rows[0];
            //console.log(menu);
            for (const row of result.rows) {
                //console.log(row.FECHA)
                detresult = yield connection.execute(sql2, [p_codigo, row.TIPO_MENU, row.FECHA], // A bind parameter is needed to disambiguate the following options parameter and avoid ORA-01036
                {
                    outFormat: oracledb.OUT_FORMAT_OBJECT, // outFormat can be OBJECT or ARRAY.  The default is ARRAY
                });
                menu.movOrden = detresult.rows;
            }
            if (menu.movOrden.length == 0) {
                return '';
            }
            else {
                return menu;
            }
            //console.log(menu);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            if (connection) {
                try {
                    // Connections should always be released when not needed
                    yield connection.close();
                }
                catch (err) {
                    console.error(err);
                }
            }
        }
    });
}
exports.run = run;
//run();
