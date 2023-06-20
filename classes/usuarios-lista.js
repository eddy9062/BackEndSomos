"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosLista = void 0;
class UsuariosLista {
    constructor() {
        this.lista = [];
    }
    // agregar un usuario
    agregar(usuario) {
        this.lista.push(usuario);
        console.log(this.lista);
        return usuario;
    }
    actualizar_nombre(id, nombre) {
        for (let usuario of this.lista) {
            if (usuario.id === id) {
                usuario.nombre = nombre;
                break;
            }
        }
        console.log('======Actualizando usuario=====');
        console.log(this.lista);
    }
    //obtener lista de usurios
    getLista() {
        return this.lista;
    }
    getUsuario(id) {
        this.lista.find(usuario => {
            return usuario.id === id;
        });
    }
    //obtener todos los usuarios en una sala en particular
    getUsuarioEnSala(sala) {
        return this.lista.filter(usuario => usuario.sala === sala);
    }
    //borrar usuario
    borrarUsuario(id) {
        const usuarioTemp = this.getUsuario(id);
        this.lista = this.lista.filter(usuario => usuario.id !== id);
        //console.log(this.lista)
        return usuarioTemp;
    }
}
exports.UsuariosLista = UsuariosLista;
