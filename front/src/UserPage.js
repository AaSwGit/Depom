import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import "./BooksPage.css"
import App from "./App";
import {getUserBooksUrl} from "./AppVariables";
import Modal from "react-modal";

Modal.setAppElement(document.getElementById('root'))

class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {books:props.books,userbooks:props.userbooks,selectedId:"0"
    ,bookName:"",author:"",pages:0,bookButtonStyle:{visibility:"hidden"},modalIsOpen:false
  };
  this.counter = 0;
}
openModal = () => {
  this.setState({modalIsOpen:true});
}
closeModal = () =>{
  this.setState({modalIsOpen:false});
}
exitPage(event){
  ReactDOM.render(<App/>, document.getElementById('root'));
}
reflesh(userName,password){
  axios({
    method: "get",
    url: getUserBooksUrl()+"/"+this.props.userId,
    auth: {
      username: userName,
      password: password
    }
  })
  .then(res => {
    this.setState({userbooks:res.data});
  })
  .catch(error => {
    alert("Bağlantı hatası userbooks reflesh")
  });
}
renderData() {
  return this.state.books.map((details, index) => {
    const {id,bookName} = details;
    return (
      <option key={id} value={id}>{bookName}</option>
    )
  })
}
add(userId,bookId){
  const book = {id:bookId};
  const user = {id:userId};
  axios({
    method: "post",
    url: getUserBooksUrl(),
    data: {
      user : user,
      book : book
    },
    auth: {
      username: this.props.userName,
      password: this.props.password
    }
  })
  .then(res => {
    this.reflesh(this.props.userName,this.props.password);
  })
  .catch(error => {
    alert("Ekleme başarısız")
  });
}
changedSelect = (event)=>{
  this.setState({bookButtonStyle:{visibility:"visible"}});
  this.setState({selectedId : event.target.value});
  if(this.counter === 0){
    event.target.remove(0);
  }
  var book = this.state.books.find(books => books.id == event.target.value);
  this.setState({author : book.author});
  this.setState({pages : book.pages});
  this.setState({bookName:book.bookName});
  this.counter++;
}
handleSubmit = (event) =>{
  switch (event.target.name) {
    case "add":
     this.add(this.props.userId,this.state.selectedId);
     break;
    case "details":
      this.openModal();
      break;
    default:
      break;
  }
}
deleteSubmit = (event) => {
  const Id = event.target.name;
  axios({
    method: "delete",
    url: getUserBooksUrl()+"/"+Id,
    auth: {
      username: this.props.userName,
      password: this.props.password
    }
  })
  .then(res => {
    this.reflesh(this.props.userName,this.props.password);
  })
  .catch(error => {
    alert("Silme başarısız Id: "+Id+" bulunmadı");
  });
}
renderTable(){
  return this.state.userbooks.map((details, index) => {
    const { id,book,createdAt } = details;
    const date = new Date(createdAt).getHours() + ":"
    + new Date(createdAt).getMinutes() + ":"
    + new Date(createdAt).getSeconds() + " "
    + new Date(createdAt).getDate() + "/"
    + (Number(new Date(createdAt).getMonth())+1) + "/"
    + new Date(createdAt).getFullYear();
    return (
      <tr key={id}>
        <td>{book.bookName}</td>
        <td>{date}</td>
        <td><input type="submit" value="X" name={id} onClick={this.deleteSubmit}/></td>
      </tr>
    )
  })
}
renderBookModalDet(){
  return(
    <Modal
      isOpen={this.state.modalIsOpen}
      className="Modal"
      onRequestClose={this.closeModal}
      >
        <form className="form-style-3" onSubmit={this.handleSubmit}>
          <ul>
            <li><span>Kitap Adı: {this.state.bookName}</span></li>
            <li><span>Yazar: {this.state.author}</span></li>
            <li><span>Sayfa Sayısı: {this.state.pages}</span></li>
          </ul>
        </form>
      </Modal>
  )
}
render(){
  return(
    <div>
      {this.renderBookModalDet()}
        <div className="box">
          <input type="submit" style={this.state.bookButtonStyle}value="i" name="details" onClick={this.handleSubmit} />
          <select onChange={this.changedSelect}>
            <option value="0">Kitap Seçiniz</option>
            {this.renderData()}
          </select>
          <input type="submit" style={this.state.bookButtonStyle} value="+" name="add" onClick={this.handleSubmit} />
          <input type="button" value="<-" name="exit" onClick={this.exitPage} />
          <input type="button" value={this.props.userName} name="userNameButton"></input>
        </div>
        <div>
        </div>
        <table id="books">
          <thead>
            <tr>
              <th>Kitap Adı</th>
              <th>Tarih</th>
              <th>Düzenle</th>
            </tr>
          </thead>
          <tbody>
            {this.renderTable()}
          </tbody>
        </table>
      </div>
    );
  }
}
export default UserPage;
