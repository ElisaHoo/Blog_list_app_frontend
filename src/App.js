import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import ErrorNotification from './components/ErrorNotification'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
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
    blogService.getAll().then(blogs => setBlogs( blogs ))
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
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)

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

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()  //form disappears when a new blog is added
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setNotificationMessage(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
    const b = await blogService.getAll()
    setBlogs(b)
  }

  // A reference to the component Togglable to access its "ToggleVisibility"
  const blogFormRef = useRef()

  const updateLikes = async (blogId, updatedBlog) => {
    const theBlog = blogs.find(blog => blog.id === blogId)
    const returnedBlog = await blogService.likes(blogId, updatedBlog)
    setBlogs(blogs.map(blog => blog.id !== blogId ? blog : { ...returnedBlog, user: theBlog.user }))
  }

  const removeBlog = async (blogId) => {
    const theBlog = blogs.find(blog => blog.id === blogId)
    const c = window.confirm(`Do you really want to delete the blog "${theBlog.title}" from the list?`)
    if (c) {
      await blogService.remove(blogId)
      setBlogs(blogs.filter(blog => blog.id !== blogId))
    }
  }

  return (
    <div>
      { <ErrorNotification message={errorMessage} /> }
      { <Notification message={notificationMessage} /> }

      {/* if user is not defined, blogForm is not displayed */}
      {!user &&
        <Togglable buttonLabel="Log in">
          <LoginForm
            username={username}
            password={password}
            handleLogin={handleLogin}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        </Togglable>
      }
      {user && <div>
        <form onSubmit={handleLogout}>
          <p>{user.name} logged in
            <button type='submit' style={{ 'marginLeft': 8 }}>Logout</button>
          </p>
        </form>
        <Togglable buttonLabel="Add a new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog}/>
        </Togglable>
        <h2>Blogs</h2>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <Blog key={blog.id} blog={blog} user={user} updateLikes={updateLikes} removeBlog={removeBlog}/>
          )}
      </div>
      }
    </div>
  )
}

export default App