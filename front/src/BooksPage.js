import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import "./BooksPage.css"
import App from "./App";
import {getBooksUrl} from "./AppVariables";

class BooksPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {books:props.data,bookName:"null",author:"null",pages:0}
  }
  exitPage(event){
    ReactDOM.render(<App/>, document.getElementById('root'));
  }
  reflesh(userName,password){
    axios({
      method: "get",
      url: getBooksUrl(),
      auth: {
      username: userName,
      password: password
    }
    })
    .then(res => {
      this.setState({books:res.data});
   })
    .catch(error => {
      alert("Bağlantı hatası ")
   });
  }
  addSubmit=(event)=>{
    axios({
      method: "post",
      url: getBooksUrl(),
      data: {
        bookName:this.state.bookName,
        author:this.state.author,
        pages:this.state.pages,
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
  editSubmit=(event)=>{
    const Id = event.target.name;
    axios({
      method: "put",
      url: getBooksUrl()+"/"+Id,
      data: {
        bookName:this.state.bookName,
        author:this.state.author,
        pages:this.state.pages,
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
      alert("Güncelleme başarısız")
   });

  }
  deleteSubmit=(event)=>{
    const Id = event.target.name;
    axios({
      method: "delete",
      url: getBooksUrl()+"/"+Id,
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
  handleChange=(event)=>{
    this.setState({[event.target.name]: event.target.value});
  }
  renderTable() {
      return this.state.books.map((details, index) => {
         const { id, bookName, author,pages } = details; //destructuring
         return (
            <tr key={id}>
            <td><input type="submit" value="X" name={id} onClick={this.deleteSubmit}/></td>
               <td>{bookName}</td>
               <td>{author}</td>
               <td>{pages}</td>
               <td><input type="button" value="√" name={id} onClick={this.editSubmit}/></td>
            </tr>
         )
      })
   }
  render(){
    return(
      <div>
        <table id="books">
        <thead>
      <tr>
        <th>{this.props.userName}</th>
        <th>Kitap Adı</th>
        <th>Yazar</th>
        <th>Sayfa Sayısı</th>
        <th>Düzenle</th>
      </tr>
      </thead>
        <tbody>
          <tr>
          <td><input type="submit" value="ÇIKIŞ" name="exitPage" onClick={this.exitPage}/></td>
          <td><input type="text" name="bookName"  onChange={this.handleChange} /></td>
          <td><input type="text" name="author"  onChange={this.handleChange} /></td>
          <td><input type="number" name="pages"  onChange={this.handleChange} /></td>
          <td><input type="submit" value="+" name="add" onClick={this.addSubmit} /></td>
          </tr>
          {this.renderTable()}
          </tbody>
      </table>
    </div>
    );
  }
}
export default BooksPage;
