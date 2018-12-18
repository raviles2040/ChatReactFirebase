import React, {Component} from 'react';
import firebase from 'firebase';
import './App.css';
import FileUpload from './FileUpload/FileUpload';
import CustomModal from './CustomModal/CustomModal';
import CustomHeader from './customHeader/customHeader';
import Chat from './Chat/Chat';
import {Button} from 'reactstrap';
import logoFirebase from './img/Firebase.png';

class App extends Component {
    constructor() {
        super();
        this.state = {
            user: null,
            photoUrl: ""
        };
        this.renderLoginButton = this.renderLoginButton.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.addImageToState = this.addImageToState.bind(this);
    }

    componentWillMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.setState({user});
        });
    }

    handleAuth(e) {
        const provider = e.target.getAttribute('Provider') === "Google" ?
            new firebase.auth.GoogleAuthProvider() : new firebase.auth.EmailAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then(result => console.log(`${result.user.email} ha inciado sesión`))
            .catch(error => console.log(`Error: ${error.code}: ${error.message}`))
    }

    handleAuthWithEmail(email, password) {
        new firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(error => alert(error))
    }

    renderLoginButton() {
        if (this.state.user) {
            return (
                <div id='contents'>
                    <img src={this.state.user.photoURL} alt={this.state.user.displayName}/>
                    <div id="contents-body">
                        <h1>Hola {this.state.user.displayName}!</h1>
                        <FileUpload url={this.addImageToState}/>
                        <Chat id={this.state.user.displayName} photo={this.state.photoUrl}/>
                        <Button color="danger" onClick={this.handleLogout}>Cerrar Sesión</Button>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div id={'preLogin'}>
                    <img id={'logo'} src={logoFirebase} alt={"firebase"}/>
                    <Button color="primary" provider={"Google"} onClick={this.handleAuth}> Login con Google </Button>
                    <CustomModal handleAuthUser={this.handleAuthUser} saveUser={this.handleAuthWithEmail} color="success"
                                 buttonLabel={"sign in / sign up"}/>
                </div>
            )
        }
    }

    handleLogout() {
        firebase.auth().signOut();
    }

    handleAuthUser(email, password) {
        new firebase.auth().signInWithEmailAndPassword(email, password)
            .catch(error => alert(error))
    }

    addImageToState(url) {
        this.setState({
            photoUrl: url
        })
    }

    render() {
        return (
            <div className="App">
                <CustomHeader title={"Proyecto despliegue de aplicaciones web"}
                              description={"Desarrollado por: Raúl Avilés, Adrián Carmona e Iván Román"}
                />
                <div className={'buttons'}>
                    {this.renderLoginButton()}
                </div>
            </div>
        );
    }
}

export default App;
