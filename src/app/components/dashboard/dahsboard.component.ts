import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore , AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { collection, doc, setDoc , DocumentData} from "firebase/firestore";
import { FirebaseCodeErrorService } from 'src/app/services/firebase-code-error.service';
import { FormBuilder, FormGroup, Validators , NgModel } from '@angular/forms';
import { users } from '../user/user';

@Component({
  selector: 'app-dahsboard',
  templateUrl: './dahsboard.component.html',
  styleUrls: ['./dahsboard.component.css']
})
export class DahsboardComponent implements OnInit {
  dataUser: any;
  public chats: any[] = [];
  mensaje: string = '';
  elemento: any;


  constructor(
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    public saveUser: FirebaseCodeErrorService
    ) { 

      this.saveUser.cargarMensaje().subscribe(()=>{
        setTimeout(() => {
          this.elemento.scrollTop = this.elemento.scrollHeight;         
        },20);

      });



    }



  ngOnInit(): void {
    this.afAuth.currentUser.then(user => {
      if(user) {
        /*console.log(user.uid);
        this.saveUser.getuid();

        //console.log(this.dataUser.uid);
        /*const guarUser() = async(this.dataUser) {
          await setDoc(doc(this.firestore, 'user', this.dataUser.user.uid))
        }*/
        this.dataUser = user;
        this.saveUser.guardarUser(this.dataUser);
        this.saveUser.leerUsuarios(this.dataUser);
        this.saveUser.listaUsers
        console.log(this.saveUser.listaUsers, 'user');



       // console.log(this.saveUser.listaUsers);

      }else {
        this.router.navigate(['/login']);
      }
    })

    this.elemento = document.getElementById('app-mensajes');

  }




  enviarMensaje(){
    if(this.mensaje?.length === 0){
      return
    }

    
    this.saveUser.agregarMensaje(this.mensaje)
    ?.then(()=>this.mensaje = "")
    .catch((error)=>console.error('error', error));


  } 
  




}



