import { useState } from "react"

const Blog = ({blog, user}) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    padding: 5,
    marginTop: 5,
    border: 'solid',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 5
  }

  if (visible) {
    return (
      <div style={blogStyle} display={showWhenVisible}>
        <div>{blog.title},{ }{blog.author}{ }<button onClick={toggleVisibility}>Hide</button></div>
        <div>{blog.url}</div>
        <div>likes {blog.likes}<button>Likes</button></div>
        <div>Created on the list: {user.name}</div>
      </div>  
    )
  } else {
    return(
      <div style={blogStyle} display={hideWhenVisible}>
        {blog.title},{ }{blog.author}{ }<button onClick={toggleVisibility}>View</button>
    </div>
    )
  }
}

export default Blog