import React from 'react';
import "./App.css";
import axios from 'axios';
import ReactDOM from 'react-dom';
import Login from "./Login";
import Register from "./Register";
import {getUrl} from "./AppVariables";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {infoMessage:props.message,userName:"null",buttonStyle:{visibility:"hidden"},buttonName:"Buton",buttonValue:"Buton"};
    this.allChars = ['A','a','B','b','C','c','D','d','E','e','F','f'
    ,'G','g','H','h','I','i','J','j','K','k','L','l','M','m','N','n'
    ,'O','o','P','p','Q','q','R','r','S','s','T','t','U','u','V','v','W','w'
    ,'X','x','Y','y','Z','z','0','1','2','3','4','5','6','7','8','9'
    ,'-','_'
    ];
  }
  handleChange = (event) =>{
    this.setState({[event.target.name]: event.target.value});
    if(event.target.name === "userName"){
      if(this.checkUserName(event.target.value)){
        axios({
          method: "get",
          url: getUrl()+"/isthereuser/"+(event.target.value.toUpperCase())
        })
        .then(res => {
          const result = res.data;
          if(!result){
            this.setState({infoMessage:this.state.userName+" kaydolmak için tıklayınız"});
            this.setState({buttonValue:"Kayıt Ol"});
            this.setState({buttonName:"register"});
            this.setState({buttonStyle:{visibility:"visible"}});
          }
          else{
            this.setState({infoMessage:this.state.userName+" giriş yapmak için tıklayınız"});
            this.setState({buttonValue:"Giriş"});
            this.setState({buttonName:"login"});
            this.setState({buttonStyle:{visibility:"visible"}});
          }
        })
        .catch(error => {
          alert(error);
        })
      }
    }
  }
  checkUserName(userName){
    if(userName.length === 0){
      const errMess = "Kullanıcı adı boş bırakılamaz";
      this.setState({infoMessage:errMess});
      this.setState({buttonStyle:{visibility:"hidden"}});
      return false;
    }
    else if(userName.length < 3){
      const errMess = "Kullanıcı adı 3 karakterden az olamaz";
      this.setState({infoMessage:errMess});
      this.setState({buttonStyle:{visibility:"hidden"}});
      return false;
    }
    else if(userName.length > 17){
      const errMess = "Kullanıcı adı 17 karakterden çok olamaz";
      this.setState({infoMessage:errMess});
      this.setState({buttonStyle:{visibility:"hidden"}});
      return false;
    }
    for(let i=0;i<userName.length;i++){
      if(this.allChars.indexOf(userName[i]) < 0){
        const errMess = "\""+userName[i]+ "\" karakteri kullanılamaz";
        this.setState({infoMessage:errMess});
        this.setState({buttonStyle:{visibility:"hidden"}});
        return false;
      }
    }
    return true;
  }
  handleSubmit = (event) => {
    switch (event.target.name) {
      case "register":
          ReactDOM.render(<Register userName={this.state.userName}/>, document.getElementById('root'));
        break;
      case "login":
          ReactDOM.render(<Login userName={this.state.userName}/>, document.getElementById('root'));
          break;
      default:
          break;
    }
    event.preventDefault();
  }
  render(){
    return(
      <form className="form-style-7" onSubmit={this.handleSubmit}>
      <ul>
      <li><span>LibApp</span></li>
        <li>
          <label html="name">Kullanıcı Adı</label>
          <input type="text" name="userName"  onChange={this.handleChange} autoComplete="off" autoFocus/>
        </li>
        <li><span>{this.state.infoMessage}</span></li>
        <input style={this.state.buttonStyle} type="submit" value={this.state.buttonValue} name={this.state.buttonName} onClick={this.handleSubmit} />
      </ul>
      </form>
    );
  }
}
export default App;
