import React from 'react';
import "./App.css";
import axios from 'axios';
import ReactDOM from 'react-dom';
import App from "./App";
import {getUsersUrl} from "./AppVariables";
class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {infoMessage:this.props.userName+" ile kaydolmak için şifre giriniz",password:""
    ,styleSaveButton:{visibility:"hidden"}};
  }
  handleBack = (event) => {
    ReactDOM.render(<App />, document.getElementById('root'));
    event.preventDefault();
  }
  handleSave = (event) => {
    this.createUser(this.props.userName,this.state.password);
  }
  handleChange = (event) =>{
    if(this.checkPassword(event.target.value)){
      this.setState({infoMessage:""});
      this.setState({password:event.target.value});
      this.setState({styleSaveButton:{visibility:"visible"}});
    }
  }
  checkPassword(password){
    if(password.length === 0){
      const errMess = this.props.userName+" ile kaydolmak için şifre giriniz";
      this.setState({infoMessage:errMess});
      this.setState({styleSaveButton:{visibility:"hidden"}});
      return false;
    }
    else if(password.length > 17){
      const errMess = "Şifre uzunluğu 17 karakterden fazla olamaz";
      this.setState({infoMessage:errMess});
      this.setState({styleSaveButton:{visibility:"hidden"}});
      return false;
    }
    else if(password.length < 5){
      const errMess = "Şifre uzunluğu 5 karakterden az olamaz";
      this.setState({infoMessage:errMess});
      this.setState({styleSaveButton:{visibility:"hidden"}});
      return false;
    }
    return true;
  }
  createUser(userName,password){
    axios({
      method: "post",
      url: getUsersUrl(),
      data: {
        userName: userName.toUpperCase(),
        password: password,
        userRole: "ROLE_USER",
        enabled: true
      }
    })
    .then(res => {
      ReactDOM.render(<App message={this.props.userName+" kaydı başarılı"}/>, document.getElementById('root'));
    })
    .catch(error => {
      alert("Kullanıcı ekleme başarısız")
   });
  }
  render(){
    return(
      <form className="form-style-7" onSubmit={this.handleSubmit}>
        <ul>
          <li><span>Kaydol</span></li>
          <li>
            <label html="name">Şifre</label>
            <input type="password" name="userName"  onChange={this.handleChange} autoComplete="off" autoFocus/>
          </li>
          <li><span>{this.state.infoMessage}</span></li>
          <input type="submit" value="Geri" name="backButton" onClick={this.handleBack} />
          <input style={this.state.styleSaveButton} type="button" value="Kaydol" name="saveButton" onClick={this.handleSave} />
        </ul>
      </form>
    );
  }
}
export default Register;
