"use strict";
module.exports = {
    user: process.env.NODE_ORACLEDB_USER || "ops$usuarioweb",
    // Get the password from the environment variable
    // NODE_ORACLEDB_PASSWORD.  The password could also be a hard coded
    // string (not recommended), or it could be prompted for.
    // Alternatively use External Authentication so that no password is
    // needed.
    password: process.env.NODE_ORACLEDB_PASSWORD || "webusuario",
    // For information on connection strings see:
    // https://oracle.github.io/node-oracledb/doc/api.html#connectionstrings
    connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING || "IBM4.WORLD",
    // Setting externalAuth is optional.  It defaults to false.  See:
    // https://oracle.github.io/node-oracledb/doc/api.html#extauth
    externalAuth: process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
};
