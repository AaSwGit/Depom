import React from 'react';
import "./App.css";
import axios from 'axios';
import ReactDOM from 'react-dom';
import App from "./App";
import {getLoginUrl} from "./AppVariables";
import {getBooksUrl} from "./AppVariables";
import {getUsersUrl} from "./AppVariables";
import {getUserBooksUrl} from "./AppVariables";
import BooksPage from "./BooksPage";
import UserPage from "./UserPage";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {infoMessage:"Şifre Giriniz",password:""};
  }
  handleChange = (event) =>{
    const password = event.target.value;
    axios({
      method: "get",
      url: getLoginUrl(),
      auth: {
        username: this.props.userName.toUpperCase(),
        password: password
      }
    })
    .then(res=>{
      this.login(res.data,this.props.userName.toUpperCase(),password);
    })
    .catch(err=>{
      this.setState({infoMessage:"Girilen şifre doğru değil"});
    })
  }
  handleBack = (event) => {
    ReactDOM.render(<App />, document.getElementById('root'));
    event.preventDefault()
  }
  login(isAdmin,userName,password){
    if(isAdmin){
      axios({
        method: "get",
        url: getBooksUrl(),
        auth: {
          username: userName,
          password: password
        }
      })
      .then(res => {
        ReactDOM.render(<BooksPage data={res.data} userName={userName} password={password}/>, document.getElementById('root'));
      })
      .catch(error => {
        alert("Bağlantı hatası ")
      });
    }
    else{
      axios({
        method: "get",
        url: getBooksUrl(),
        auth: {
          username: userName,
          password: password
        }
      })
      .then(res => {
        var books = res.data;
        axios({
          method: "get",
          url: getUsersUrl()+"/"+userName,
          auth: {
            username: userName,
            password: password
          }
        })
        .then(res => {
          var userId = res.data;
          axios({
            method: "get",
            url: getUserBooksUrl()+"/"+userId,
            auth: {
              username: userName,
              password: password
            }
          })
          .then(res => {
            var userbooks = res.data;
            ReactDOM.render(<UserPage userId={userId} userbooks={userbooks} books={books} userName={userName} password={password}/>, document.getElementById('root'));
          })
          .catch(error => {
            alert("Bağlantı hatası userbooks")
          });
        })
        .catch(error => {
          alert("Bağlantı hatası userId")
        });
      })
      .catch(error => {
        alert("Bağlantı hatası books")
      });
    }
  }
  render(){
    return(
      <form className="form-style-7" onSubmit={this.handleSubmit}>
        <ul>
          <li><span>{this.props.userName}</span></li>
          <li>
            <label html="name">Şifre</label>
            <input type="password" name="userName"  onChange={this.handleChange} autoComplete="off" autoFocus/>
          </li>
          <li><span>{this.state.infoMessage}</span></li>
          <input type="submit" value="Geri" name="backButton" onClick={this.handleBack} />
        </ul>
      </form>
    );
  }
}
export default Login;
