import { useState } from "react"

const Blog = ({blog, user, updateLikes}) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const moreLikes = async (event) => {
    event.preventDefault()
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user
    }
    updateLikes(blog.id, updatedBlog)
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
        <div>{blog.title}, author {blog.author}{' '}<button onClick={toggleVisibility}>Hide</button></div>
        <div>{blog.url}</div>
        <div>Likes {blog.likes}{' '}<button onClick={moreLikes}>+1</button></div>
        <div>Added by {user.name}</div>
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