import { Injectable } from '@angular/core';
import { FirebaseCodeErrorEnum } from '../utils/Firebase-Code-Error';
import { AngularFirestore , AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import { Observable , map } from 'rxjs';
import { collection, doc, setDoc , DocumentData, onSnapshotsInSync, updateDoc, onSnapshot, query} from "firebase/firestore";
import {users} from 'src/app/components/user/user';
import { Mensaje } from '../interface/mensaje.interface';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';



@Injectable({
  providedIn: 'root'
})
export class FirebaseCodeErrorService {
  mensaje: string
  conectados: any = [];
  userDesconectado: {} = {};
  conectado: boolean = false;
  public usuario: any = {};
  public listaUsuarios: any = [];
  private itemsCollection: AngularFirestoreCollection<any> | undefined;
  private userCollections: AngularFirestoreCollection<any>| undefined;
  public chats: Mensaje[] = [];
  dataUser: any;
  listaUsers:users[] = [];
  pruebaUser: object ={
    email:'',
    uid:'',

  }
  constructor(
    private firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    private router: Router,
  ) { 

    this.afAuth.authState.subscribe(user => {
      console.log(user);

      if(!user){
        console.log(user);
        return;
      }

      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    })

  }

  CodeErrors(code: string) {
    switch (code) {
      //correo ya existe
      case FirebaseCodeErrorEnum.emailAlrreadyInUse:
        return 'El usuario ya existe';

      //contraseña debil
      case FirebaseCodeErrorEnum.WeakPassword:
        return 'La contraseña es debil';

      //correo invalido
      case FirebaseCodeErrorEnum.InvalidEmail:
        return 'Correo Invalido';

      //Contraseña Incorrecta
      case FirebaseCodeErrorEnum.WrongPassword:
        return 'Contraseña Incorrecta';

        //usuario no existe
      case FirebaseCodeErrorEnum.UserNotFound:
        return 'El usuario no existe';

      case FirebaseCodeErrorEnum.cancelledPopup:
        return 'Cancelo el logueo';
      
      case FirebaseCodeErrorEnum.popuClosed:
        return 'Cerro el logueo';

      case FirebaseCodeErrorEnum.ExistCountDiferentCredencial:
        return 'Usted ya se logueo con otra credencial';
  
      default:
        return 'Error Desconocido';

    }
  }
  async guardarUser(dataUser: any) {
    const objeUser = {
      email: dataUser.email,
      uid: dataUser.uid,
      conectado: true,
    }

    const saveUser = async (objeUser: any) => {

      const res = this.firestore.collection('user').doc(objeUser.uid).set(objeUser)
      .then( ()=>{console.log(res)} )
      .catch( (err)=>{console.log(err)} )
      console.log(objeUser.uid)
      return res;
    }
    saveUser(objeUser);
  }

  leerUsuarios(dataUser: any) {
    this.getuid()

    this.dataUser = dataUser;
    const lectura = this.firestore.collection('user').get().toPromise();
    console.log(lectura)
    lectura.then((resp) => {

      const document = resp?.docs;
      for(let objet of document!) {
        let datosUser = new users();
        const dts:any = objet.data();
        datosUser.email = dts.email;
        datosUser.uid = dts.uid;
        datosUser.conectado = true;

        this.listaUsers.push(datosUser);
      }

      let existeUsuario = false;
      for(let unUser of this.listaUsers) {
        if(unUser.email == dataUser.email) {
          existeUsuario = true;
          break
        }
      }
      if(existeUsuario == false){
        this.guardarUser(dataUser);
      }

    }).catch(error => console.log(error));

    return this.listaUsers;
  }

  async logOut() {
    const objeUser = {
      email: this.dataUser.email,
      uid: this.dataUser.uid,
      conectado: false
    }

    console.log(objeUser, 'objUser');
    const saveUser = async (objeUser: any) => {

      const res = this.firestore.collection('user').doc(objeUser.uid).set(objeUser)
      .then( ()=>{console.log(res, 'rp')} )
      .catch( (err)=>{console.log(err)} )
      console.log(objeUser.uid)
      return res;
    }
    saveUser(objeUser);
    /*console.log(this.usuario, 'uid user');
    const unsub = getFirestore.collection('user').onSnapshot((query: any) => {
      console.log(query)
    });

    /*await userDesconectado.doc('38fmlSlFPUoxsVnZqINC')
    .update({
      conectado: false,
    });

    for(let usuario of this.listaUsers) {
      if(this.usuario.uid == usuario.uid) {
        console.log('iguales');
        usuario.conectado == false;
        this.updateUser(usuario);
      
      }

    }*/
    //this.usuario = {};
    this.afAuth.signOut().then(() => this.router.navigate(['/login']));
  }


  cargarMensaje() {
    this.itemsCollection = this.firestore.collection<Mensaje>('chats', ref=>ref.orderBy('fecha', 'desc').limit(5));

    return this.itemsCollection.valueChanges().pipe(map((mensajes: Mensaje[]) => {
        //this.chats = mensajes;
        this.chats = [];
        for (let mensaje of mensajes) {
          this.chats.unshift(mensaje);
        }
        return this.chats;


      }))

  }

  agregarMensaje(texto: string) {
    let mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid,
    }
    return this.itemsCollection?.add(mensaje);
  }


  getuid() {
    let datosUsuario: any[] = [];
    
    const unsub = this.firestore.collection('user');

  }



}