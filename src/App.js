import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {  // Appllication checks if the information of the logged-in user can be found in the local storage
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])  // An empty list as a parameter ensures that efect is run only when the component is rendered for the first time

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({ username, password })
      // Login information is saved in the local storage (= db in the browser)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      
      setUser(user)  // includes servers response: token and users information
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title : newTitle,
      author: newAuthor,
      url: newUrl,
    }

    blogService
      .create(blogObject)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setNewTitle('')
          setNewAuthor('')
          setNewUrl('')
        })
  }

  const loginForm = () => (
    <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
              <input type="text" value={username} name="Username" 
              onChange={({ target }) => setUsername(target.value)}/>
          </div>
          <div>
            password
              <input type="password" value={password} name="Password"
              onChange={({ target }) => setPassword(target.value)}/>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
  )

  const blogForm = () => (
    <div>
        <h2>Blogs</h2>
        <h3>Create new</h3>
        <form onSubmit={addBlog}>
          Title:
            <input value={newTitle} onChange={({ target }) => setNewTitle(target.value)} /><br></br>
          Author:
            <input value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} /><br></br>
          Url:
            <input value={newUrl} onChange={({ target }) => setNewUrl(target.value)} /><br></br>
          <button type='submit'>Create</button>
        </form>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
  )

  return (
    <div>
      { <Notification message={errorMessage} /> }

      {!user && loginForm()}  {/* if user is not defined blogForm is not displayed */}
      {user && <div>
        <form onSubmit={handleLogout}>
          <p>{user.name} logged in
          <button type='submit' style={{'marginLeft': 8}}>Logout</button>
          </p>
        </form>
        {blogForm()}
      </div>
      }
    </div>
  )
}

export default App