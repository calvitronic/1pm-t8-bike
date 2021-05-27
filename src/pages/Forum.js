import Layout from "../components/Layout";
import React, {Component} from 'react';
import axios from 'axios';
import Container from "react-bootstrap/Container";
import getUser from "../utils/get-user";

//const textStyle = {maxWidth: "100%", width: "700px"}


//style for posts
const styles = {
  postStyle: {
    borderStyle: 'outset',
    marginTop: "5px",
    marginBottom: "5px",
    textAlign: 'left',
    padding: '5px',
    wordBreak: 'break-all',
    overflowWrap: 'break-word',
  },
  //style for post list
  postListStyle: {
    padding: '0',
  },
  postLinkStyle: {
    color: 'inherit',    
  },
  categoryStyle: {
    borderRadius: '20px',
    padding: '5px',
    paddingLeft: '10px',
    paddingRight: '10px',
    fontSize: '12px',
    textDecoration: 'none',
    background: 'blue',
    color: "white",
  },
  statusStyle: {
    borderRadius: '20px',
    padding: '5px',
    paddingLeft: '10px',
    paddingRight: '10px',
    fontSize: '12px',
    textDecoration: 'none',
    background: 'red',
    color: "white",
  },
  delEditButtons:{
    fontSize: '13px',
    float: 'left',
  }
}
// this is the main page of forum, see list of posts

// Post Component
const Post = props => (
  <li className="row" style={styles.postStyle}>
    <body>
      <a href={`/forum/${props.post._id}`} style={styles.postLinkStyle}>
        <h4 className="title">
          {props.post.title}  <small style={styles.categoryStyle}>{props.post.category}</small>  <small >{ props.post.status === 'CLOSED' &&  <span style={styles.statusStyle}>{props.post.status}</span>}</small> 
        </h4>
        <div className="bottom">
          <p className="info-line">
              <span className="author">{props.post.username}</span> - <span className="date">{props.post.date.substring(0,10)}</span> - <span className="comment-count">{props.post.numComments} comments</span>
          </p>
        </div>
      </a>
      <p className="buttons" style={styles.delEditButtons}>
        <input type="button" value="Change Status" onClick={() => {props.changeStatus()}}/> <input type="button" value="Edit" onClick={() => {props.editPost()}}/> <input type="button" value="Delete" onClick={() => {props.deletePost()}}/>
      </p>
    </body>
  </li>
)

// this component will list out all the posts created
export default class ForumPost extends Component{
  constructor(props){
    super(props);
    this.editPost = this.editPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.state = {posts: [],user: getUser(),filter: "All"};
    //this.isLoggedIn = getUser();
  }
  
  // this function grabs the list of posts from db
  componentDidMount(){
    console.log(this.state.user);
    axios.get('http://localhost:3001/posts') //get request
         .then(res=>{
           console.log(res.data)
           this.setState({posts: res.data}) //sets posts array to db array
         }) 
         .catch(err => {
           console.log(err);
         })
  }// end componentDidMount

   /*
    delete post will delete the item from db and redirect to forums main page with msg that
    says 'Post deleted!'
    */
  deletePost(id){
    if (window.confirm("Are you sure you want to delete this post?")) {
      axios.delete(`http://localhost:3001/posts/${id}`)
          .then(res => {
              console.log(res.data)
              //update post
              axios.get('http://localhost:3001/posts') //get request
                    .then(res=>{
                      this.setState({posts: res.data}) //sets posts array to db array
                    }) 
                    .catch(err => {
                      console.log(err);
                    })
          })
          .catch(err =>{
              console.log('Error: ' + err);
          })
      
      console.log("delPost");
      window.alert("Post Deleted!");
      window.location = '/forum';
    }
  }

  /* edit the post: redirect to createPost page with every info in to resumbit,, after
  submit goes back to post page, NOT the main page */
  editPost(id){
      //go to edit post page
      console.log("editPost");
      window.location = `/forum/edit-post/${id}`;
  }

  /* change the status, if open -> closed, closed -> open */
  changeStatus(id){
    //when clicked will check state status, if closed=>open, open=>closed
    //do an update in db and get post again
    
    //get info of specific post
    axios.get(`http://localhost:3001/posts/${id}`)
         .then(res => {
            const updatedStatus = new FormData();
            updatedStatus.append("username", res.data.username);
            updatedStatus.append("category", res.data.category);
            updatedStatus.append("title", res.data.title);
            updatedStatus.append("description", res.data.description);
            updatedStatus.append("date", res.data.date);
            updatedStatus.append("img", res.data.img);
            updatedStatus.append("numComments", res.data.numComments);
            updatedStatus.append("comments", res.data.comments);

            if(res.data.status === "CLOSED"){          
              updatedStatus.append("status", "OPEN");        
            }
            else if(res.data.status === "OPEN"){          
                updatedStatus.append("status", "CLOSED");        
            }
            else{
                updatedStatus.append("status","");
            }

            // update post in db
            axios.post(`http://localhost:3001/posts/update/${id}`,updatedStatus)
            .then(res => {
                console.log(res.data); 
                //re get the forum db from mongo
                axios.get(`http://localhost:3001/posts/`)
                .then(res=>{
                    console.log("compDidMount: get post from db");
                    this.setState({posts: res.data})
                })
                .catch(err => {
                    console.log(err);
                })
            })
         })
  }

  // returns each individual post component
  postList(){
    return this.state.posts.map(currPost => {
      return <Post post = {currPost}
                   key = {currPost._id}
                   deletePost={() => this.deletePost(currPost._id)}
                   editPost={() => this.editPost(currPost._id)}
                   changeStatus={() => this.changeStatus(currPost._id)}
             />
    })

  }// end postList

  //checks to see if logged in
  permCreatePost(){
      if(this.isLoggedIn){
        return(
            <div className="createPostBtn">
                <a href="forum/create-post">
                    Create New Post
                </a>
                <br></br>
            </div>
        );
      }
      else{
        return(
          <div className="createPostBtn"/>           
        );
      }
  }
      
  // will rerender state 'posts' as just the category it chooses
  onChangeFilter(e){
    this.setState({
      filter : e.target.value,
    },() => {
      if(this.state.filter === "All"){
        axios.get('http://localhost:3001/posts') //get request
              .then(res=>{
                this.setState({posts: res.data}) //sets posts array to db array
              }) 
              .catch(err => {
                console.log(err);
              })
      }
      else if(this.state.filter === "Announcements"){
        axios.get('http://localhost:3001/posts/Announcements') //get request
              .then(res=>{
                this.setState({posts: res.data}) //sets posts array to db array
              }) 
              .catch(err => {
                console.log(err);
              })
      }
      else if(this.state.filter === "Lost and Found"){
        axios.get('http://localhost:3001/posts/Lost-And-Founds') //get request
              .then(res=>{
                this.setState({posts: res.data}) //sets posts array to db array
              }) 
              .catch(err => {
                console.log(err);
              })
      }
      else if(this.state.filter === "Crash Reports"){
        axios.get('http://localhost:3001/posts/Crash-Reports') //get request
              .then(res=>{
                this.setState({posts: res.data}) //sets posts array to db array
              }) 
              .catch(err => {
                console.log(err);
              })
      }
      else if(this.state.filter === "Others"){
        axios.get('http://localhost:3001/posts/Others') //get request
              .then(res=>{
                this.setState({posts: res.data}) //sets posts array to db array
              }) 
              .catch(err => {
                console.log(err);
              })
      }
      else if(this.state.filter === "Open Posts"){
        axios.get('http://localhost:3001/posts/Open-Posts') //get request
              .then(res=>{
                this.setState({posts: res.data}) //sets posts array to db array
              }) 
              .catch(err => {
                console.log(err);
              })
      }
      else if(this.state.filter === "Closed Posts"){
        axios.get('http://localhost:3001/posts/Closed-Posts') //get request
              .then(res=>{
                this.setState({posts: res.data}) //sets posts array to db array
              }) 
              .catch(err => {
                console.log(err);
              })
      }
    })

  }

  render(){
    return(
      <Layout user={this.state.user}>
        <Container>
          <h1><a href="/forum" style={{"textDecoration": "none", "color":"inherit"}}>Bike Forum</a></h1>
          <hr/>
          <br></br>
          <div className="main">
            {/* Create new post (should only be for users) */}
            
            { <div className="createPostBtn">
              { this.state.user && <input type="button" value="Create New Post" onClick={() => {window.location = "forum/create-post"}}/>}  
              { this.state.user && <br></br>}       
            </div> } 
            <br/>
            <select ref="categoryInput" 
                        required className="form-control" 
                        value={this.state.filter} 
                        onChange={this.onChangeFilter}
            >
              <option> All </option>
              <option>Announcements</option>
              <option>Lost and Found</option>
              <option>Crash Reports</option>
              <option>Others</option>
              <option>Open Posts</option>
              <option>Closed Posts</option>

            </select>
            <br/>
            {/* <pre>{JSON.stringify(this.state.user, null, 2)}</pre> */}
          
            <ol style={styles.postListStyle}>
              {this.postList()} {/*rendering all of container list elements*/}
            </ol>
          </div>
        </Container>
      </Layout>
    );
  }
}
