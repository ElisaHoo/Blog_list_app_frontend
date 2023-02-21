import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import ErrorNotification from './components/ErrorNotification'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
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
    if (loggedUserJSON) {  // Application checks if the information of the logged-in user can be found in the local storage
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
      setErrorMessage('Wrong username or password')
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

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()  //form disappears when a new blog is added
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNotificationMessage(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
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

  // A reference to the component Togglable to access its "ToggleVisibility"
  const blogFormRef = useRef()

  return (
    <div>
      { <ErrorNotification message={errorMessage} /> }
      { <Notification message={notificationMessage} /> }

      {!user && loginForm()}  {/* if user is not defined blogForm is not displayed */}
      {user && <div>
        <form onSubmit={handleLogout}>
          <p>{user.name} logged in
          <button type='submit' style={{'marginLeft': 8}}>Logout</button>
          </p>
        </form>
        <Togglable buttonLabel="Create new" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
      }
    </div>
  )
}

export default App